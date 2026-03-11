/**
 * In-process cache with TTL support.
 *
 * Works well on Vercel serverless — warm instances reuse cached data,
 * cold starts refetch naturally. No external dependencies.
 *
 * For multi-instance cache sharing, swap this with Redis/Upstash later.
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
  staleAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

// Prevent unbounded memory growth
const MAX_ENTRIES = 500

function evictExpired(): void {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key)
    }
  }
}

function evictIfFull(): void {
  if (store.size < MAX_ENTRIES) return

  // Remove expired first
  evictExpired()

  // If still full, remove oldest entries
  if (store.size >= MAX_ENTRIES) {
    const entries = [...store.entries()]
    entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    const toRemove = Math.ceil(entries.length * 0.25) // Remove 25%
    for (let i = 0; i < toRemove; i++) {
      store.delete(entries[i][0])
    }
  }
}

export interface CacheOptions {
  /** Time-to-live in milliseconds before data is considered stale */
  ttlMs: number
  /** Grace period after TTL where stale data can still be returned while refetching */
  staleWhileRevalidateMs?: number
}

/**
 * Get or set a cached value. If the cache is stale, returns stale data
 * immediately and refetches in the background (stale-while-revalidate).
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const now = Date.now()
  const entry = store.get(key) as CacheEntry<T> | undefined
  const staleMs = options.staleWhileRevalidateMs ?? 0

  // Fresh cache hit
  if (entry && now < entry.staleAt) {
    return entry.data
  }

  // Stale but within revalidation window — return stale, refetch in background
  if (entry && now < entry.expiresAt) {
    // Fire-and-forget background refetch
    fetcher()
      .then((data) => {
        store.set(key, {
          data,
          staleAt: Date.now() + options.ttlMs,
          expiresAt: Date.now() + options.ttlMs + staleMs,
        })
      })
      .catch(() => {
        // Keep stale data on refetch failure
      })

    return entry.data
  }

  // Cache miss or fully expired — fetch synchronously
  evictIfFull()

  const data = await fetcher()
  store.set(key, {
    data,
    staleAt: now + options.ttlMs,
    expiresAt: now + options.ttlMs + staleMs,
  })

  return data
}

/**
 * Invalidate a specific cache key
 */
export function invalidateCache(key: string): void {
  store.delete(key)
}

/**
 * Invalidate all keys matching a prefix
 */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key)
    }
  }
}

/**
 * Get cache stats for monitoring
 */
export function getCacheStats(): { size: number; maxEntries: number } {
  return { size: store.size, maxEntries: MAX_ENTRIES }
}

// Predefined TTL configurations
export const CACHE_TTL = {
  /** Products list: 5 minutes fresh, 10 minutes stale-while-revalidate */
  PRODUCTS: { ttlMs: 5 * 60 * 1000, staleWhileRevalidateMs: 10 * 60 * 1000 },
  /** Product detail: 10 minutes fresh, 30 minutes stale-while-revalidate */
  PRODUCT_DETAIL: { ttlMs: 10 * 60 * 1000, staleWhileRevalidateMs: 30 * 60 * 1000 },
  /** Countries list: 1 hour fresh, 2 hours stale-while-revalidate */
  COUNTRIES: { ttlMs: 60 * 60 * 1000, staleWhileRevalidateMs: 2 * 60 * 60 * 1000 },
  /** Providers list: 1 hour fresh, 2 hours stale-while-revalidate */
  PROVIDERS: { ttlMs: 60 * 60 * 1000, staleWhileRevalidateMs: 2 * 60 * 60 * 1000 },
  /** Exchange rates: 1 hour fresh, 4 hours stale-while-revalidate */
  EXCHANGE_RATES: { ttlMs: 60 * 60 * 1000, staleWhileRevalidateMs: 4 * 60 * 60 * 1000 },
  /** Featured products: 15 minutes fresh, 30 minutes stale */
  FEATURED: { ttlMs: 15 * 60 * 1000, staleWhileRevalidateMs: 30 * 60 * 1000 },
} as const
