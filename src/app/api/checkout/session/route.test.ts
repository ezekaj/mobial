import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { getOrderById } from '@/services/order-service'
import { createCheckoutSession } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/rate-limit'

// Mock order service
vi.mock('@/services/order-service', () => ({
  getOrderById: vi.fn(),
}))

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
  createCheckoutSession: vi.fn(),
}))

// Mock rate limiting
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    resetAt: new Date(Date.now() + 60000),
  }),
}))

const mockGetOrderById = vi.mocked(getOrderById)
const mockCreateCheckoutSession = vi.mocked(createCheckoutSession)
const mockCheckRateLimit = vi.mocked(checkRateLimit)

function createCheckoutRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/checkout/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeMockOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    orderNumber: 'ORD-001',
    status: 'PENDING',
    total: 29.99,
    email: 'customer@example.com',
    items: [
      {
        id: 'item-1',
        productName: 'eSIM Europe 5GB',
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99,
      },
    ],
    ...overrides,
  }
}

async function parseResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

describe('POST /api/checkout/session', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCheckRateLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      resetAt: new Date(Date.now() + 60000),
    })
  })

  it('should return validation error when orderId is missing', async () => {
    const req = createCheckoutRequest({})
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toBeDefined()
  })

  it('should return 404 when order is not found', async () => {
    mockGetOrderById.mockResolvedValue(null)

    const req = createCheckoutRequest({ orderId: 'nonexistent' })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(404)
    expect(json.error).toContain('not found')
  })

  it('should return 400 when order is not in PENDING status', async () => {
    mockGetOrderById.mockResolvedValue(makeMockOrder({ status: 'COMPLETED' }) as never)

    const req = createCheckoutRequest({ orderId: 'order-1' })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(400)
    expect(json.error).toContain('cannot be paid')
  })

  it('should create Stripe checkout session successfully', async () => {
    mockGetOrderById.mockResolvedValue(makeMockOrder() as never)
    mockCreateCheckoutSession.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/session/cs_test_123',
    } as never)

    const req = createCheckoutRequest({ orderId: 'order-1' })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.sessionId).toBe('cs_test_123')
    expect(json.data.url).toBe('https://checkout.stripe.com/session/cs_test_123')
    expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        orderNumber: 'ORD-001',
        email: 'customer@example.com',
        amount: 29.99,
      })
    )
  })

  it('should return 429 when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      resetAt: new Date(Date.now() + 60000),
      retryAfter: 60,
    })

    const req = createCheckoutRequest({ orderId: 'order-1' })
    const response = await POST(req)
    const json = await parseResponse(response)

    expect(response.status).toBe(429)
    expect(json.error).toContain('Too many')
  })
})
