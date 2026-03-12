import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MobiaL, the premium eSIM marketplace offering instant digital connectivity for travelers in 190+ countries.",
  openGraph: {
    title: "About MobiaL | Global eSIM Connectivity",
    description:
      "MobiaL is a premium eSIM marketplace powered by MobiMatter, covering 190+ countries with instant activation.",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
