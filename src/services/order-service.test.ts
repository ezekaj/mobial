import { describe, it, expect, vi, beforeEach } from "vitest"
import { generateOrderNumber } from "./order-service"

// Mock the db module before importing functions that use it
vi.mock("@/lib/db", () => ({
  db: {
    product: {
      findUnique: vi.fn(),
    },
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}))

vi.mock("@/lib/mobimatter", () => ({
  createOrder: vi.fn(),
  completeOrder: vi.fn(),
}))

describe("generateOrderNumber", () => {
  it("generates order number with MBL- prefix", () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber).toMatch(/^MBL-/)
  })

  it("generates 12-character order numbers (MBL- + 8 chars)", () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber).toHaveLength(12)
  })

  it("uses only uppercase alphanumeric characters after prefix", () => {
    const orderNumber = generateOrderNumber()
    const suffix = orderNumber.slice(4)
    expect(suffix).toMatch(/^[A-Z0-9]{8}$/)
  })

  it("generates unique order numbers", () => {
    const numbers = new Set<string>()
    for (let i = 0; i < 100; i++) {
      numbers.add(generateOrderNumber())
    }
    // With 36^8 = ~2.8 trillion combinations, 100 should all be unique
    expect(numbers.size).toBe(100)
  })
})

describe("calculateOrderTotal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("calculates subtotal correctly for single item", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue({
      price: 9.99,
      originalPrice: null,
      isActive: true,
    } as never)

    const { calculateOrderTotal } = await import("./order-service")
    const totals = await calculateOrderTotal([
      { productId: "prod1", quantity: 1 },
    ])

    expect(totals.subtotal).toBeCloseTo(9.99)
    expect(totals.total).toBeCloseTo(9.99)
    expect(totals.tax).toBe(0)
    expect(totals.discount).toBe(0)
  })

  it("calculates subtotal correctly for multiple items", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique)
      .mockResolvedValueOnce({
        price: 10.0,
        originalPrice: null,
        isActive: true,
      } as never)
      .mockResolvedValueOnce({
        price: 20.0,
        originalPrice: null,
        isActive: true,
      } as never)

    const { calculateOrderTotal } = await import("./order-service")
    const totals = await calculateOrderTotal([
      { productId: "prod1", quantity: 2 },
      { productId: "prod2", quantity: 1 },
    ])

    expect(totals.subtotal).toBeCloseTo(40.0) // 10*2 + 20*1
    expect(totals.total).toBeCloseTo(40.0)
  })

  it("throws when product is not found", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue(null)

    const { calculateOrderTotal } = await import("./order-service")

    await expect(
      calculateOrderTotal([{ productId: "nonexistent", quantity: 1 }])
    ).rejects.toThrow("Product not found")
  })

  it("throws when product is inactive", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue({
      price: 10.0,
      originalPrice: null,
      isActive: false,
    } as never)

    const { calculateOrderTotal } = await import("./order-service")

    await expect(
      calculateOrderTotal([{ productId: "inactive-prod", quantity: 1 }])
    ).rejects.toThrow("Product is not active")
  })
})

describe("validateProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns valid for active products", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue({
      id: "prod1",
      name: "Test eSIM",
      price: 9.99,
      mobimatterId: "mm-123",
      isActive: true,
    } as never)

    const { validateProducts } = await import("./order-service")
    const result = await validateProducts([
      { productId: "prod1", quantity: 1 },
    ])

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.products).toHaveLength(1)
    expect(result.products[0].name).toBe("Test eSIM")
  })

  it("returns errors for missing products", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue(null)

    const { validateProducts } = await import("./order-service")
    const result = await validateProducts([
      { productId: "missing", quantity: 1 },
    ])

    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain("Product not found")
  })

  it("rejects quantity > 10", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue({
      id: "prod1",
      name: "Test eSIM",
      price: 9.99,
      mobimatterId: "mm-123",
      isActive: true,
    } as never)

    const { validateProducts } = await import("./order-service")
    const result = await validateProducts([
      { productId: "prod1", quantity: 11 },
    ])

    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain("Invalid quantity")
  })

  it("rejects quantity < 1", async () => {
    const { db } = await import("@/lib/db")
    vi.mocked(db.product.findUnique).mockResolvedValue({
      id: "prod1",
      name: "Test eSIM",
      price: 9.99,
      mobimatterId: "mm-123",
      isActive: true,
    } as never)

    const { validateProducts } = await import("./order-service")
    const result = await validateProducts([
      { productId: "prod1", quantity: 0 },
    ])

    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain("Invalid quantity")
  })
})
