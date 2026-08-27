import type { Price } from "@comity/pricing";
import type { Result } from "@comity/primitives/result";
import type { OrderAddressSnapshot } from "../contracts/address-snapshot.js";
import type { OrderContact } from "../contracts/contact.js";
import type { OrderCustomerSnapshot } from "../contracts/customer-snapshot.js";
import type { OrderItem, OrderProductSnapshot, OrderVariantSnapshot } from "../contracts/item.js";
import type {
  OrderCreate,
  OrderItemInput,
  OrderSnapshot,
  OrderStatus,
  OrderUpdate,
} from "../contracts/order.js";
import type { OrderPaymentSnapshot } from "../contracts/payment-snapshot.js";
import type { OrderId } from "../value-objects/order-id.js";
import type { ChannelId } from "@comity/organization";

import { failure, success } from "@comity/primitives/result";
import { Instant } from "@comity/primitives/time";
import { transitionOrderStatus } from "../domain/order-transitions.js";
import { OrderError } from "../errors/order.js";

/**
 * Returns a defensive copy of a product snapshot so later mutations of the
 * input cannot leak into the order.
 *
 * @param snapshot - The product snapshot to copy.
 *
 * @returns A defensive copy of the snapshot.
 */
function copyProductSnapshot(snapshot: OrderProductSnapshot): OrderProductSnapshot {
  /**
   * Returns a defensive copy of a variant snapshot.
   *
   * @param variant - The variant snapshot to copy.
   *
   * @returns A defensive copy of the variant.
   */
  const copyVariant = (variant: OrderVariantSnapshot): OrderVariantSnapshot => ({
    ...variant,
    ...(variant.attributes !== undefined
      ? { attributes: variant.attributes.map((attribute) => ({ ...attribute })) }
      : {}),
    ...(variant.options !== undefined
      ? { options: variant.options.map((option) => ({ ...option })) }
      : {}),
  });

  return {
    ...snapshot,
    ...(snapshot.attributes !== undefined
      ? { attributes: snapshot.attributes.map((attribute) => ({ ...attribute })) }
      : {}),
    ...(snapshot.options !== undefined
      ? { options: snapshot.options.map((option) => ({ ...option })) }
      : {}),
    ...(snapshot.variant !== undefined ? { variant: copyVariant(snapshot.variant) } : {}),
    ...(snapshot.metadata !== undefined ? { metadata: { ...snapshot.metadata } } : {}),
  };
}

/**
 * Returns a defensive copy of a contact so later mutations of the input cannot
 * leak into the order.
 *
 * @param contact - The contact to copy.
 *
 * @returns A defensive copy of the contact.
 */
function copyContact(contact: OrderContact): OrderContact {
  return { ...contact };
}

/**
 * Returns a defensive copy of the buyer fact so later mutations of the input
 * cannot leak into the order.
 *
 * @param customer - The customer fact to copy.
 *
 * @returns A defensive copy of the customer fact.
 */
function copyCustomerSnapshot(customer: OrderCustomerSnapshot): OrderCustomerSnapshot {
  return {
    ...customer,
    ...(customer.contacts !== undefined
      ? { contacts: customer.contacts.map((contact) => copyContact(contact)) }
      : {}),
  };
}

/**
 * Returns a defensive copy of an address fact so later mutations of the input
 * cannot leak into the order.
 *
 * @param address - The address fact to copy.
 *
 * @returns A defensive copy of the address fact.
 */
function copyAddressSnapshot(address: OrderAddressSnapshot): OrderAddressSnapshot {
  return {
    ...address,
    lines: [...address.lines],
  };
}

/**
 * Returns whether a stored address fact and a replacement destination are
 * structurally identical.
 *
 * @param address - The address fact stored on the order.
 * @param destination - The replacement destination to compare against.
 *
 * @returns `true` when every field matches, otherwise `false`.
 */
function isSameShippingDestination(
  address: OrderAddressSnapshot,
  destination: Omit<OrderAddressSnapshot, "role">,
): boolean {
  return (
    address.addressId === destination.addressId &&
    address.lines.length === destination.lines.length &&
    address.lines.every((line, index) => line === destination.lines[index]) &&
    address.city === destination.city &&
    address.administrativeArea === destination.administrativeArea &&
    address.postalCode === destination.postalCode &&
    address.countryCode === destination.countryCode &&
    address.capturedAt.epochMilliseconds === destination.capturedAt.epochMilliseconds
  );
}

/**
 * Represents an order entity in the system.
 *
 * @remark
 * An order is a lifecycle aggregate: it owns its status transitions, its line
 * items, the applied pricing result, and its historical facts (buyer,
 * addresses, payment). It does not validate coupons, does not know promotion
 * rules, and does not orchestrate external services — those concerns belong
 * to `@comity/pricing`, other Core Modules, and application/domain services.
 */
