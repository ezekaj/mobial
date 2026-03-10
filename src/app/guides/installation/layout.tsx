import { Metadata } from "next"

export const metadata: Metadata = {
  title: "eSIM Installation Guide",
  description:
    "Step-by-step guide to install your eSIM on iOS, Android, or manually. Get connected in minutes with MobiaL.",
  openGraph: {
    title: "eSIM Installation Guide | MobiaL",
    description:
      "Learn how to install your eSIM on any compatible device. Simple step-by-step instructions for iOS, Android, and manual setup.",
  },
}

export default function InstallationGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
