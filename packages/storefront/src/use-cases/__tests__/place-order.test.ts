import { beforeEach, describe, expect, it, vi } from "vitest";
import { failure, isFailure, isSuccess, success } from "@comity/primitives/result";
import { Currency, Money, Price } from "@comity/pricing";
import { Instant } from "@comity/primitives/time";
import { CustomerId, Customer } from "@comity/customer";
import { AddressId, Address, AddressLine } from "@comity/address";
import { OrderId, Order } from "@comity/order";
import { PaymentError } from "@comity/payment";
import { RepositoryError } from "@comity/primitives/errors";
import { InventoryError } from "@comity/inventory";
import { Sku } from "@comity/inventory";
import { WarehouseId } from "@comity/inventory";
import { Quantity } from "@comity/inventory";
import { StockId } from "@comity/inventory";
import { Stock } from "@comity/inventory";
import { ChannelId } from "@comity/primitives/scope";

import type { CustomerRepository } from "@comity/customer";
import type { AddressRepository } from "@comity/address";
import type { ProductProjection, ProductRepository } from "@comity/catalog";
import type { OrderRepository } from "@comity/order";
import type { PaymentProvider, PaymentOutcome, PaymentRequest } from "@comity/payment";
import type { PurchasePolicy } from "../../contracts/purchase-policy.js";
import type { PlaceOrderInput } from "../place-order.js";
import type { StockRepository } from "@comity/inventory";

import { PlaceOrder } from "../place-order.js";
import { DefaultPurchasePolicy } from "../../policies/default-purchase-policy.js";
import { DefaultCustomerLoader } from "../../services/customer-loader.js";
import { DefaultAddressResolver } from "../../services/address-resolver.js";
import { DefaultProductResolver } from "../../services/product-resolver.js";
import { DefaultPricingService } from "../../services/pricing-service.js";
import { DefaultInventoryOperations } from "../../services/inventory-operations.js";
import { DefaultPaymentOperations } from "../../services/payment-operations.js";
import { DefaultOrderFactory } from "../../services/order-factory.js";
import type { PaymentCompensationProvider } from "../../services/payment-compensation.js";

import { PurchaseError } from "../../errors/purchase-error.js";
import { StorefrontError } from "../../errors/storefront-error.js";

function getCurrency(code = "USD"): Currency {
  const result = Currency.create(code);
  if (!result.success) throw new Error("Failed to create currency");
  return result.value;
}

function getChannel(code = "web"): ChannelId {
  const result = ChannelId.create(code);
  if (!result.success) throw new Error("Failed to create ChannelId");
  return result.value;
}

function createCustomer(id = "cust-1", overrides: Partial<import("@comity/customer").CustomerCreate> = {}): Customer {
  const customerIdRes = CustomerId.create(id);
  if (!customerIdRes.success) throw new Error("Failed to create CustomerId");
  return new Customer(
    {
      displayName: "John Doe",
      givenName: "John",
      familyName: "Doe",
      contacts: [{ type: "email", value: "john@example.com" }],
      preferences: {},
      ...overrides,
    },
    customerIdRes.value
  );
}

function createAddress(id = "addr-1", overrides: Partial<import("@comity/address").AddressCreate> = {}): Address {
  const addressIdRes = AddressId.create(id);
  if (!addressIdRes.success) throw new Error("Failed to create AddressId");
  const lineRes = AddressLine.create("123 Main St");
  if (!lineRes.success) throw new Error("Failed to create AddressLine");

  return new Address(
    {
      lines: [lineRes.value],
      city: "New York",
      administrativeArea: "NY",
      postalCode: "10001",
      countryCode: "US",
      label: "Home",
      metadata: null,
      contacts: [],
      ...overrides,
    },
    addressIdRes.value
  );
}

function createProduct(id = "prod-1", overrides: Partial<ProductProjection> = {}): ProductProjection {
  return {
    id,
    name: "Test Product",
    slug: "test-product",
    status: "active",
    type: "physical",
    variants: [
      {
        id: "var-1",
        sku: "SKU-TEST-1",
        name: "Test Product - Standard",
        attributes: [{ code: "color", label: "Color", value: "Blue" }],
        options: [{ code: "size", value: "M" }],
      },
    ],
    attributes: [{ code: "material", label: "Material", value: "Cotton" }],
    options: [{ code: "size", label: "Size", values: ["S", "M", "L"] }],
    ...overrides,
  };
}

