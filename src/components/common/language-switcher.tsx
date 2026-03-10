"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", label: "English", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "de", label: "Deutsch", flag: "\ud83c\udde9\ud83c\uddea" },
  { code: "es", label: "Espa\u00f1ol", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "fr", label: "Fran\u00e7ais", flag: "\ud83c\uddeb\ud83c\uddf7" },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const currentLanguage = languages.find((l) => l.code === locale) ?? languages[0]

  async function handleLocaleChange(newLocale: string) {
    try {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      })
      if (!res.ok) return
      startTransition(() => {
        router.refresh()
      })
    } catch {
      // Silently fail — locale unchanged
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
          disabled={isPending}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
