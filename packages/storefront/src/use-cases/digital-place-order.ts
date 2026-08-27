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

import type { CustomerLoader } from "../services/customer-loader.js";
import type { OrderFactory, OrderFactoryInput } from "../services/order-factory.js";
import type { PaymentOperations } from "../services/payment-operations.js";
import type { PricingService } from "../services/pricing-service.js";
import type { ProductResolver } from "../services/product-resolver.js";

/**
 * Input for placing a digital order.
 */
export interface DigitalPlaceOrderInput {
  /** Tenant the order belongs to. */
  readonly tenantId: string;

  /** Commercial channel the order originates from. */
  readonly channelId: string;

  /** Customer identifier. */
  readonly customerId: string;

  /** Order line items. */
  readonly items: readonly {
    readonly productId: string;
    readonly variantId?: string;
    readonly quantity: number;
  }[];

  /** Optional payment reference (e.g., idempotency key or client reference). */
  readonly paymentReference?: string;

  /** Commercial context for purchasability evaluation. */
  readonly context: PurchaseContext;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}

/**
 * Result of a successful digital order placement.
 */
export interface DigitalPlaceOrderOutput {
  /** The created order identifier. */
  readonly orderId: string;

  /** The order snapshot. */
  readonly order: OrderSnapshot;
}

/**
 * Application use case for placing a digital order.
 *
 * Digital checkouts do not require:
 * - Address resolution (no physical shipping)
 * - Inventory operations (digital goods have no stock constraints)
 * - Warehouse selection
 *
 * Orchestrates the checkout flow:
 * 1. Load customer
 * 2. Load products, evaluate purchase policy, map snapshots
 * 3. Calculate pricing
 * 4. Create Order (draft)
 * 5. Submit order (draft -> pending)
 * 6. Initiate payment
 * 7. If payment fails: return payment_failed
 * 8. Confirm order (pending -> confirmed)
 * 9. Persist order
 */
export class DigitalPlaceOrder {
  readonly #customerLoader: CustomerLoader;
  readonly #productResolver: ProductResolver;
  readonly #pricingService: PricingService;
  readonly #paymentOperations: PaymentOperations;
  readonly #orderFactory: OrderFactory;
  readonly #orderRepository: OrderRepository;

  constructor(
    customerLoader: CustomerLoader,
    productResolver: ProductResolver,
    pricingService: PricingService,
    paymentOperations: PaymentOperations,
    orderFactory: OrderFactory,
    orderRepository: OrderRepository
  ) {
    this.#customerLoader = customerLoader;
    this.#productResolver = productResolver;
    this.#pricingService = pricingService;
    this.#paymentOperations = paymentOperations;
    this.#orderFactory = orderFactory;
    this.#orderRepository = orderRepository;
  }

  /**
   * Executes the digital place order use case.
   *
   * @param input - Order placement input
   *
   * @returns Order placement result
   */
  async execute(
    input: DigitalPlaceOrderInput
  ): Promise<Result<DigitalPlaceOrderOutput, StorefrontError>> {
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

    // 2. Load products, evaluate purchase policy, map snapshots
    const resolvedItemsResult = await this.#productResolver.resolve(input.items, input.context);
    if (!isSuccess(resolvedItemsResult)) {
      return resolvedItemsResult;
    }
    const resolvedItems = resolvedItemsResult.value;

    // 3. Calculate pricing
    const pricingResult = await this.#pricingService.calculate(
      resolvedItems,
      input.context.currency
    );
    if (!isSuccess(pricingResult)) {
      return pricingResult;
    }
    const { items: orderItems, totalPrice } = pricingResult.value;

    // 3. Create Order (draft)
    const orderCreate = this.#createOrderCreate(
      input,
      tenantId,
      channelId,
      customer,
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

    // 4. submit() (draft -> pending)
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

    // 5. Initiate payment
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

    // If payment outcome is not successful, return payment_failed
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

    // Map PaymentOutcome -> OrderPaymentSnapshot and attach
    const paymentSnapshot = this.#paymentOperations.mapOutcome(paymentOutcome);
    order.attachPayment(paymentSnapshot);

    // confirm() (pending -> confirmed)
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

    // orderRepository.save()
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
    input: DigitalPlaceOrderInput,
    tenantId: TenantId,
    channelId: ChannelId,
    customer: Customer,
    items: readonly OrderItem[],
    price: Price
  ): OrderCreate {
    const factoryInput: OrderFactoryInput = {
      tenantId,
      channelId,
      customer,
      items,
      price,
      ...(input.meta !== undefined ? { meta: input.meta } : {}),
    };
    return this.#orderFactory.create(factoryInput);
  }
}
