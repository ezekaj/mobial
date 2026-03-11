"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Globe,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  Smartphone,
  Wifi,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Gift,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { TrustBadges } from "@/components/store/trust-badges"
import { ReviewsSection } from "@/components/store/reviews-section"
import { DestinationSearch } from "@/components/common/destination-search"
import { CurrencySelector } from "@/components/common/currency-selector"
import { useCurrency } from "@/contexts/currency-context"
import { regions } from "@/lib/regions"
import Link from "next/link"

const STEPS = [
  {
    title: "Choose your destination",
    description: "Search for your destination and pick the best plan for your needs.",
    icon: Globe,
  },
  {
    title: "Get your QR code",
    description: "Receive your eSIM activation details instantly via email after payment.",
    icon: Zap,
  },
  {
    title: "Stay connected",
    description: "Scan the QR code and enjoy high-speed data as soon as you land.",
    icon: Wifi,
  },
]

const REGION_ICONS: Record<string, string> = {
  europe: "EU",
  asia: "AS",
  americas: "AM",
  "middle-east": "ME",
  oceania: "OC",
  africa: "AF",
}

interface Product {
  id: string
  name: string
  slug: string
  provider: string
  price: number
  dataAmount: number | null
  validityDays: number | null
  countries: string[]
  networkType: string | null
  topUpAvailable: boolean
  providerLogo: string | null
}