describe("PlaceOrder Use Case", () => {
  let customerRepository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };
  let addressRepository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let productRepository: {
    getById: ReturnType<typeof vi.fn>;
    getBySlug: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };
  let orderRepository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };
  let paymentProvider: {
    initiate: ReturnType<typeof vi.fn>;
  };
  let stockRepository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };
  let purchasePolicy: PurchasePolicy;
  let warehouseId: WarehouseId;
  let compensationProvider: PaymentCompensationProvider;
  let useCase: PlaceOrder;

  const usd = getCurrency("USD");
  const webChannel = getChannel("web");

  beforeEach(() => {
    const customer = createCustomer("cust-1");
    const shippingAddress = createAddress("addr-1");
    const billingAddress = createAddress("addr-2");
    const product = createProduct("prod-1");

    customerRepository = {
      getById: vi.fn().mockResolvedValue(success(customer)),
      save: vi.fn().mockResolvedValue(success(undefined)),
      remove: vi.fn().mockResolvedValue(success(undefined)),
      search: vi.fn().mockResolvedValue(success({ items: [], total: 0 })),
    };
    addressRepository = {
      getById: vi.fn().mockImplementation(async (id: AddressId) => {
        if (id.toString() === "addr-1") return success(shippingAddress);
        if (id.toString() === "addr-2") return success(billingAddress);
        return success(null);
      }),
      save: vi.fn().mockResolvedValue(success(undefined)),
    };
    productRepository = {
      getById: vi.fn().mockResolvedValue(success(product)),
      getBySlug: vi.fn(),
      search: vi.fn().mockResolvedValue(success({ items: [], total: 0 })),
    };
    orderRepository = {
      getById: vi.fn(),
      save: vi.fn().mockResolvedValue(success(undefined)),
      search: vi.fn().mockResolvedValue(success({ items: [], total: 0 })),
    };
    paymentProvider = {
      initiate: vi.fn().mockResolvedValue(success({
        paymentId: "pay-123",
        amount: { amount: 20000n, currency: { code: "USD" } } as any,
        status: "captured",
        provider: "memory",
        reference: "order-ref",
      })),
    };
    stockRepository = {
      getById: vi.fn().mockResolvedValue(success(null)),
      save: vi.fn().mockResolvedValue(success(undefined)),
      search: vi.fn().mockResolvedValue(success({ items: [], total: 0 })),
    };
    const warehouseIdResult = WarehouseId.create("warehouse-1");
    if (!warehouseIdResult.success) throw new Error("Failed to create WarehouseId");
    warehouseId = warehouseIdResult.value;
    purchasePolicy = new DefaultPurchasePolicy();

    // Setup default stock for tests that reach inventory step
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const defaultStock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);
    stockRepository.getById.mockResolvedValue(success(defaultStock));

    // Create compensation provider mock
    compensationProvider = {
      compensate: vi.fn().mockResolvedValue(success(undefined)),
    };

    // Create capabilities
    const customerLoader = new DefaultCustomerLoader(customerRepository as unknown as CustomerRepository);
    const addressResolver = new DefaultAddressResolver(addressRepository as unknown as AddressRepository);
    const productResolver = new DefaultProductResolver(
      productRepository as unknown as ProductRepository,
      purchasePolicy
    );
    const pricingService = new DefaultPricingService();
    const inventoryOperations = new DefaultInventoryOperations(stockRepository as unknown as StockRepository, warehouseId);
    const paymentOperations = new DefaultPaymentOperations(paymentProvider as unknown as PaymentProvider);
    const orderFactory = new DefaultOrderFactory();

    useCase = new PlaceOrder(
      customerLoader,
      addressResolver,
      productResolver,
      pricingService,
      inventoryOperations,
      paymentOperations,
      compensationProvider,
      orderFactory,
      orderRepository as unknown as OrderRepository
    );
  });

  const defaultInput: PlaceOrderInput = {
    tenantId: "tenant-1",
    channelId: "web",
    customerId: "cust-1",
    shippingAddressId: "addr-1",
    billingAddressId: "addr-2",
    items: [
      {
        productId: "prod-1",
        variantId: "var-1",
        quantity: 2,
      },
    ],
    context: {
      countryCode: "US",
      currency: usd,
      channel: webChannel,
    },
    meta: { source: "test" },
  };

  it("should successfully place an order (happy path)", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock for inventory reservation
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isSuccess(result)).toBe(true);
    if (!isSuccess(result)) return;

    expect(result.value.orderId).toBeDefined();
    expect(result.value.order.status).toBe("confirmed");
    expect(result.value.order.items).toHaveLength(1);
    expect(result.value.order.items[0]!.product.productId).toBe("prod-1");
    expect(result.value.order.items[0]!.product.sku).toBe("SKU-TEST-1");
    expect(result.value.order.items[0]!.quantity).toBe(2);
    expect(result.value.order.customer?.customerId).toBe("cust-1");
    expect(result.value.order.customer?.displayName).toBe("John Doe");
    expect(result.value.order.addresses).toHaveLength(2);
    expect(result.value.order.payments).toHaveLength(1);
    expect(result.value.order.payments![0]!.status).toBe("captured");
    expect(result.value.order.payments![0]!.paymentId).toBe("pay-123");

    expect(customerRepository.getById).toHaveBeenCalled();
    expect(addressRepository.getById).toHaveBeenCalledTimes(2);
    expect(productRepository.getById).toHaveBeenCalledWith("prod-1");
    expect(stockRepository.getById).toHaveBeenCalled();
    expect(stockRepository.save).toHaveBeenCalled();
    expect(paymentProvider.initiate).toHaveBeenCalled();
    expect(orderRepository.save).toHaveBeenCalled();
  });

  it("should reject order placement when product is inactive (PurchasePolicy rejected)", async () => {
    const inactiveProduct = createProduct("prod-1", { status: "inactive" });
    productRepository.getById.mockResolvedValue(success(inactiveProduct));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error).toBeInstanceOf(StorefrontError);
    expect(result.error.code).toBe("storefront:invalid_input");
    expect(result.error.meta.reason).toBe("invalid_input");
    expect(stockRepository.getById).not.toHaveBeenCalled();
    expect(paymentProvider.initiate).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should return payment_failed when PaymentProvider.initiate returns an error", async () => {
    const paymentError = new PaymentError("provider_error", { details: { message: "Gateway unreachable" } });
    paymentProvider.initiate.mockResolvedValue(failure(paymentError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error).toBeInstanceOf(StorefrontError);
    expect(result.error.code).toBe("storefront:payment_failed");
    expect(result.error.meta.details?.entityType).toBe("payment");
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should return payment_failed when payment outcome status is 'failed'", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    const failedOutcome: PaymentOutcome = {
      paymentId: "pay-failed",
      amount: totalMoney.value,
      status: "failed",
      provider: "memory",
    };
    paymentProvider.initiate.mockResolvedValue(success(failedOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:payment_failed");
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should return payment_failed when payment outcome status is 'cancelled'", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    const cancelledOutcome: PaymentOutcome = {
      paymentId: "pay-cancelled",
      amount: totalMoney.value,
      status: "cancelled",
      provider: "memory",
    };
    paymentProvider.initiate.mockResolvedValue(success(cancelledOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:payment_failed");
  });

  it("should return customer_not_found when customer does not exist", async () => {
    customerRepository.getById.mockResolvedValue(success(null));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:customer_not_found");
  });

  it("should return customer_not_found when customer is soft-deleted", async () => {
    const deletedCustomer = createCustomer("cust-1", { deletedAt: Instant.now() });
    customerRepository.getById.mockResolvedValue(success(deletedCustomer));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:customer_not_found");
  });

  it("should return address_not_found when shipping address does not exist", async () => {
    addressRepository.getById.mockImplementation(async (id: AddressId) => {
      if (id.toString() === "addr-1") return success(null);
      return success(createAddress("addr-2"));
    });

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:address_not_found");
  });

  it("should return address_not_found when billing address does not exist", async () => {
    addressRepository.getById.mockImplementation(async (id: AddressId) => {
      if (id.toString() === "addr-1") return success(createAddress("addr-1"));
      return success(null);
    });

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:address_not_found");
  });

  it("should return product_not_found when product is missing in catalog", async () => {
    productRepository.getById.mockResolvedValue(success(null));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:product_not_found");
  });

  it("should return invalid_input for empty customerId or addressId", async () => {
    const result1 = await useCase.execute({ ...defaultInput, customerId: "" });
    expect(isFailure(result1)).toBe(true);
    if (isFailure(result1)) {
      expect(result1.error.code).toBe("storefront:invalid_input");
    }

    const result2 = await useCase.execute({ ...defaultInput, shippingAddressId: "   " });
    expect(isFailure(result2)).toBe(true);
    if (isFailure(result2)) {
      expect(result2.error.code).toBe("storefront:invalid_input");
    }

    const result3 = await useCase.execute({ ...defaultInput, billingAddressId: "" });
    expect(isFailure(result3)).toBe(true);
    if (isFailure(result3)) {
      expect(result3.error.code).toBe("storefront:invalid_input");
    }
  });

  it("should return invalid_input for empty items or non-positive quantity", async () => {
    const resultEmpty = await useCase.execute({ ...defaultInput, items: [] });
    expect(isFailure(resultEmpty)).toBe(true);
    if (isFailure(resultEmpty)) {
      expect(resultEmpty.error.code).toBe("storefront:invalid_input");
    }

    const resultZero = await useCase.execute({
      ...defaultInput,
      items: [{ productId: "prod-1", quantity: 0 }],
    });
    expect(isFailure(resultZero)).toBe(true);
    if (isFailure(resultZero)) {
      expect(resultZero.error.code).toBe("storefront:invalid_input");
    }

    const resultNegative = await useCase.execute({
      ...defaultInput,
      items: [{ productId: "prod-1", quantity: -2 }],
    });
    expect(isFailure(resultNegative)).toBe(true);
    if (isFailure(resultNegative)) {
      expect(resultNegative.error.code).toBe("storefront:invalid_input");
    }
  });

  it("should return internal_error when orderRepository.save fails", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "authorized",
      provider: "memory",
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const repoError = new RepositoryError("write_failed", { details: { message: "Database connection closed" } });
    orderRepository.save.mockResolvedValue(failure(repoError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("order");
  });

  it("should return internal_error when customerRepository.getById fails", async () => {
    const repoError = new RepositoryError("read_failed", { details: { message: "DB timeout" } });
    customerRepository.getById.mockResolvedValue(failure(repoError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("customer");
  });

  it("should return internal_error when addressRepository.getById fails", async () => {
    const repoError = new RepositoryError("read_failed", { details: { message: "DB timeout" } });
    addressRepository.getById.mockResolvedValue(failure(repoError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("address");
  });

  it("should return internal_error when productRepository.getById fails", async () => {
    const repoError = new RepositoryError("read_failed", { details: { message: "DB timeout" } });
    productRepository.getById.mockResolvedValue(failure(repoError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("product");
  });

  // Inventory integration tests

  it("should return invalid_input when stock is not found for SKU", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    stockRepository.getById.mockResolvedValue(success(null));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:invalid_input");
    expect(result.error.meta.details?.entityType).toBe("inventory");
    expect(result.error.meta.details?.wrappedReason).toBe("Stock not found for SKU");
    expect(paymentProvider.initiate).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should return invalid_input when insufficient stock for reservation", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock with low onHand
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(1n, 0).value, // Only 1 unit available
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:invalid_input");
    expect(result.error.meta.details?.entityType).toBe("inventory");
    expect(result.error.meta.details?.wrappedReason).toBe("insufficient_stock");
    expect(paymentProvider.initiate).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should release reservations when payment fails", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock for inventory reservation
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));

    const paymentError = new PaymentError("provider_error", { details: { message: "Gateway unreachable" } });
    paymentProvider.initiate.mockResolvedValue(failure(paymentError));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:payment_failed");
    // Verify reservation was made and then released (stockRepository.save called twice: once for reserve, once for release)
    expect(stockRepository.save).toHaveBeenCalledTimes(2);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should release reservations when payment outcome is failed", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock for inventory reservation
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));

    const failedOutcome: PaymentOutcome = {
      paymentId: "pay-failed",
      amount: totalMoney.value,
      status: "failed",
      provider: "memory",
    };
    paymentProvider.initiate.mockResolvedValue(success(failedOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:payment_failed");
    // Verify reservation was made and then released
    expect(stockRepository.save).toHaveBeenCalledTimes(2);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should commit reservations after successful payment", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock for inventory reservation
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isSuccess(result)).toBe(true);
    if (!isSuccess(result)) return;

    // Verify stockRepository.save called 2 times: once after reserve, once after commit
    expect(stockRepository.save).toHaveBeenCalledTimes(2);
    expect(orderRepository.save).toHaveBeenCalled();
  });

  it("should return internal_error when stockRepository.getById fails during reservation", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    const repoError = new RepositoryError("read_failed", { details: { message: "DB timeout" } });
    stockRepository.getById.mockResolvedValue(failure(repoError));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("inventory");
    expect(paymentProvider.initiate).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("should return internal_error when stockRepository.save fails during reservation", async () => {
    const totalMoney = Money.create(20000n, usd);
    if (!totalMoney.success) throw new Error("Failed to create Money");

    // Setup stock for inventory reservation
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(100n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);

    stockRepository.getById.mockResolvedValue(success(stock));
    const repoError = new RepositoryError("write_failed", { details: { message: "DB timeout" } });
    stockRepository.save.mockResolvedValueOnce(failure(repoError)).mockResolvedValueOnce(success(undefined));

    const paymentOutcome: PaymentOutcome = {
      paymentId: "pay-123",
      amount: totalMoney.value,
      status: "captured",
      provider: "memory",
      reference: "order-ref",
      capturedAt: Instant.now(),
    };
    paymentProvider.initiate.mockResolvedValue(success(paymentOutcome));

    const result = await useCase.execute(defaultInput);

    expect(isFailure(result)).toBe(true);
    if (!isFailure(result)) return;

    expect(result.error.code).toBe("storefront:internal_error");
    expect(result.error.meta.details?.entityType).toBe("inventory");
    expect(paymentProvider.initiate).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

});