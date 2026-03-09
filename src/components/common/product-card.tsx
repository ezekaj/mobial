"use client"

import { motion } from "framer-motion"
import { 
  Wifi, 
  Globe, 
  Clock, 
  Zap, 
  Info, 
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Check,
  ShoppingCart
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug?: string
    provider: string
    dataAmount?: number | null
    dataUnit?: string | null
    validityDays?: number | null
    countries?: string[] | string | null
    price: number
    originalPrice?: number | null
    isUnlimited?: boolean
    isFeatured?: boolean
    supportsHotspot?: boolean
    supportsCalls?: boolean
    supportsSms?: boolean
    mobimatterId?: string
  }
  onBuy?: (productId: string) => void
  showLink?: boolean
  className?: string
}

export function ProductCard({ product, onBuy, showLink = true, className }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const productLink = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBuy?.(product.id);
  };

  const getCountries = (): string[] => {
    if (!product.countries) return []
    if (Array.isArray(product.countries)) return product.countries
    try {
      return JSON.parse(product.countries)
    } catch {
      return []
    }
  }

  const countries = getCountries()

  return (
    <Card className={cn(
      "group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm",
      product.isFeatured && "ring-2 ring-primary border-primary/50",
      className
    )}>
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
        {product.isFeatured && (
          <Badge className="bg-primary text-primary-foreground font-semibold shadow-sm">
            Best Value
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="font-bold">
            -{discount}%
          </Badge>
        )}
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span className="bg-muted px-2 py-0.5 rounded-full">{product.provider}</span>
            </div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              <Link href={showLink ? productLink : "#"}>
                {product.name}
              </Link>
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Data</p>
              <p className="font-bold text-sm">
                {product.isUnlimited ? "Unlimited" : `${product.dataAmount} ${product.dataUnit || 'GB'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Validity</p>
              <p className="font-bold text-sm">
                {product.validityDays} Days
              </p>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <div className="flex flex-wrap gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="h-6 gap-1 bg-background/50 border-border/50 px-2">
                    <Globe className="h-3 w-3" />
                    <span className="text-[10px] font-medium">{countries.length} Countries</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Works in: {countries.slice(0, 5).join(', ')}{countries.length > 5 ? '...' : ''}</p>
                </TooltipContent>
              </Tooltip>

              {product.supportsHotspot && (
                <Badge variant="outline" className="h-6 gap-1 bg-blue-500/5 border-blue-500/20 text-blue-600 px-2">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px] font-medium">Hotspot</span>
                </Badge>
              )}

              <Badge variant="outline" className="h-6 gap-1 bg-green-500/5 border-green-500/20 text-green-600 px-2">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px] font-medium">Instant eSIM</span>
              </Badge>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between mt-auto bg-muted/30 group-hover:bg-muted/50 transition-colors">
        <div className="flex flex-col">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-2xl font-black text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            asChild
          >
            <Link href={showLink ? productLink : "#"}>
              <Info className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            onClick={handleBuyClick}
            className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all h-10"
          >
            Buy Now
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}