import type { Address } from "@comity/address";
import type { Customer } from "@comity/customer";
import type { OrderCreate, OrderItem, OrderRepository, OrderSnapshot } from "@comity/order";
import type { PaymentOutcome, PaymentRequest } from "@comity/payment";
import type { Money, Price } from "@comity/pricing";
import type { Result } from "@comity/primitives/result";
import type { ChannelId, TenantId } from "@comity/primitives/scope";
import type { PurchaseContext } from "../contracts/purchase-context.js";

import { Order, OrderId } from "@comity/order";
import { failure, isSuccess, success } from "@comity/primitives/result";
import { ChannelId as ChannelIdVO, TenantId as TenantIdVO } from "@comity/primitives/scope";
import { StorefrontError } from "../errors/storefront-error.js";

import type { AddressResolver } from "../services/address-resolver.js";
import type { CustomerLoader } from "../services/customer-loader.js";
import type { InventoryOperations } from "../services/inventory-operations.js";
import type { OrderFactory, OrderFactoryInput } from "../services/order-factory.js";
import type { PaymentOperations } from "../services/payment-operations.js";
import type { PricingService } from "../services/pricing-service.js";
import type { ProductResolver } from "../services/product-resolver.js";
import type { PaymentCompensation, PaymentCompensationProvider } from "../services/payment-compensation.js";

export interface PaymentFirstPlaceOrderInput {
  /** Tenant the order belongs to. */
  readonly tenantId: string;

  /** Commercial channel the order originates from. */
  readonly channelId: string;

  readonly customerId: string;
  readonly shippingAddressId: string;
  readonly billingAddressId: string;
  readonly items: readonly {
    readonly productId: string;
    readonly variantId?: string;
    readonly quantity: number;
  }[];
  readonly paymentReference?: string;
  readonly context: PurchaseContext;
  readonly meta?: Record<string, unknown>;
}

export interface PaymentFirstPlaceOrderOutput {
  readonly orderId: string;
  readonly order: OrderSnapshot;
}

export class PaymentFirstPlaceOrder {
  readonly #customerLoader: CustomerLoader;
  readonly #addressResolver: AddressResolver;
  readonly #productResolver: ProductResolver;
  readonly #pricingService: PricingService;
  readonly #inventoryOperations: InventoryOperations;
  readonly #paymentOperations: PaymentOperations;
  readonly #compensationProvider: PaymentCompensationProvider;
  readonly #orderFactory: OrderFactory;
  readonly #orderRepository: OrderRepository;

  constructor(
    customerLoader: CustomerLoader,
    addressResolver: AddressResolver,
    productResolver: ProductResolver,
    pricingService: PricingService,
    inventoryOperations: InventoryOperations,
    paymentOperations: PaymentOperations,
    compensationProvider: PaymentCompensationProvider,
    orderFactory: OrderFactory,
    orderRepository: OrderRepository
  ) {
    this.#customerLoader = customerLoader;
    this.#addressResolver = addressResolver;
    this.#productResolver = productResolver;
    this.#pricingService = pricingService;
    this.#inventoryOperations = inventoryOperations;
    this.#paymentOperations = paymentOperations;
    this.#compensationProvider = compensationProvider;
    this.#orderFactory = orderFactory;
    this.#orderRepository = orderRepository;
  }

