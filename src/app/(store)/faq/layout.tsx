import { Metadata } from "next"
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/common/json-ld"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mobialo.eu"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions about eSIMs",
  description:
    "Find answers to frequently asked questions about eSIMs, purchasing, installation, data usage, device compatibility, and your MobiaL account.",
  openGraph: {
    title: "Frequently Asked Questions | MobiaL eSIM",
    description:
      "Get answers to common questions about eSIM plans, device compatibility, installation, and more.",
  },
}

const FAQ_QUESTIONS = [
  { q: "What is an eSIM?", a: "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card. It's built into most modern smartphones and can be activated by scanning a QR code or entering an activation code." },
  { q: "How does MobiaL work?", a: "MobiaL is an eSIM marketplace that partners with multiple providers to offer you the best data plans for your destination. Simply choose your country or region, select a plan, complete your purchase, and receive a QR code instantly via email." },
  { q: "Which countries are covered?", a: "We offer eSIM plans for over 190 countries and territories worldwide, including popular destinations across Europe, Asia, the Americas, Africa, and the Middle East." },
  { q: "How long does activation take?", a: "Most eSIMs activate within seconds of scanning the QR code. The entire process typically takes under 2 minutes." },
  { q: "How do I buy an eSIM?", a: "Browse our plans by searching for your destination country or region. Select a plan that fits your needs, add it to your cart, and complete checkout. You'll receive your eSIM QR code instantly via email." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) processed securely through Stripe." },
  { q: "Is my device compatible?", a: "Most smartphones manufactured after 2018 support eSIM, including iPhone XS and later, Samsung Galaxy S20 and later, Google Pixel 3a and later. Your device must also be carrier-unlocked." },
  { q: "Can I install the eSIM before my trip?", a: "Yes, and we recommend it. You can install the eSIM anytime after purchase while you have an internet connection." },
  { q: "How do I check my data usage?", a: "You can check your data usage in your phone's Settings under Cellular/Mobile Data for the eSIM line." },
  { q: "Can I top up my eSIM?", a: "Top-up availability depends on the specific plan and provider. Some plans support data top-ups which you can purchase through our platform." },
  { q: "Do you offer refunds?", a: "We offer refunds for eSIMs that have not been installed or activated. Once downloaded to a device, it cannot be refunded as the digital product has been consumed." },
]

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FAQPageJsonLd questions={FAQ_QUESTIONS} />
      <BreadcrumbJsonLd
        baseUrl={BASE_URL}
        items={[
          { name: "Home", url: "/" },
          { name: "FAQ" },
        ]}
      />
      {children}
    </>
  )
}