export class Order {
  #id: OrderId | undefined;
  #status: OrderStatus;
  #items: OrderItem[];
  #price: Price;
  #channelId: ChannelId;
  #customer: OrderCustomerSnapshot | undefined;
  #addresses: OrderAddressSnapshot[] | undefined;
  #payments: OrderPaymentSnapshot[] | undefined;
  #meta: Record<string, unknown> | undefined;
  readonly #createdAt: Instant;
  #updatedAt: Instant;

  /**
   * @param fields - The fields used to create or hydrate the order.
   * @param id - The unique identifier of the order, if it has been assigned.
   */
  constructor(fields: OrderCreate, id?: OrderId) {
    this.#id = id;
    this.#status = fields.status ?? "draft";
    this.#items = [...fields.items];
    this.#price = fields.price;
    this.#channelId = fields.channelId;
    this.#customer = fields.customer !== undefined ? copyCustomerSnapshot(fields.customer) : undefined;
    this.#addresses =
      fields.addresses !== undefined ? fields.addresses.map((address) => copyAddressSnapshot(address)) : undefined;
    this.#payments =
      fields.payments !== undefined
        ? fields.payments.map((payment) => ({ ...payment }))
        : undefined;
    this.#meta = fields.meta ? { ...fields.meta } : undefined;
    this.#createdAt = fields.createdAt ?? Instant.now();
    this.#updatedAt = fields.updatedAt ?? this.#createdAt;
  }

  /**
   * @returns The unique identifier of the order, if it has been assigned.
   */
  get id(): OrderId | undefined {
    return this.#id;
  }

  /**
   * @returns The commercial channel through which the order was placed.
   */
  get channelId(): ChannelId {
    return this.#channelId;
  }

  /**
   * @returns The lifecycle status of the order.
   */
  get status(): OrderStatus {
    return this.#status;
  }

