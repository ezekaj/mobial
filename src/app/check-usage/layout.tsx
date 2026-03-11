import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Check eSIM Data Usage",
  description:
    "Monitor your eSIM data usage in real-time. See remaining data, usage history, and expiry date for your active plans.",
  openGraph: {
    title: "Check Data Usage | MobiaL",
    description: "Track your eSIM data usage and see how much data you have remaining.",
  },
}

export default function CheckUsageLayout({ children }: { children: React.ReactNode }) {
  return children
}
