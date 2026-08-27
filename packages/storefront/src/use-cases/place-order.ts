import type { Address } from "@comity/address";
import type { Customer } from "@comity/customer";
import type { OrderCreate, OrderItem, OrderRepository, OrderSnapshot } from "@comity/order";
import type { PaymentOutcome, PaymentRequest } from "@comity/payment";
import type { Price } from "@comity/pricing";
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

/**
 * Item specification for placing an order.
 */
export interface PlaceOrderItemInput {
  /** Product identifier. */
  readonly productId: string;

  /** Optional variant identifier. */
  readonly variantId?: string;

  /** Quantity to purchase. */
  readonly quantity: number;
}

/**
 * Input for placing an order.
 */
export interface PlaceOrderInput {
  /** Tenant the order belongs to. */
  readonly tenantId: string;

  /** Commercial channel the order originates from. */
  readonly channelId: string;

  /** Customer identifier. */
  readonly customerId: string;

  /** Shipping address identifier. */
  readonly shippingAddressId: string;

  /** Billing address identifier. */
  readonly billingAddressId: string;

  /** Order line items. */
  readonly items: readonly PlaceOrderItemInput[];

  /** Optional payment reference (e.g., idempotency key or client reference). */
  readonly paymentReference?: string;

  /** Commercial context for purchasability evaluation. */
  readonly context: PurchaseContext;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}

/**
 * Result of a successful order placement.
 */
export interface PlaceOrderOutput {
  /** The created order identifier. */
  readonly orderId: string;

  /** The order snapshot. */
  readonly order: OrderSnapshot;
}

/**
 * Application use case for placing an order (Workflow A: reserve first).
 *
 * Orchestrates the complete checkout flow:
 * 1. Load customer
 * 2. Load addresses
 * 3. Load products, evaluate purchase policy, map snapshots
 * 4. Calculate pricing
 * 5. Reserve inventory
 * 6. Create Order
 * 7. Submit order (draft -> pending)
 * 8. Initiate payment
 * 9. If payment fails: release reservations, return payment_failed
 * 10. Commit inventory reservations
 * 11. If commit fails: release uncommitted reservations, compensate payment
 * 12. Confirm order (pending -> confirmed)
 * 13. Persist order
 */
export class PlaceOrder {
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

  /**
   * Executes the place order use case.
   *
   * @param input - Order placement input
   *
   * @returns Order placement result
   */
  async execute(input: PlaceOrderInput): Promise<Result<PlaceOrderOutput, StorefrontError>> {
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

    // 5. Reserve inventory
    const reservationsResult = await this.#inventoryOperations.reserve(orderItems, input.context);
    if (!isSuccess(reservationsResult)) {
      return reservationsResult;
    }
    const reservations = reservationsResult.value;

    // 6. Create Order
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
      // OrderId creation failed - release all reservations
      await this.#inventoryOperations.release(reservations);
      return failure(
        new StorefrontError("internal_error", {
          details: { entityType: "order" },
          cause: orderIdResult.error,
        })
      );
    }
    const order = new Order(orderCreate, orderIdResult.value);

    // 7. submit() (draft -> pending)
    const submitResult = order.submit();
    if (!isSuccess(submitResult)) {
      await this.#inventoryOperations.release(reservations);
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
      await this.#inventoryOperations.release(reservations);
      return paymentResult;
    }

    const paymentOutcome = paymentResult.value;

    // 9. Map PaymentOutcome -> OrderPaymentSnapshot
    const paymentSnapshot = this.#paymentOperations.mapOutcome(paymentOutcome);

    // 10. attachPayment()
    order.attachPayment(paymentSnapshot);

    // If payment outcome is not successful, release reservations and return payment_failed error
    if (paymentOutcome.status === "failed" || paymentOutcome.status === "cancelled") {
      await this.#inventoryOperations.release(reservations);
      return failure(
        new StorefrontError("payment_failed", {
          details: {
            entityType: "payment",
            wrappedReason: paymentOutcome.status,
          },
        })
      );
    }

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

    // 12. confirm() (pending -> confirmed)
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

    // 13. orderRepository.save()
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
    input: PlaceOrderInput,
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