import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Referral Program - Earn Credits",
  description:
    "Share MobiaL with friends and earn credits on every purchase they make. Get your unique referral link and start earning today.",
  openGraph: {
    title: "Referral Program | MobiaL",
    description: "Refer friends to MobiaL and earn credits when they purchase an eSIM.",
  },
}

export default function ReferralsLayout({ children }: { children: React.ReactNode }) {
  return children
}
