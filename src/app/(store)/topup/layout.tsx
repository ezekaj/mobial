import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Top Up Your eSIM",
  description:
    "Add more data to your active eSIM. Quick top-up with instant activation — stay connected without interruption.",
  openGraph: {
    title: "Top Up eSIM | MobiaL",
    description: "Add more data to your active MobiaL eSIM in seconds.",
  },
}

export default function TopUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
