import type { Address } from "@comity/address";
import type { Customer } from "@comity/customer";
import type {
  OrderAddressSnapshot,
  OrderCreate,
  OrderCustomerSnapshot,
  OrderItem,
} from "@comity/order";
import type { Price } from "@comity/pricing";
import type { ChannelId, TenantId } from "@comity/primitives/scope";

import { Instant as InstantClass } from "@comity/primitives/time";

export interface OrderFactoryInput {
  /** Tenant the order belongs to. */
  readonly tenantId: TenantId;

  /** Commercial channel the order originated from. */
  readonly channelId: ChannelId;

  readonly customer: Customer;
  readonly shippingAddress?: Address;
  readonly billingAddress?: Address;
  readonly items: readonly OrderItem[];
  readonly price: Price;
  readonly meta?: Record<string, unknown>;
}

export interface OrderFactory {
  create(input: OrderFactoryInput): OrderCreate;
}

export class DefaultOrderFactory implements OrderFactory {
  create(input: OrderFactoryInput): OrderCreate {
    const now = InstantClass.now();

    const customerSnapshot: OrderCustomerSnapshot = {
      ...(input.customer.id !== undefined ? { customerId: input.customer.id.toString() } : {}),
      displayName: input.customer.displayName ?? "Customer",
      contacts: input.customer.contacts.map((c) => ({ type: c.type, value: c.value })),
      capturedAt: now,
    };

    const addressSnapshots: OrderAddressSnapshot[] = [];

    if (input.shippingAddress) {
      addressSnapshots.push({
        ...(input.shippingAddress.id !== undefined
          ? { addressId: input.shippingAddress.id.toString() }
          : {}),
        role: "shipping",
        lines: input.shippingAddress.lines.map((l) => l.toString()),
        city: input.shippingAddress.city,
        ...(input.shippingAddress.administrativeArea !== null &&
        input.shippingAddress.administrativeArea !== undefined
          ? { administrativeArea: input.shippingAddress.administrativeArea }
          : {}),
        postalCode: input.shippingAddress.postalCode,
        countryCode: input.shippingAddress.countryCode,
        capturedAt: now,
      });
    }

    if (input.billingAddress) {
      addressSnapshots.push({
        ...(input.billingAddress.id !== undefined
          ? { addressId: input.billingAddress.id.toString() }
          : {}),
        role: "billing",
        lines: input.billingAddress.lines.map((l) => l.toString()),
        city: input.billingAddress.city,
        ...(input.billingAddress.administrativeArea !== null &&
        input.billingAddress.administrativeArea !== undefined
          ? { administrativeArea: input.billingAddress.administrativeArea }
          : {}),
        postalCode: input.billingAddress.postalCode,
        countryCode: input.billingAddress.countryCode,
        capturedAt: now,
      });
    }

    return {
      tenantId: input.tenantId,
      channelId: input.channelId,
      items: [...input.items],
      price: input.price,
      customer: customerSnapshot,
      addresses: addressSnapshots,
      ...(input.meta !== undefined ? { meta: input.meta } : {}),
      createdAt: now,
      updatedAt: now,
    };
  }
}