  /**
   * @returns The order items.
   */
  get items(): ReadonlyArray<OrderItem> {
    return [...this.#items];
  }

  /**
   * @returns The order price.
   */
  get price(): Price {
    return this.#price;
  }

  /**
   * @returns The historical buyer fact, if captured.
   */
  get customer(): OrderCustomerSnapshot | undefined {
    return this.#customer !== undefined
      ? {
          ...this.#customer,
          ...(this.#customer.contacts !== undefined
            ? { contacts: this.#customer.contacts.map((contact) => ({ ...contact })) }
            : {}),
        }
      : undefined;
  }

  /**
   * @returns The historical address facts, if captured.
   */
  get addresses(): ReadonlyArray<OrderAddressSnapshot> | undefined {
    return this.#addresses !== undefined
      ? this.#addresses.map((address) => ({ ...address, lines: [...address.lines] }))
      : undefined;
  }

  /**
   * @returns The historical payment facts, if attached.
   */
  get payments(): ReadonlyArray<OrderPaymentSnapshot> | undefined {
    return this.#payments?.map((payment) => ({ ...payment }));
  }

  /**
   * @returns The custom metadata of the order, if any.
   */
  get meta(): Readonly<Record<string, unknown>> | undefined {
    return this.#meta ? { ...this.#meta } : undefined;
  }

  /**
   * @returns The timestamp when the order was created.
   */
  get createdAt(): Instant {
    return this.#createdAt;
  }

  /**
   * @returns The timestamp when the order was last updated.
   */
  get updatedAt(): Instant {
    return this.#updatedAt;
  }

  /**
   * Updates the applied pricing result and metadata.
   *
   * Status transitions are performed through the domain methods; items are
   * mutated through `addItem`/`removeItem`/`updateItemQuantity`.
   *
   * @param changes - The changes to apply to the order.
   */
  update(changes: OrderUpdate): void {
    if (changes.price !== undefined) {
      this.#price = changes.price;
    }

    if (changes.meta !== undefined) {
      this.#meta = { ...changes.meta };
    }

    this.#updatedAt = Instant.now();
  }

  /**
   * Appends a historical payment fact to the order.
   *
   * A payment may be processed after the order is created, so the outcome is
   * recorded through a dedicated method rather than the generic update path.
   * This records a historical fact only: it performs no payment logic, knows
   * no payment module, and does not coordinate, authorize, or capture.
   *
   * @param snapshot - The payment fact to record.
   */
  attachPayment(snapshot: OrderPaymentSnapshot): void {
    this.#payments = [
      ...(this.#payments ?? []),
      { ...snapshot },
    ];

    this.#updatedAt = Instant.now();
  }

  /**
   * Replaces the shipping destination of the order.
   *
   * Allowed only while the order is `draft | pending`; in later statuses the
   * shipping destination is immutable (ADR-018). The order must hold exactly
   * one shipping address fact; a missing or ambiguous one is an error rather
   * than a guess. A structurally identical destination is a successful no-op
   * that leaves timestamps untouched. The operation never reaches the generic
   * `update()` path, never touches billing, customer, item, price, or payment
   * facts, and records no history: the aggregate retains only the current
   * shipping destination.
   *
   * @param destination - The replacement shipping destination. The address
   * role is owned by this operation and is always stored as `"shipping"`.
   *
   * @returns A result indicating the success or failure of the change.
   */
  changeShippingDestination(
    destination: Omit<OrderAddressSnapshot, "role">,
  ): Result<void, OrderError> {
    if (this.#status !== "draft" && this.#status !== "pending") {
      return failure(
        new OrderError("shipping_destination_immutable", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
          },
        })
      );
    }

    const addresses = this.#addresses;
    const shipping = (addresses ?? []).filter((address) => address.role === "shipping");
    const current = shipping.length === 1 ? shipping[0] : undefined;

    if (current === undefined || addresses === undefined) {
      return failure(
        new OrderError("ambiguous_shipping_destination", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
          },
        })
      );
    }

    if (isSameShippingDestination(current, destination)) {
      return success(undefined);
    }

    this.#addresses = addresses.map((address) =>
      address.role === "shipping" ? copyAddressSnapshot({ ...destination, role: "shipping" }) : address
    );
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Adds an item to the order.
   *
   * @param input - The item data to add.
   *
   * @returns The created item, or an `invalid_quantity` error when the
   * quantity is not a positive integer.
   */
  addItem(input: OrderItemInput): Result<OrderItem, OrderError> {
    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      return failure(
        new OrderError("invalid_quantity", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
            field: "quantity",
          },
        })
      );
    }

    const item: OrderItem = {
      id: crypto.randomUUID(),
      product: copyProductSnapshot(input.product),
      quantity: input.quantity,
      price: input.price,
    };

    this.#items.push(item);
    this.#updatedAt = Instant.now();

    return success(item);
  }

  /**
   * Removes an item from the order.
   *
   * @param itemId - The order item ID.
   *
   * @returns A result indicating the success or failure of the removal.
   */
  removeItem(itemId: string): Result<void, OrderError> {
    const index = this.#items.findIndex((item) => item.id === itemId);

    if (index === -1) {
      return failure(
        new OrderError("invalid_item", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
            itemId,
          },
        })
      );
    }

    this.#items.splice(index, 1);
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Updates the quantity of an order item.
   *
   * @param itemId - The order item ID.
   * @param quantity - The new quantity.
   *
   * @returns A result indicating the success or failure of the update.
   */
  updateItemQuantity(itemId: string, quantity: number): Result<void, OrderError> {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return failure(
        new OrderError("invalid_quantity", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
            itemId,
            field: "quantity",
          },
        })
      );
    }

    const index = this.#items.findIndex((candidate) => candidate.id === itemId);

    if (index === -1) {
      return failure(
        new OrderError("invalid_item", {
          details: {
            ...(this.#id !== undefined ? { orderId: this.#id.toString() } : {}),
            itemId,
          },
        })
      );
    }

    const current = this.#items[index];

    if (current !== undefined) {
      this.#items[index] = { ...current, quantity };
      this.#updatedAt = Instant.now();
    }

    return success(undefined);
  }

  /**
   * Submits the order: `draft` → `pending`.
   *
   * @returns A result indicating the success or failure of the transition.
   */
  submit(): Result<void, OrderError> {
    return this.#transition("pending");
  }

  /**
   * Confirms the order: `pending` → `confirmed`.
   *
   * @returns A result indicating the success or failure of the transition.
   */
  confirm(): Result<void, OrderError> {
    return this.#transition("confirmed");
  }

  /**
   * Fulfills the order: `confirmed` → `fulfilled`.
   *
   * @returns A result indicating the success or failure of the transition.
   */
  fulfill(): Result<void, OrderError> {
    return this.#transition("fulfilled");
  }

  /**
   * Cancels the order: `draft | pending | confirmed` → `cancelled`.
   *
   * @returns A result indicating the success or failure of the transition.
   */
  cancel(): Result<void, OrderError> {
    return this.#transition("cancelled");
  }

  /**
   * Creates a snapshot of the current state of the order.
   * Requires the order to have an assigned identifier.
   *
   * @returns A snapshot representing the current state of the order.
   */
  snapshot(): OrderSnapshot {
    return {
      id: this.#id as OrderId,
      status: this.#status,
      items: [...this.#items],
      price: this.#price,
      channelId: this.#channelId,
      ...(this.#customer !== undefined ? { customer: copyCustomerSnapshot(this.#customer) } : {}),
      ...(this.#addresses !== undefined
        ? { addresses: this.#addresses.map((address) => copyAddressSnapshot(address)) }
        : {}),
      ...(this.#payments !== undefined
        ? {
            payments: this.#payments.map((payment) => ({ ...payment })),
          }
        : {}),
      ...(this.#meta !== undefined ? { meta: { ...this.#meta } } : {}),
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      capturedAt: Instant.now(),
    };
  }

  /**
   * Applies a lifecycle transition through the centralized transition rules.
   *
   * @param to - The target status.
   *
   * @returns A result indicating the success or failure of the transition.
   */
  #transition(to: OrderStatus): Result<void, OrderError> {
    const result = transitionOrderStatus(this.#status, to);

    if (!result.success) {
      return result;
    }

    this.#status = to;
    this.#updatedAt = Instant.now();

    return success(undefined);
  }
}
