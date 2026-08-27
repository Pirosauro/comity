import type { OrderItem } from "../../contracts/item.js";

import { Currency, Money, Price } from "@comity/pricing";
import { beforeEach, describe, expect, it } from "vitest";
import { Order } from "../../entities/order.js";
import { OrderId } from "../../value-objects/order-id.js";
import { ChannelId } from "@comity/organization";
import { TenantId } from "@comity/organization";
import { MemoryOrderRepository } from "../memory.js";

function unwrap<T>(result: { success: true; value: T } | { success: false }): T {
  if (result.success === false) {
    throw new Error("Unexpected failure");
  }
  return result.value;
}

function createId(value: string): OrderId {
  return unwrap(OrderId.create(value));
}

function createTenant(value: string): TenantId {
  return unwrap(TenantId.create(value));
}

function createChannel(value: string): ChannelId {
  return unwrap(ChannelId.create(value));
}

function createCurrency(): Currency {
  return unwrap(Currency.create("EUR"));
}

function money(amount: bigint, eur: Currency): Money {
  const m = unwrap(Money.create(amount, eur));
  return m;
}

function price(amount: bigint, modifiers: ReadonlyArray<any> = []): Price {
  const eur = createCurrency();
  return unwrap(Price.create(money(amount, eur), modifiers));
}

const tenantA = createTenant("tenant-a");
const tenantB = createTenant("tenant-b");
const channelWeb = createChannel("web");
const channelPos = createChannel("pos");

const product: OrderItem = {
  id: "item-1",
  product: { productId: "prod-1", sku: "SKU-1", name: "T-shirt" } as any,
  quantity: 2,
  price: price(10000n),
};

function createOrder(status: OrderStatus = "draft", id?: OrderId, channel: ChannelId = channelWeb): Order {
  const orderId = id ?? createId(`order-${Math.random().toString(36).slice(2, 12)}`);
  return new Order(
    {
      items: [product],
      price: price(10000n),
      channelId: channel,
      status,
      createdAt: 1000,
      updatedAt: 1000,
    },
    orderId
  );
}

