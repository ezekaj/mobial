import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - eSIM Travel Tips & Guides",
  description:
    "Travel tips, eSIM guides, and destination advice from MobiaL. Learn how to stay connected abroad, save on roaming, and get the most from your eSIM.",
  openGraph: {
    title: "MobiaL Blog | eSIM Travel Tips & Guides",
    description:
      "Expert advice on eSIM usage, travel connectivity, and destination guides.",
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
