"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const result = await response.json()

      if (!response.ok && response.status !== 429) {
        throw new Error(result.error || "Something went wrong")
      }

      if (response.status === 429) {
        throw new Error(t("tooManyRequests"))
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              {isSubmitted ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                  >
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold">{t("checkEmail")}</CardTitle>
                  <CardDescription>
                    {t("emailSentDesc", { email })}
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
                  <CardDescription>
                    {t("subtitle")}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent>
              {isSubmitted ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {t("didntReceive")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                      }}
                    >
                      {t("tryAgain")}
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("backToHome")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t("emailAddress")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || !email}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("sendResetLink")}
                  </Button>

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("backToHome")}
                    </Link>
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
  )
}
