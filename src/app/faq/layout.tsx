import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to frequently asked questions about eSIMs, purchasing, installation, usage, and your MobiaL account.",
  openGraph: {
    title: "Frequently Asked Questions | MobiaL",
    description:
      "Get answers to common questions about eSIM plans, device compatibility, installation, and more.",
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
