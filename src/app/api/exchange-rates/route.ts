import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/auth-helpers"

// Fallback rates (updated periodically, used if API is unavailable)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  JPY: 149.5,
  SGD: 1.34,
  INR: 83.1,
  BRL: 4.97,
  TRY: 30.5,
}

let cachedRates: Record<string, number> | null = null
let cacheTimestamp = 0
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

export async function GET(request: NextRequest) {
  try {
    // Return cached rates if fresh
    if (cachedRates && Date.now() - cacheTimestamp < CACHE_TTL) {
      return successResponse({ rates: cachedRates, source: "cache" })
    }

    // Try fetching from a free exchange rate API
    try {
      const res = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
        { next: { revalidate: 3600 } }
      )

      if (res.ok) {
        const data = await res.json()
        const rates: Record<string, number> = {}
        const supportedCodes = Object.keys(FALLBACK_RATES)

        for (const code of supportedCodes) {
          rates[code] = data.rates?.[code] || FALLBACK_RATES[code]
        }

        cachedRates = rates
        cacheTimestamp = Date.now()
        return successResponse({ rates, source: "live" })
      }
    } catch {
      // Fall through to fallback
    }

    // Use fallback rates
    cachedRates = FALLBACK_RATES
    cacheTimestamp = Date.now()
    return successResponse({ rates: FALLBACK_RATES, source: "fallback" })
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return errorResponse("Failed to fetch exchange rates", 500)
  }
}
