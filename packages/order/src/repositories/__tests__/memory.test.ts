import type { OrderItem } from "../../contracts/item.js";

import { Currency, Money, Price } from "@comity/pricing";
import { beforeEach, describe, expect, it } from "vitest";
import { Order } from "../../entities/order.js";
import { OrderId } from "../../value-objects/order-id.js";
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

const baseId = createId("order-1");
const product: OrderItem = {
  id: "item-1",
  product: { productId: "prod-1", sku: "SKU-1", name: "T-shirt" } as any,
  quantity: 2,
  price: price(10000n),
};

function createOrder(status: OrderStatus = "draft", id?: OrderId): Order {
  const orderId = id ?? createId(`order-${Math.random().toString(36).slice(2, 12)}`);
  return new Order(
    {
      items: [product],
      price: price(10000n),
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
    const result = await repository.getById(createId("missing"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns an order saved by id", async () => {
    const order = createOrder("draft");
    await repository.save(order);

    const result = await repository.getById(order.id);

    expect(result.success).toBe(true);
    expect(result.value?.id.toString()).toBe(order.id.toString());
    expect(result.value?.status).toBe("draft");
  });

  it("returns null for a different id", async () => {
    const otherId = createId("order-2");
    await repository.save(createOrder("draft"));

    const result = await repository.getById(otherId);

    expect(result).toEqual({ success: true, value: null });
  });

  it("overwrites an existing order on save", async () => {
    const sharedId = createId("overwrite-test");
    const order1 = createOrder("draft", sharedId);
    await repository.save(order1);

    const order2 = createOrder("pending", sharedId);
    await repository.save(order2);

    const result = await repository.getById(sharedId);

    expect(result.value?.status).toBe("pending");
  });

  it("search returns all orders when no criteria", async () => {
    await repository.save(createOrder("draft"));
    await repository.save(createOrder("pending"));

    const result = await repository.search();

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(2);
    expect(result.value?.items).toHaveLength(2);
  });

  it("search filters by status", async () => {
    await repository.save(createOrder("draft"));
    await repository.save(createOrder("pending"));

    const result = await repository.search({ status: "pending" });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(1);
    expect(result.value?.items[0]?.status).toBe("pending");
  });

  it("search respects limit and offset", async () => {
    await repository.save(createOrder("draft"));
    await repository.save(createOrder("pending"));
    await repository.save(createOrder("confirmed"));

    const result = await repository.search({ limit: 1, offset: 1 });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(1);
    expect(result.value?.items[0]?.status).toBe("pending");
  });
});
