import { Metadata } from "next"

export const metadata: Metadata = {
  title: "eSIM Data Plans - Browse All Destinations",
  description:
    "Compare eSIM data plans for 150+ countries. Filter by destination, data amount, price, and validity. Instant delivery, no roaming fees.",
  openGraph: {
    title: "Browse eSIM Plans | MobiaL",
    description:
      "Find the perfect eSIM for your trip. Compare plans from multiple providers with instant activation.",
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
