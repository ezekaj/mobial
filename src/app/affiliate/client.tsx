"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const TIERS = [
  { maxSales: 50, rate: 10 },
  { maxSales: 200, rate: 12 },
  { maxSales: Infinity, rate: 15 },
] as const

function getCommissionRate(sales: number): number {
  for (const tier of TIERS) {
    if (sales <= tier.maxSales) return tier.rate
  }
  return TIERS[TIERS.length - 1].rate
}

export function AffiliateCalculator() {
  const [monthlySales, setMonthlySales] = useState(30)
  const avgOrderValue = 20 // Average eSIM order value in USD
  const rate = getCommissionRate(monthlySales)
  const monthlyEarnings = monthlySales * avgOrderValue * (rate / 100)
  const yearlyEarnings = monthlyEarnings * 12

  return (
    <Card className="border-border/50">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold">Monthly Sales</label>
            <span className="text-2xl font-black text-primary">{monthlySales}</span>
          </div>
          <Slider
            value={[monthlySales]}
            onValueChange={([v]) => setMonthlySales(v)}
            min={1}
            max={500}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 sale</span>
            <span>500 sales</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Commission Rate
            </p>
            <p className="text-2xl font-black text-primary mt-1">{rate}%</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Avg. Order
            </p>
            <p className="text-2xl font-black mt-1">${avgOrderValue}</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center space-y-2">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            Estimated Monthly Earnings
          </p>
          <p className="text-4xl font-black text-primary">
            ${monthlyEarnings.toFixed(0)}
          </p>
          <p className="text-sm text-muted-foreground">
            ${yearlyEarnings.toFixed(0)}/year
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Estimates based on ${avgOrderValue} average order value and {rate}% commission rate.
          Actual earnings may vary.
        </p>
      </CardContent>
    </Card>
  )
}
