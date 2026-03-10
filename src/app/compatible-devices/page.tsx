"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Info,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DeviceCategory {
  brand: string
  icon: string
  devices: string[]
}

const deviceCategories: DeviceCategory[] = [
  {
    brand: "Apple",
    icon: "apple",
    devices: [
      "iPhone 16 Pro Max",
      "iPhone 16 Pro",
      "iPhone 16 Plus",
      "iPhone 16",
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 14 Plus",
      "iPhone 14",
      "iPhone 13 Pro Max",
      "iPhone 13 Pro",
      "iPhone 13 Mini",
      "iPhone 13",
      "iPhone 12 Pro Max",
      "iPhone 12 Pro",
      "iPhone 12 Mini",
      "iPhone 12",
      "iPhone SE (3rd gen)",
      "iPhone SE (2nd gen)",
      "iPhone 11 Pro Max",
      "iPhone 11 Pro",
      "iPhone 11",
      "iPhone XS Max",
      "iPhone XS",
      "iPhone XR",
      "iPad Pro (3rd gen and later)",
      "iPad Air (3rd gen and later)",
      "iPad (7th gen and later)",
      "iPad Mini (5th gen and later)",
    ],
  },
  {
    brand: "Samsung",
    icon: "samsung",
    devices: [
      "Galaxy S25 Ultra",
      "Galaxy S25+",
      "Galaxy S25",
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S24",
      "Galaxy S24 FE",
      "Galaxy S23 Ultra",
      "Galaxy S23+",
      "Galaxy S23",
      "Galaxy S23 FE",
      "Galaxy S22 Ultra",
      "Galaxy S22+",
      "Galaxy S22",
      "Galaxy S21 Ultra 5G",
      "Galaxy S21+ 5G",
      "Galaxy S21 5G",
      "Galaxy S21 FE 5G",
      "Galaxy S20 Ultra 5G",
      "Galaxy S20+ 5G",
      "Galaxy S20 5G",
      "Galaxy Z Fold 6",
      "Galaxy Z Fold 5",
      "Galaxy Z Fold 4",
      "Galaxy Z Fold 3",
      "Galaxy Z Flip 6",
      "Galaxy Z Flip 5",
      "Galaxy Z Flip 4",
      "Galaxy Z Flip 3",
      "Galaxy A55 5G",
      "Galaxy A54 5G",
      "Galaxy A35 5G",
      "Galaxy Note 20 Ultra 5G",
      "Galaxy Note 20 5G",
    ],
  },
  {
    brand: "Google Pixel",
    icon: "pixel",
    devices: [
      "Pixel 9 Pro XL",
      "Pixel 9 Pro",
      "Pixel 9 Pro Fold",
      "Pixel 9",
      "Pixel 8 Pro",
      "Pixel 8a",
      "Pixel 8",
      "Pixel 7 Pro",
      "Pixel 7a",
      "Pixel 7",
      "Pixel 6 Pro",
      "Pixel 6a",
      "Pixel 6",
      "Pixel 5a 5G",
      "Pixel 5",
      "Pixel 4a 5G",
      "Pixel 4a",
      "Pixel 4 XL",
      "Pixel 4",
      "Pixel 3a XL",
      "Pixel 3a",
    ],
  },
  {
    brand: "Other Brands",
    icon: "other",
    devices: [
      "Motorola Razr (2023/2024)",
      "Motorola Edge 40 Pro",
      "Motorola Edge 50 Pro",
      "OnePlus 12",
      "OnePlus 11",
      "OnePlus Open",
      "Xiaomi 14",
      "Xiaomi 13 Pro",
      "Xiaomi 13T Pro",
      "Oppo Find X5 Pro",
      "Oppo Find X6 Pro",
      "Oppo Find N3",
      "Sony Xperia 1 V",
      "Sony Xperia 5 V",
      "Sony Xperia 1 IV",
      "Huawei P50 Pro",
      "Huawei Mate 40 Pro",
      "Honor Magic 6 Pro",
      "Honor Magic 5 Pro",
      "Nothing Phone (2)",
      "Nokia X30 5G",
      "Fairphone 5",
      "Surface Pro X (Microsoft)",
    ],
  },
]

export default function CompatibleDevicesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return deviceCategories

    const query = searchQuery.toLowerCase()
    return deviceCategories
      .map((category) => ({
        ...category,
        devices: category.devices.filter(
          (device) =>
            device.toLowerCase().includes(query) ||
            category.brand.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.devices.length > 0)
  }, [searchQuery])

  const totalDevices = deviceCategories.reduce(
    (acc, cat) => acc + cat.devices.length,
    0
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03]" />
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-black uppercase">
                Compatibility
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Compatible{" "}
                <span className="text-primary italic">Devices</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Check if your device supports eSIM. We list {totalDevices}+
                devices across all major brands.
              </p>

              <div className="max-w-lg mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for your device..."
                  className="pl-12 h-14 rounded-2xl text-base bg-card border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="pb-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-start gap-4">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      Important Note
                    </p>
                    <p>
                      Most phones manufactured after 2020 support eSIM. Your
                      device must be <strong>carrier-unlocked</strong> to use an
                      eSIM from MobiaL. Carrier-locked phones may restrict eSIM
                      usage even if the hardware supports it. Contact your
                      carrier if you&apos;re unsure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Device Lists */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No devices found matching &quot;{searchQuery}&quot;
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  If your device isn&apos;t listed, it may still support eSIM.{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact us
                  </Link>{" "}
                  to verify.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {filteredCategories.map((category, catIndex) => (
                  <motion.div
                    key={category.brand}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <Card className="border-border/50 overflow-hidden">
                      <div className="p-6 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold">
                            {category.brand}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3"
                          >
                            {category.devices.length} devices
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.devices.map((device, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 py-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="text-sm">{device}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16 space-y-6"
            >
              <p className="text-muted-foreground">
                Don&apos;t see your device? Most modern smartphones support
                eSIM. Check your device settings or contact us.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="rounded-2xl" asChild>
                  <Link href="/guides/installation">
                    Installation Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-2xl" asChild>
                  <Link href="/products">Browse eSIM Plans</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
