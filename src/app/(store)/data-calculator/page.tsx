import { Metadata } from "next"
import { Calculator, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbJsonLd } from "@/components/common/json-ld"
import { DataCalculator } from "@/components/store/data-calculator"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mobialo.eu"

export const metadata: Metadata = {
  title: "Data Usage Calculator - How Much eSIM Data Do I Need?",
  description:
    "Calculate how much eSIM data you need for your trip. Select your travel duration and usage habits to get a personalized data plan recommendation.",
  openGraph: {
    title: "eSIM Data Calculator | MobiaL",
    description:
      "Find out exactly how much data you need for your next trip. Get personalized eSIM plan recommendations.",
  },
}

export default function DataCalculatorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        baseUrl={BASE_URL}
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Data Calculator", url: `${BASE_URL}/data-calculator` },
        ]}
      />

        {/* Hero */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03]" />
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase tracking-wider">
              <Calculator className="h-3 w-3 mr-1" /> Data Calculator
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              How Much Data Do{" "}
              <span className="text-primary italic">You Need?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Tell us about your trip and how you use your phone. We&apos;ll
              recommend the perfect data plan for you.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <DataCalculator />
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight mb-6">
              Data Usage Tips for Travelers
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TipCard
                title="Download maps offline"
                description="Google Maps and Maps.me let you download maps ahead of time. This can save 50-100MB per day of navigation."
              />
              <TipCard
                title="Disable auto-play videos"
                description="Turn off auto-play in social media apps. Scrolling through TikTok or Instagram Reels uses 2-3x more data than photos."
              />
              <TipCard
                title="Use WiFi when available"
                description="Hotels, cafes, and airports usually have WiFi. Save your mobile data for when you're out exploring."
              />
              <TipCard
                title="Limit background app refresh"
                description="Apps update in the background constantly. Disable this in settings to save 100-200MB per day."
              />
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/esim"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
              >
                Browse All eSIM Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
    </>
  )
}

function TipCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50">
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