  async execute(
    input: PaymentFirstPlaceOrderInput
  ): Promise<Result<PaymentFirstPlaceOrderOutput, StorefrontError>> {
    // 0. Validate tenant and channel identifiers
    const tenantIdResult = TenantIdVO.create(input.tenantId);
    if (!isSuccess(tenantIdResult)) {
      return failure(
        new StorefrontError("invalid_input", {
          details: { entityType: "order", entityId: input.tenantId, wrappedReason: "Invalid tenant" },
          cause: tenantIdResult.error,
        })
      );
    }
    const channelIdResult = ChannelIdVO.create(input.channelId);
    if (!isSuccess(channelIdResult)) {
      return failure(
        new StorefrontError("invalid_input", {
          details: { entityType: "order", entityId: input.channelId, wrappedReason: "Invalid channel" },
          cause: channelIdResult.error,
        })
      );
    }
    const tenantId: TenantId = tenantIdResult.value;
    const channelId: ChannelId = channelIdResult.value;

    // 1. Load customer
    const customerResult = await this.#customerLoader.load(input.customerId);
    if (!isSuccess(customerResult)) {
      return customerResult;
    }
    const customer = customerResult.value;

    // 2. Load addresses
    const addressesResult = await this.#addressResolver.resolveRequired(
      input.shippingAddressId,
      input.billingAddressId
    );
    if (!isSuccess(addressesResult)) {
      return addressesResult;
    }
    const { shipping: shippingAddress, billing: billingAddress } = addressesResult.value;

    // 3. Load products, evaluate purchase policy, map snapshots
    const resolvedItemsResult = await this.#productResolver.resolve(input.items, input.context);
    if (!isSuccess(resolvedItemsResult)) {
      return resolvedItemsResult;
    }
    const resolvedItems = resolvedItemsResult.value;

