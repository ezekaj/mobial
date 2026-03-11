export interface Currency {
  code: string
  name: string
  symbol: string
  decimals: number
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", decimals: 2 },
  { code: "EUR", name: "Euro", symbol: "\u20AC", decimals: 2 },
  { code: "GBP", name: "British Pound", symbol: "\u00A3", decimals: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "AED", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", decimals: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimals: 2 },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5", decimals: 0 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimals: 2 },
  { code: "INR", name: "Indian Rupee", symbol: "\u20B9", decimals: 2 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimals: 2 },
  { code: "TRY", name: "Turkish Lira", symbol: "\u20BA", decimals: 2 },
]

export const DEFAULT_CURRENCY = "USD"

export function getCurrency(code: string): Currency {
  return currencies.find((c) => c.code === code) || currencies[0]
}

export function formatPrice(amount: number, currencyCode: string, rates: Record<string, number>): string {
  const currency = getCurrency(currencyCode)
  const rate = rates[currencyCode] || 1
  const converted = amount * rate

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(converted)
}

export function convertPrice(amount: number, currencyCode: string, rates: Record<string, number>): number {
  const rate = rates[currencyCode] || 1
  return amount * rate
}
