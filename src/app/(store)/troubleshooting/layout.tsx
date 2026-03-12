import { Metadata } from "next"

export const metadata: Metadata = {
  title: "eSIM Troubleshooting",
  description:
    "Fix common eSIM issues: activation problems, no data connection, QR code errors, and more. Step-by-step solutions for all devices.",
  openGraph: {
    title: "eSIM Troubleshooting | MobiaL",
    description: "Solve common eSIM problems with our step-by-step troubleshooting guide.",
  },
}

export default function TroubleshootingLayout({ children }: { children: React.ReactNode }) {
  return children
}
