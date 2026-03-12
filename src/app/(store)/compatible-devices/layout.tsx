import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compatible Devices",
  description:
    "Check if your phone supports eSIM. Full list of compatible Apple, Samsung, Google Pixel, and other devices.",
  openGraph: {
    title: "eSIM Compatible Devices | MobiaL",
    description:
      "Find out if your device supports eSIM. Browse our complete list of compatible smartphones and tablets.",
  },
}

export default function CompatibleDevicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
