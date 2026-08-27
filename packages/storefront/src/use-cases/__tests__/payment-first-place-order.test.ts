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
import type { StockRepository } from "@comity/inventory";

import { PaymentFirstPlaceOrder, PaymentCompensationProvider } from "../payment-first-place-order.js";
import { DefaultPurchasePolicy } from "../../policies/default-purchase-policy.js";
import { StorefrontError } from "../../errors/storefront-error.js";
import { DefaultCustomerLoader } from "../../services/customer-loader.js";
import { DefaultAddressResolver } from "../../services/address-resolver.js";
import { DefaultProductResolver } from "../../services/product-resolver.js";
import { DefaultPricingService } from "../../services/pricing-service.js";
import { DefaultInventoryOperations } from "../../services/inventory-operations.js";
import { DefaultPaymentOperations } from "../../services/payment-operations.js";
import { DefaultOrderFactory } from "../../services/order-factory.js";

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

function createPaymentOutcome(overrides: Partial<PaymentOutcome> = {}): PaymentOutcome {
  const totalMoney = Money.create(20000n, getCurrency("USD"));
  if (!totalMoney.success) throw new Error("Failed to create Money");

  return {
    paymentId: "pay-123",
    amount: totalMoney.value,
    status: "captured",
    provider: "memory",
    reference: "order-ref",
    capturedAt: Instant.now(),
    ...overrides,
  };
}

class TestCompensationProvider implements PaymentCompensationProvider {
  private compensations: PaymentCompensation[] = [];

  async compensate(payment: PaymentCompensation): Promise<Result<void, StorefrontError>> {
    this.compensations.push(payment);
    return success(undefined);
  }

  getCompensations(): PaymentCompensation[] {
    return this.compensations;
  }

  clear(): void {
    this.compensations = [];
  }
}

