import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'
import { getAuthUser } from '@/lib/auth-helpers'
import {
  createOrder,
  getUserOrders,
  getAllOrders,
} from '@/services/order-service'

// Mock auth helpers (getAuthUser)
vi.mock('@/lib/auth-helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth-helpers')>()
  return {
    ...actual,
    getAuthUser: vi.fn().mockResolvedValue(null),
  }
})

// Mock order service
vi.mock('@/services/order-service', () => ({
  createOrder: vi.fn(),
  getUserOrders: vi.fn(),
  getAllOrders: vi.fn(),
  getOrderById: vi.fn(),
}))

const mockGetAuthUser = vi.mocked(getAuthUser)
const mockCreateOrder = vi.mocked(createOrder)
const mockGetUserOrders = vi.mocked(getUserOrders)
const mockGetAllOrders = vi.mocked(getAllOrders)

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function createGetRequest(params: Record<string, string> = {}, headers: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost/api/orders')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString(), {
    method: 'GET',
    headers,
  })
}

async function parseResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAuthUser.mockResolvedValue(null)
  })

  it('should return validation error for empty body', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '',
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('should return validation error when items array is empty', async () => {
    const req = createPostRequest({ items: [], email: 'user@example.com' })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('should return validation error for invalid email', async () => {
    const req = createPostRequest({
      items: [{ productId: 'prod-1', quantity: 1 }],
      email: 'not-an-email',
    })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('email')
  })

  it('should create order successfully for guest checkout', async () => {
    const mockOrder = {
      order: {
        id: 'order-1',
        orderNumber: 'ORD-001',
        status: 'PENDING',
        total: 29.99,
        email: 'guest@example.com',
        items: [
          {
            productId: 'prod-1',
            productName: 'eSIM Europe 5GB',
            quantity: 1,
            unitPrice: 29.99,
            totalPrice: 29.99,
          },
        ],
      },
    }
    mockCreateOrder.mockResolvedValue(mockOrder as never)

    const req = createPostRequest({
      items: [{ productId: 'prod-1', quantity: 1 }],
      email: 'guest@example.com',
    })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.order.orderNumber).toBe('ORD-001')
    // Guest checkout: getAuthUser returns null, userId passed as undefined
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'guest@example.com' }),
      undefined,
      expect.any(String),
      expect.any(String)
    )
  })

  it('should create order with authenticated user', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user-1',
      email: 'auth@example.com',
      name: 'John',
      role: 'CUSTOMER',
      twoFactorEnabled: false,
    })
    mockCreateOrder.mockResolvedValue({
      order: {
        id: 'order-2',
        orderNumber: 'ORD-002',
        status: 'PENDING',
        total: 19.99,
        email: 'auth@example.com',
        items: [],
      },
    } as never)

    const req = createPostRequest({
      items: [{ productId: 'prod-2', quantity: 1 }],
      email: 'auth@example.com',
    })
    const response = await POST(req)

    expect(response.status).toBe(200)
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.anything(),
      'user-1',
      expect.any(String),
      expect.any(String)
    )
  })

  it('should return 400 when product validation fails in service', async () => {
    mockCreateOrder.mockRejectedValue(new Error('Validation failed: product not found'))

    const req = createPostRequest({
      items: [{ productId: 'nonexistent', quantity: 1 }],
      email: 'user@example.com',
    })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(400)
    expect(json.error).toContain('not found')
  })
})

describe('GET /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 for unauthenticated access', async () => {
    mockGetAuthUser.mockResolvedValue(null)

    const req = createGetRequest()
    const response = await GET(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(401)
    expect(json.error).toContain('Authentication')
  })

  it('should return user orders with pagination', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      name: 'John',
      role: 'CUSTOMER',
      twoFactorEnabled: false,
    })
    mockGetUserOrders.mockResolvedValue({
      orders: [
        { id: 'order-1', orderNumber: 'ORD-001', items: [] },
        { id: 'order-2', orderNumber: 'ORD-002', items: [] },
      ],
      pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
    } as never)

    const req = createGetRequest({ limit: '20', offset: '0' })
    const response = await GET(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockGetUserOrders).toHaveBeenCalledWith('user-1', { limit: 20, offset: 0 })
  })

  it('should return all orders for admin with filters', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      twoFactorEnabled: false,
    })
    mockGetAllOrders.mockResolvedValue({
      orders: [],
      pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
    } as never)

    const req = createGetRequest({ status: 'COMPLETED' })
    const response = await GET(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockGetAllOrders).toHaveBeenCalledWith(
      { status: 'COMPLETED', paymentStatus: undefined },
      { limit: 20, offset: 0 }
    )
  })
})