export default function HomePage() {
  const { openAuthModal } = useAuth()
  const { formatPrice } = useCurrency()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [latestProducts, setLatestProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [popRes, latestRes] = await Promise.all([
          fetch("/api/products?limit=8&sortBy=price_asc"),
          fetch("/api/products?limit=8&sortBy=createdAt"),
        ])
        if (popRes.ok) {
          const data = await popRes.json()
          setPopularProducts(data.data?.products || [])
        }
        if (latestRes.ok) {
          const data = await latestRes.json()
          setLatestProducts(data.data?.products || [])
        }
      } catch {}
      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03]" />
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Star className="h-3 w-3 fill-current" />
                Trusted by 50,000+ Travelers
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Your Global Travel <br />
                <span className="text-primary italic">Connectivity</span> Partner
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                High-speed eSIM data plans for 150+ countries.
                No roaming fees. No physical SIMs. Instant activation.
              </p>

              {/* Enhanced Search */}
              <DestinationSearch />

              {/* Region Quick Links */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {regions.slice(0, 4).map((region) => (
                  <Button
                    key={region.slug}
                    variant="outline"
                    className="rounded-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105 h-12 px-6"
                    asChild
                  >
                    <Link href={`/esim/region/${region.slug}`}>
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">{region.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {region.countries.length}+
                      </span>
                    </Link>
                  </Button>
                ))}
              </div>
              <TrustBadges />
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 -mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link
                href="/check-usage"
                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all group text-center"
              >
                <BarChart3 className="h-7 w-7 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm">Check Usage</h3>
                <p className="text-[10px] text-muted-foreground mt-1">Monitor your data</p>
              </Link>
              <Link
                href="/topup"
                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all group text-center"
              >
                <RefreshCw className="h-7 w-7 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm">Top Up eSIM</h3>
                <p className="text-[10px] text-muted-foreground mt-1">Add more data</p>
              </Link>
              <Link
                href="/esim"
                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all group text-center"
              >
                <Globe className="h-7 w-7 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm">Destinations</h3>
                <p className="text-[10px] text-muted-foreground mt-1">150+ countries</p>
              </Link>
              <Link
                href="/compatible-devices"
                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all group text-center"
              >
                <Smartphone className="h-7 w-7 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm">Compatibility</h3>
                <p className="text-[10px] text-muted-foreground mt-1">Check your device</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Product Offers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase tracking-wider mb-3">
                  <TrendingUp className="h-3 w-3 mr-1" /> Live Offers
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  eSIM Data Plans
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <CurrencySelector />
                <Button variant="outline" className="rounded-xl font-bold text-xs" asChild>
                  <Link href="/products">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="bg-muted/50 rounded-xl mb-6">
                <TabsTrigger value="popular" className="rounded-lg font-bold text-xs">
                  Most Popular
                </TabsTrigger>
                <TabsTrigger value="latest" className="rounded-lg font-bold text-xs">
                  Latest Added
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular">
                {isLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ProductGrid products={popularProducts} formatPrice={formatPrice} />
                )}
              </TabsContent>

              <TabsContent value="latest">
                {isLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ProductGrid products={latestProducts} formatPrice={formatPrice} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Instant Delivery",
                  description: "Receive your QR code in your inbox immediately after purchase. Ready to scan and go.",
                  color: "text-amber-500",
                },
                {
                  icon: Globe,
                  title: "Global Coverage",
                  description: "Connect in over 150 countries with our vast network of tier-1 carrier partners.",
                  color: "text-blue-500",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure & Reliable",
                  description: "Bank-grade payment security and 24/7 technical support for your peace of mind.",
                  color: "text-primary",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-muted group-hover:scale-110 transition-transform">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Region */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase tracking-wider">
                <Globe className="h-3 w-3 mr-1" /> Destinations
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Browse by <span className="text-primary italic">Region</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/esim/region/${region.slug}`}
                  className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all group text-center"
                >
                  <Globe className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm group-hover:text-primary transition-colors">
                    {region.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {region.countries.length}+ countries
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase">
                    How it works
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                    Get connected in <br />
                    <span className="text-primary italic">less than 2 minutes</span>
                  </h2>
                </div>

                <div className="space-y-12 pt-8">
                  {STEPS.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xl z-10 relative">
                          {i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground max-w-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="rounded-2xl px-10 h-14 text-lg font-black mt-8" asChild>
                  <Link href="/products">
                    Start Browsing <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <motion.div
                  initial={{ rotate: 10, y: 20 }}
                  whileInView={{ rotate: 0, y: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-card border-[12px] border-muted rounded-[3rem] p-4 shadow-2xl max-w-[320px] mx-auto overflow-hidden"
                >
                  <div className="bg-muted h-6 w-32 mx-auto rounded-full mb-8" />
                  <div className="space-y-6">
                    <div className="h-40 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-6 flex flex-col justify-between text-white">
                      <Wifi className="h-8 w-8" />
                      <div>
                        <p className="text-xs opacity-80 uppercase font-bold tracking-widest">Global Connect</p>
                        <p className="text-xl font-black">Active eSIM</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 rounded-full bg-muted w-full" />
                      <div className="h-4 rounded-full bg-muted w-3/4" />
                      <div className="h-4 rounded-full bg-muted w-1/2" />
                    </div>
                    <div className="p-4 rounded-2xl border bg-muted/50 text-center space-y-2">
                      <Smartphone className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-bold">Device Compatible</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <ReviewsSection />

        {/* Referral Banner */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="rounded-[2rem] bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10 border border-primary/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  Refer a friend, earn rewards
                </h3>
                <p className="text-muted-foreground max-w-lg">
                  Share MobiaL with your travel buddies. You both get credits when they make their first purchase.
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-2xl px-8 h-12 font-black text-sm flex-shrink-0"
                asChild
              >
                <Link href="/referrals">
                  Start Earning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="relative rounded-[3rem] bg-foreground text-background overflow-hidden p-12 md:p-24 text-center space-y-8">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary blur-[100px] opacity-20" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500 blur-[100px] opacity-20" />

              <h2 className="text-4xl md:text-6xl font-black tracking-tight relative z-10">
                Ready for your next <br />
                <span className="text-primary italic">Adventure?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
                Join thousands of travelers who save on roaming costs every day.
                Instant connectivity is just a few clicks away.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Button size="lg" className="rounded-2xl px-12 h-16 text-xl font-black" asChild>
                  <Link href="/products">Get your eSIM</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 h-16 text-xl font-black border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={() => openAuthModal("register")}
                >
                  Start Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ProductGrid({
  products,
  formatPrice,
}: {
  products: Product[]
  formatPrice: (amount: number) => string
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.slice(0, 8).map((product) => (
        <Link key={product.id} href={`/products/${product.slug || product.id}`}>
          <Card className="group hover:shadow-xl transition-all border-border/50 h-full">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {product.provider}
                </Badge>
                {product.networkType && (
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-black">
                    {product.networkType}
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  {product.dataAmount && (
                    <span>
                      {product.dataAmount >= 1
                        ? `${product.dataAmount} GB`
                        : `${product.dataAmount * 1000} MB`}
                    </span>
                  )}
                  {product.validityDays && <span>{product.validityDays}d</span>}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-black">{formatPrice(product.price)}</span>
                <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                  View <ChevronRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