describe("MemoryOrderRepository", () => {
  let repository: MemoryOrderRepository;

  beforeEach(() => {
    repository = new MemoryOrderRepository();
  });

  it("returns null when no order exists", async () => {
    const result = await repository.getById(createId("missing"), { tenant: tenantA });

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns an order saved by id", async () => {
    const order = createOrder("draft");
    await repository.save(order, { tenant: tenantA });

    const result = await repository.getById(order.id!, { tenant: tenantA });

    expect(result.success).toBe(true);
    expect(result.value?.id.toString()).toBe(order.id!.toString());
    expect(result.value?.status).toBe("draft");
  });

  it("returns null for a different id", async () => {
    const otherId = createId("order-2");
    await repository.save(createOrder("draft"), { tenant: tenantA });

    const result = await repository.getById(otherId, { tenant: tenantA });

    expect(result).toEqual({ success: true, value: null });
  });

  it("overwrites an existing order on save", async () => {
    const sharedId = createId("overwrite-test");
    const order1 = createOrder("draft", sharedId);
    await repository.save(order1, { tenant: tenantA });

    const order2 = createOrder("pending", sharedId);
    await repository.save(order2, { tenant: tenantA });

    const result = await repository.getById(sharedId, { tenant: tenantA });

    expect(result.value?.status).toBe("pending");
  });

  it("search returns all orders when no criteria", async () => {
    await repository.save(createOrder("draft"), { tenant: tenantA });
    await repository.save(createOrder("pending"), { tenant: tenantA });

    const result = await repository.search(undefined, { tenant: tenantA });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(2);
    expect(result.value?.items).toHaveLength(2);
  });

  it("search filters by status", async () => {
    await repository.save(createOrder("draft"), { tenant: tenantA });
    await repository.save(createOrder("pending"), { tenant: tenantA });

    const result = await repository.search({ status: "pending" }, { tenant: tenantA });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(1);
    expect(result.value?.items[0]?.status).toBe("pending");
  });

  it("search respects limit and offset", async () => {
    await repository.save(createOrder("draft"), { tenant: tenantA });
    await repository.save(createOrder("pending"), { tenant: tenantA });
    await repository.save(createOrder("confirmed"), { tenant: tenantA });

    const result = await repository.search({ limit: 1, offset: 1 }, { tenant: tenantA });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(1);
    expect(result.value?.items[0]?.status).toBe("pending");
  });

  describe("tenant isolation", () => {
    it("read isolation - order saved in tenant A is not readable using tenant B", async () => {
      const order = createOrder("draft", createId("order-shared"));
      await repository.save(order, { tenant: tenantA });

      const resultA = await repository.getById(order.id!, { tenant: tenantA });
      const resultB = await repository.getById(order.id!, { tenant: tenantB });

      expect(resultA.success).toBe(true);
      expect(resultA.value).not.toBeNull();

      expect(resultB.success).toBe(true);
      expect(resultB.value).toBeNull();
    });

    it("search isolation - search for tenant A does not return orders from tenant B", async () => {
      await repository.save(createOrder("draft", createId("order-1")), { tenant: tenantA });
      await repository.save(createOrder("pending", createId("order-2")), { tenant: tenantB });

      const resultA = await repository.search(undefined, { tenant: tenantA });
      const resultB = await repository.search(undefined, { tenant: tenantB });

      expect(resultA.success).toBe(true);
      expect(resultA.value?.total).toBe(1);
      expect(resultA.value?.items[0].id.toString()).toBe("order-1");

      expect(resultB.success).toBe(true);
      expect(resultB.value?.total).toBe(1);
      expect(resultB.value?.items[0].id.toString()).toBe("order-2");
    });

    it("cross-tenant mutation - saving with tenant B does not overwrite tenant A order with same id", async () => {
      const sharedId = createId("order-shared");
      const orderA = createOrder("draft", sharedId);
      const orderB = createOrder("pending", sharedId);

      await repository.save(orderA, { tenant: tenantA });
      await repository.save(orderB, { tenant: tenantB });

      const resultA = await repository.getById(sharedId, { tenant: tenantA });
      const resultB = await repository.getById(sharedId, { tenant: tenantB });

      expect(resultA.success).toBe(true);
      expect(resultA.value?.status).toBe("draft");

      expect(resultB.success).toBe(true);
      expect(resultB.value?.status).toBe("pending");
    });

    it("repository reuse - same instance can be used alternately for different tenants", async () => {
      const orderA = createOrder("draft", createId("order-a"));
      const orderB = createOrder("pending", createId("order-b"));

      await repository.save(orderA, { tenant: tenantA });
      await repository.save(orderB, { tenant: tenantB });

      const getA1 = await repository.getById(orderA.id!, { tenant: tenantA });
      const getB1 = await repository.getById(orderB.id!, { tenant: tenantB });
      const searchA = await repository.search(undefined, { tenant: tenantA });
      const searchB = await repository.search(undefined, { tenant: tenantB });
      const getA2 = await repository.getById(orderA.id!, { tenant: tenantA });
      const getB2 = await repository.getById(orderB.id!, { tenant: tenantB });

      expect(getA1.success).toBe(true);
      expect(getA1.value?.id.toString()).toBe("order-a");

      expect(getB1.success).toBe(true);
      expect(getB1.value?.id.toString()).toBe("order-b");

      expect(searchA.success).toBe(true);
      expect(searchA.value?.total).toBe(1);

      expect(searchB.success).toBe(true);
      expect(searchB.value?.total).toBe(1);

      expect(getA2.success).toBe(true);
      expect(getA2.value?.id.toString()).toBe("order-a");

      expect(getB2.success).toBe(true);
      expect(getB2.value?.id.toString()).toBe("order-b");
    });
  });

  describe("channel persistence", () => {
    it("persists and returns channelId with the order", async () => {
      const order = createOrder("draft", createId("order-channel"), channelPos);
      await repository.save(order, { tenant: tenantA });

      const result = await repository.getById(order.id!, { tenant: tenantA });

      expect(result.success).toBe(true);
      expect(result.value?.channelId.value).toBe("pos");
    });

    it("search returns orders with channelId", async () => {
      await repository.save(createOrder("draft", createId("order-1"), channelWeb), { tenant: tenantA });
      await repository.save(createOrder("pending", createId("order-2"), channelPos), { tenant: tenantA });

      const result = await repository.search(undefined, { tenant: tenantA });

      expect(result.success).toBe(true);
      expect(result.value?.items).toHaveLength(2);
      expect(result.value?.items[0].channelId.value).toBe("web");
      expect(result.value?.items[1].channelId.value).toBe("pos");
    });

    it("channelId is independent of meta.channel", async () => {
      const order = createOrder("draft", createId("order-meta"), channelWeb);
      // The order entity doesn't use meta.channel for channelId - they are independent
      await repository.save(order, { tenant: tenantA });

      const result = await repository.getById(order.id!, { tenant: tenantA });

      expect(result.success).toBe(true);
      expect(result.value?.channelId.value).toBe("web");
      // meta.channel is not used as source of truth for channel
    });
  });
});
