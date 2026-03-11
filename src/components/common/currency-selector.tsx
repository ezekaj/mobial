"use client"

import { useCurrency } from "@/contexts/currency-context"
import { currencies } from "@/lib/currency"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className={className || "w-[100px] h-9 rounded-xl text-xs font-bold border-border/50"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.code} value={c.code} className="text-xs font-medium">
            {c.symbol} {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
