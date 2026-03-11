import { Globe, Star, Zap, ShieldCheck, Headphones } from "lucide-react"

const BADGES = [
  {
    icon: Globe,
    label: "190+ Countries",
    color: "text-blue-400",
  },
  {
    icon: Star,
    label: "4.8/5 Rating",
    color: "text-amber-400",
  },
  {
    icon: Zap,
    label: "Instant Delivery",
    color: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    label: "Secure Payments",
    color: "text-primary",
  },
  {
    icon: Headphones,
    label: "24/7 Support",
    color: "text-purple-400",
  },
]

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
      {BADGES.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <badge.icon className={`h-4 w-4 ${badge.color}`} />
          <span className="font-semibold text-xs md:text-sm whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  )
}