    // 4. Calculate pricing
    const pricingResult = await this.#pricingService.calculate(
      resolvedItems,
      input.context.currency
    );
    if (!isSuccess(pricingResult)) {
      return pricingResult;
    }
    const { items: orderItems, totalPrice } = pricingResult.value;

    // 5. Create Order (draft)
    const orderCreate = this.#createOrderCreate(
      input,
      tenantId,
      channelId,
      customer,
      shippingAddress,
      billingAddress,
      orderItems,
      totalPrice
    );
    const orderIdResult = OrderId.create(crypto.randomUUID());
    if (!isSuccess(orderIdResult)) {
      return failure(
        new StorefrontError("internal_error", {
          details: { entityType: "order" },
          cause: orderIdResult.error,
        })
      );
    }
    const order = new Order(orderCreate, orderIdResult.value);

    // 6. submit() (draft -> pending)
    const submitResult = order.submit();
    if (!isSuccess(submitResult)) {
      return failure(
        new StorefrontError("order_failed", {
          details: {
            entityType: "order",
            wrappedCode: submitResult.error.code,
            ...(submitResult.error.meta.reason !== undefined
              ? { wrappedReason: submitResult.error.meta.reason }
              : {}),
          },
          cause: submitResult.error,
        })
      );
    }

    // 7. Persist order (pending)
    const saveDraftResult = await this.#orderRepository.save(order);
    if (!isSuccess(saveDraftResult)) {
      return failure(
        new StorefrontError("internal_error", {
          details: {
            entityType: "order",
            wrappedCode: saveDraftResult.error.code,
            ...(saveDraftResult.error.meta.reason !== undefined
              ? { wrappedReason: saveDraftResult.error.meta.reason }
              : {}),
          },
          cause: saveDraftResult.error,
        })
      );
    }

    // 8. Initiate payment
    const paymentRequest: PaymentRequest = {
      amount: order.price.total,
      ...(input.paymentReference !== undefined
        ? { reference: input.paymentReference }
        : order.id !== undefined
          ? { reference: order.id.toString() }
          : {}),
    };

    const paymentResult = await this.#paymentOperations.initiate(paymentRequest);
    if (!isSuccess(paymentResult)) {
      return paymentResult;
    }

    const paymentOutcome = paymentResult.value;

    // 9. If payment outcome is not successful, return payment_failed
    if (paymentOutcome.status === "failed" || paymentOutcome.status === "cancelled") {
      return failure(
        new StorefrontError("payment_failed", {
          details: {
            entityType: "payment",
            wrappedReason: paymentOutcome.status,
          },
        })
      );
    }

    // 10. Reserve inventory
    const reservationsResult = await this.#inventoryOperations.reserve(orderItems, input.context);
    if (!isSuccess(reservationsResult)) {
      // Compensate payment - do not swallow compensation failure
      const compensationResult = await this.#compensatePayment(paymentOutcome);
      if (!isSuccess(compensationResult)) {
        // Compensation failed - return compensation_failed with original failure as cause
        const compensationError = compensationResult.error;
        return failure(
          new StorefrontError("compensation_failed", {
            cause: compensationResult,
            details: {
              entityType: "payment",
              wrappedCode: compensationError.code,
              wrappedReason: compensationError.meta.reason,
              ...(compensationError.meta.details !== undefined
                ? { details: compensationError.meta.details }
                : {}),
            },
          })
        );
      }
      return reservationsResult;
    }
    const reservations = reservationsResult.value;

    // 11. Commit inventory reservations
    const commitResult = await this.#inventoryOperations.commit(reservations, input.context);
    if (!isSuccess(commitResult)) {
      // Inventory commit failed - inventoryOperations.commit already released uncommitted reservations
      // Compensate payment
      const compensationResult = await this.#compensatePayment(paymentOutcome);
      if (!isSuccess(compensationResult)) {
        const compensationError = compensationResult.error;
        return failure(
          new StorefrontError("compensation_failed", {
            cause: compensationResult,
            details: {
              entityType: "payment",
              wrappedCode: compensationError.code,
              wrappedReason: compensationError.meta.reason,
              ...(compensationError.meta.details !== undefined
                ? { details: compensationError.meta.details }
                : {}),
            },
          })
        );
      }
      // Compensation succeeded - return original commit failure
      return commitResult;
    }

    // 12. Map PaymentOutcome -> OrderPaymentSnapshot and attach
    const paymentSnapshot = this.#paymentOperations.mapOutcome(paymentOutcome);
    order.attachPayment(paymentSnapshot);

    // 13. confirm() (pending -> confirmed)
    const confirmResult = order.confirm();
    if (!isSuccess(confirmResult)) {
      return failure(
        new StorefrontError("order_failed", {
          details: {
            entityType: "order",
            wrappedCode: confirmResult.error.code,
            ...(confirmResult.error.meta.reason !== undefined
              ? { wrappedReason: confirmResult.error.meta.reason }
              : {}),
          },
          cause: confirmResult.error,
        })
      );
    }

    // 14. orderRepository.save() (confirmed)
    const saveResult = await this.#orderRepository.save(order);
    if (!isSuccess(saveResult)) {
      return failure(
        new StorefrontError("internal_error", {
          details: {
            entityType: "order",
            wrappedCode: saveResult.error.code,
            ...(saveResult.error.meta.reason !== undefined
              ? { wrappedReason: saveResult.error.meta.reason }
              : {}),
          },
          cause: saveResult.error,
        })
      );
    }

    return success({
      orderId: order.id!.toString(),
      order: order.snapshot(),
    });
  }

  #createOrderCreate(
    input: PaymentFirstPlaceOrderInput,
    tenantId: TenantId,
    channelId: ChannelId,
    customer: Customer,
    shippingAddress: Address,
    billingAddress: Address,
    items: readonly OrderItem[],
    price: Price
  ): OrderCreate {
    const factoryInput: OrderFactoryInput = {
      tenantId,
      channelId,
      customer,
      shippingAddress,
      billingAddress,
      items,
      price,
      ...(input.meta !== undefined ? { meta: input.meta } : {}),
    };
    return this.#orderFactory.create(factoryInput);
  }

  async #compensatePayment(paymentOutcome: PaymentOutcome): Promise<Result<void, StorefrontError>> {
    const paymentId = paymentOutcome.paymentId;
    if (paymentId === undefined) {
      return failure(
        new StorefrontError("compensation_failed", {
          cause: new StorefrontError("internal_error", {
            details: {
              entityType: "payment",
              wrappedReason: "missing_payment_id",
            },
          }),
          details: {
            entityType: "payment",
            wrappedCode: "internal_error",
            wrappedReason: "missing_payment_id",
          },
        })
      );
    }

    const compensation: PaymentCompensation = {
      paymentId,
      amount: paymentOutcome.amount,
    };
    return this.#compensationProvider.compensate(compensation);
  }
}