"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ExternalLink, CheckCircle, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutRedirectedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/products")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Redirecting to MobiMatter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground">
                    You're being redirected to <strong>MobiMatter</strong> to complete your purchase securely.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold">What happens next?</h3>
                    <ol className="text-sm text-muted-foreground text-left space-y-2 list-decimal list-inside">
                      <li>You'll complete your purchase on MobiMatter's secure checkout</li>
                      <li>Your eSIM will be delivered instantly via email</li>
                      <li>We'll track your purchase for affiliate commission</li>
                      <li>You'll still get full support from MobiMatter</li>
                    </ol>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span>Redirecting in {countdown} seconds...</span>
                  </div>

                  <div className="flex gap-4 justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/products")}
                    >
                      Back to Products
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/products")
                      }}
                    >
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Having issues?{' '}
                <Button variant="link" className="p-0" onClick={() => router.push("/products")}>
                  Return to products page
                </Button>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