describe("PaymentFirstPlaceOrder Use Case", () => {
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
  let compensationProvider: TestCompensationProvider;
  let useCase: PaymentFirstPlaceOrder;

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
      initiate: vi.fn().mockResolvedValue(success(createPaymentOutcome())),
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
    compensationProvider = new TestCompensationProvider();

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

    useCase = new PaymentFirstPlaceOrder(
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

  const defaultInput = {
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

  const setupDefaultStock = () => {
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
  };

  const setupLowStock = () => {
    const skuResult = Sku.create("SKU-TEST-1");
    if (!skuResult.success) throw new Error("Failed to create SKU");
    const stockId = StockId.create(skuResult.value, warehouseId);
    const stock = new Stock({
      sku: skuResult.value,
      warehouseId,
      onHand: Quantity.create(1n, 0).value,
      reserved: Quantity.create(0n, 0).value,
    }, stockId);
    stockRepository.getById.mockResolvedValue(success(stock));
  };

  describe("Test 1: Payment succeeds, reservation succeeds", () => {
    it("should successfully place an order (Workflow B happy path)", async () => {
      setupDefaultStock();

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
      expect(orderRepository.save).toHaveBeenCalledTimes(2); // draft + confirmed

      // Verify compensation was NOT invoked
      expect(compensationProvider.getCompensations()).toHaveLength(0);
    });
  });

  describe("Test 2: Payment fails", () => {
    it("should return payment_failed when payment fails, without attempting inventory", async () => {
      const paymentError = new PaymentError("provider_error", { details: { message: "Gateway unreachable" } });
      paymentProvider.initiate.mockResolvedValue(failure(paymentError));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error).toBeInstanceOf(StorefrontError);
      expect(result.error.code).toBe("storefront:payment_failed");
      expect(result.error.meta.details?.entityType).toBe("payment");

      // Verify inventory reservation was NOT attempted
      expect(stockRepository.getById).not.toHaveBeenCalled();
      expect(stockRepository.save).not.toHaveBeenCalled();

      // Verify no compensation was invoked (nothing to compensate)
      expect(compensationProvider.getCompensations()).toHaveLength(0);

      // Verify draft order was created and saved
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft
    });

    it("should return payment_failed when payment outcome is failed, without attempting inventory", async () => {
      const failedOutcome = createPaymentOutcome({ status: "failed" });
      paymentProvider.initiate.mockResolvedValue(success(failedOutcome));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:payment_failed");
      expect(stockRepository.getById).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft
    });

    it("should return payment_failed when payment outcome is cancelled, without attempting inventory", async () => {
      const cancelledOutcome = createPaymentOutcome({ status: "cancelled" });
      paymentProvider.initiate.mockResolvedValue(success(cancelledOutcome));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:payment_failed");
      expect(stockRepository.getById).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft
    });
  });

  describe("Test 3: Payment succeeds, reservation fails", () => {
    it("should compensate payment when inventory reservation fails", async () => {
      setupLowStock();

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:invalid_input");
      expect(result.error.meta.details?.entityType).toBe("inventory");
      expect(result.error.meta.details?.wrappedReason).toBe("insufficient_stock");

      // Verify payment was initiated
      expect(paymentProvider.initiate).toHaveBeenCalled();

      // Verify inventory reservation was attempted
      expect(stockRepository.getById).toHaveBeenCalled();

      // Verify compensation was invoked exactly once
      expect(compensationProvider.getCompensations()).toHaveLength(1);
      const compensation = compensationProvider.getCompensations()[0];
      expect(compensation.paymentId).toBe("pay-123");

      // Reserve failed before any save, so no release save occurs
      // stockRepository.save is not called for failed reservation
      expect(stockRepository.save).not.toHaveBeenCalled();

      // Verify Order does not become confirmed
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft

      // Verify no successful checkout result is returned
      expect(isFailure(result)).toBe(true);
    });
  });

  describe("Test 4: Partial reservation failure", () => {
    it("should release successful reservations and compensate payment when partial reservation fails", async () => {
      const skuResultA = Sku.create("SKU-TEST-A");
      if (!skuResultA.success) throw new Error("Failed to create SKU A");
      const skuResultB = Sku.create("SKU-TEST-B");
      if (!skuResultB.success) throw new Error("Failed to create SKU B");

      const stockIdA = StockId.create(skuResultA.value, warehouseId);
      const stockIdB = StockId.create(skuResultB.value, warehouseId);

      const stockA = new Stock({
        sku: skuResultA.value,
        warehouseId,
        onHand: Quantity.create(100n, 0).value,
        reserved: Quantity.create(0n, 0).value,
      }, stockIdA);

      const stockB = new Stock({
        sku: skuResultB.value,
        warehouseId,
        onHand: Quantity.create(1n, 0).value, // Only 1 available, need 2
        reserved: Quantity.create(0n, 0).value,
      }, stockIdB);

      stockRepository.getById.mockImplementation(async (id: StockId) => {
        if (id.toString() === stockIdA.toString()) return success(stockA);
        if (id.toString() === stockIdB.toString()) return success(stockB);
        return success(null);
      });

      const multiItemInput = {
        ...defaultInput,
        items: [
          { productId: "prod-1", variantId: "var-1", quantity: 2 }, // SKU-TEST-A
          { productId: "prod-2", variantId: "var-2", quantity: 2 }, // SKU-TEST-B
        ],
      };

      // Need to mock product loading for both products
      productRepository.getById.mockImplementation(async (id: string) => {
        if (id === "prod-1") return success(createProduct("prod-1", { variants: [{ id: "var-1", sku: "SKU-TEST-A" }] }));
        if (id === "prod-2") return success(createProduct("prod-2", { variants: [{ id: "var-2", sku: "SKU-TEST-B" }] }));
        return success(null);
      });

      const result = await useCase.execute(multiItemInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:invalid_input");
      expect(result.error.meta.details?.entityType).toBe("inventory");
      expect(result.error.meta.details?.wrappedReason).toBe("insufficient_stock");

      // Verify compensation was invoked
      expect(compensationProvider.getCompensations()).toHaveLength(1);

      // Verify Order does not become confirmed
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft
    });
  });

  describe("Additional edge cases", () => {
    it("should return payment_failed when PaymentProvider.initiate returns an error", async () => {
      const paymentError = new PaymentError("provider_error", { details: { message: "Gateway unreachable" } });
      paymentProvider.initiate.mockResolvedValue(failure(paymentError));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error).toBeInstanceOf(StorefrontError);
      expect(result.error.code).toBe("storefront:payment_failed");
      expect(result.error.meta.details?.entityType).toBe("payment");
      expect(orderRepository.save).toHaveBeenCalledTimes(1); // only draft
    });

    it("should return customer_not_found when customer does not exist", async () => {
      customerRepository.getById.mockResolvedValue(success(null));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:customer_not_found");
      expect(paymentProvider.initiate).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
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
      expect(paymentProvider.initiate).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
    });

    it("should return product_not_found when product is missing in catalog", async () => {
      productRepository.getById.mockResolvedValue(success(null));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:product_not_found");
      expect(paymentProvider.initiate).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
    });

    it("should return invalid_input when product is inactive (PurchasePolicy rejected)", async () => {
      const inactiveProduct = createProduct("prod-1", { status: "inactive" });
      productRepository.getById.mockResolvedValue(success(inactiveProduct));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:invalid_input");
      expect(result.error.meta.reason).toBe("invalid_input");
      expect(paymentProvider.initiate).not.toHaveBeenCalled();
      expect(stockRepository.getById).not.toHaveBeenCalled();
      expect(compensationProvider.getCompensations()).toHaveLength(0);
    });

    it("should return internal_error when orderRepository.save fails on draft", async () => {
      const repoError = new RepositoryError("write_failed", { details: { message: "Database connection closed" } });
      orderRepository.save.mockResolvedValueOnce(failure(repoError)).mockResolvedValueOnce(success(undefined));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:internal_error");
      expect(result.error.meta.details?.entityType).toBe("order");
    });

    it("should return internal_error when stockRepository.getById fails during reservation", async () => {
      const repoError = new RepositoryError("read_failed", { details: { message: "DB timeout" } });
      stockRepository.getById.mockResolvedValue(failure(repoError));

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:internal_error");
      expect(result.error.meta.details?.entityType).toBe("inventory");
    });

    it("should release reservations and compensate when stockRepository.save fails during commit", async () => {
      setupDefaultStock();

      const repoError = new RepositoryError("write_failed", { details: { message: "DB timeout" } });
      stockRepository.save
        .mockResolvedValueOnce(success(undefined)) // reserve save
        .mockResolvedValueOnce(failure(repoError)); // commit save

      const result = await useCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      expect(result.error.code).toBe("storefront:internal_error");
      expect(result.error.meta.details?.entityType).toBe("inventory");

      // Verify compensation was invoked
      expect(compensationProvider.getCompensations()).toHaveLength(1);
    });

    it("should return compensation_failed when compensation itself fails", async () => {
      setupLowStock();

      // Make compensation fail
      const failingCompensationProvider = new TestCompensationProvider();
      failingCompensationProvider.compensate = vi.fn().mockResolvedValue(
        failure(new StorefrontError("payment_failed", {
          details: { entityType: "payment", wrappedReason: "Refund declined" }
        }))
      );

      const customerLoader = new DefaultCustomerLoader(customerRepository as unknown as import("@comity/customer").CustomerRepository);
      const addressResolver = new DefaultAddressResolver(addressRepository as unknown as import("@comity/address").AddressRepository);
      const productResolver = new DefaultProductResolver(
        productRepository as unknown as ProductRepository,
        purchasePolicy
      );
      const pricingService = new DefaultPricingService();
      const inventoryOperations = new DefaultInventoryOperations(stockRepository as unknown as StockRepository, warehouseId);
      const paymentOperations = new DefaultPaymentOperations(paymentProvider as unknown as PaymentProvider);
      const orderFactory = new DefaultOrderFactory();

      const failingUseCase = new PaymentFirstPlaceOrder(
        customerLoader,
        addressResolver,
        productResolver,
        pricingService,
        inventoryOperations,
        paymentOperations,
        failingCompensationProvider,
        new DefaultOrderFactory(),
        orderRepository as unknown as OrderRepository
      );

      const result = await failingUseCase.execute(defaultInput);

      expect(isFailure(result)).toBe(true);
      if (!isFailure(result)) return;

      // Should return compensation_failed with original reservation failure as cause
      expect(result.error.code).toBe("storefront:compensation_failed");
      expect(result.error.cause).toBeDefined();
      // The original business failure is preserved in the cause chain
      // The compensation error's details are in the nested details
      expect(result.error.meta.details?.details?.wrappedReason).toBe("Refund declined");
    });
  });

  describe("Payment compensation provider", () => {
    it("should track compensations correctly", () => {
      const provider = new TestCompensationProvider();
      expect(provider.getCompensations()).toHaveLength(0);

      const compensation = { paymentId: "pay-1", amount: { amount: 1000n, currency: { code: "USD" } } as any };
      provider.compensate(compensation);
      expect(provider.getCompensations()).toHaveLength(1);
      expect(provider.getCompensations()[0].paymentId).toBe("pay-1");

      provider.clear();
      expect(provider.getCompensations()).toHaveLength(0);
    });
  });
});