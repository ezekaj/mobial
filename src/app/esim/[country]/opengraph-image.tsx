import { ImageResponse } from "next/og"
import { getCountryBySlug } from "@/lib/countries"

export const runtime = "edge"
export const alt = "MobiaL eSIM for your destination"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country: slug } = await params
  const country = getCountryBySlug(slug)

  const name = country?.name || slug
  const code = country?.code || slug.toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 900,
            }}
          >
            M
          </div>
          <span style={{ color: "#a1a1aa", fontSize: "24px", fontWeight: 600 }}>MobiaL</span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#1a1a2e",
              borderRadius: "999px",
              padding: "8px 24px",
              color: "#60a5fa",
              fontSize: "20px",
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            {code}
          </div>
          <div
            style={{
              color: "white",
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            eSIM Plans for {name}
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "28px", fontWeight: 500, display: "flex" }}>
            Instant activation. No roaming fees. High-speed data.
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#71717a", fontSize: "20px", display: "flex" }}>mobialo.eu</div>
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "16px",
              padding: "12px 32px",
              color: "white",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Browse Plans
          </div>
        </div>
      </div>
    ),
    size
  )
}
