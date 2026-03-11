import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbJsonLd } from "@/components/common/json-ld"
import { AffiliateCalculator } from "./client"
import {
  DollarSign,
  TrendingUp,
  Users,
  Link as LinkIcon,
  BarChart3,
  Clock,
} from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mobialo.eu"

export const metadata: Metadata = {
  title: "Affiliate Program - Earn Commission on eSIM Sales",
  description:
    "Join the MobiaL affiliate program and earn up to 15% commission on every eSIM sale. Perfect for travel bloggers, content creators, and digital nomads.",
  openGraph: {
    title: "MobiaL Affiliate Program",
    description:
      "Earn up to 15% commission on every eSIM sale. Perfect for travel bloggers and content creators.",
  },
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <BreadcrumbJsonLd
        baseUrl={BASE_URL}
        items={[
          { name: "Home", url: "/" },
          { name: "Affiliate Program", url: "/affiliate" },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03]" />
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase tracking-wider">
              Affiliate Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Earn While{" "}
              <span className="text-primary italic">You Travel.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Share MobiaL with your audience and earn up to 15% commission on every eSIM sale.
              Perfect for travel bloggers, content creators, and digital nomads.
            </p>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black tracking-tight mb-6 text-center">
              Commission Tiers
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-3xl font-black text-primary">10%</p>
                  <p className="font-bold text-sm">Starter</p>
                  <p className="text-xs text-muted-foreground">0-50 sales/month</p>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5 ring-1 ring-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px] font-black">
                    Most Popular
                  </Badge>
                  <p className="text-3xl font-black text-primary">12%</p>
                  <p className="font-bold text-sm">Growth</p>
                  <p className="text-xs text-muted-foreground">51-200 sales/month</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-3xl font-black text-primary">15%</p>
                  <p className="font-bold text-sm">Pro</p>
                  <p className="text-xs text-muted-foreground">201+ sales/month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-xl">
            <h2 className="text-2xl font-black tracking-tight mb-6 text-center">
              Earnings Calculator
            </h2>
            <AffiliateCalculator />
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-black tracking-tight mb-8 text-center">
              Why Partner With MobiaL
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <BenefitCard
                icon={DollarSign}
                title="Competitive Commissions"
                description="Earn 10-15% on every sale. Our average order is $15-30, so commissions add up fast."
              />
              <BenefitCard
                icon={Clock}
                title="30-Day Cookie"
                description="Get credited for sales up to 30 days after the initial click on your link."
              />
              <BenefitCard
                icon={BarChart3}
                title="Real-Time Dashboard"
                description="Track clicks, conversions, and earnings in your affiliate dashboard."
              />
              <BenefitCard
                icon={LinkIcon}
                title="Custom Links"
                description="Get a unique referral link to share on your blog, social media, or YouTube."
              />
              <BenefitCard
                icon={TrendingUp}
                title="Growing Market"
                description="The eSIM market is growing 25% annually. Get in early and build recurring income."
              />
              <BenefitCard
                icon={Users}
                title="Dedicated Support"
                description="Our affiliate team is available to help you maximize your earnings."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
            <h2 className="text-2xl font-black tracking-tight">Ready to Start Earning?</h2>
            <p className="text-muted-foreground">
              Create a free MobiaL account and generate your affiliate link in seconds.
              No application process — start sharing immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/referrals">
                <button className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-8 py-3 font-bold text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
                  Get Your Affiliate Link
                </button>
              </a>
              <a href="/contact">
                <button className="inline-flex items-center justify-center rounded-xl border border-border px-8 py-3 font-bold text-sm hover:bg-muted transition-colors w-full sm:w-auto">
                  Contact Affiliate Team
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
