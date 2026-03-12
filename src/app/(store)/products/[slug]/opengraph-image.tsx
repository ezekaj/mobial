import { ImageResponse } from "next/og"
import { getProductById } from "@/services/product-service"

export const runtime = "nodejs"
export const alt = "MobiaL eSIM Product"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          MobiaL eSIM
        </div>
      ),
      size
    )
  }

  const dataLabel = product.isUnlimited
    ? "Unlimited"
    : product.dataAmount
    ? `${product.dataAmount} ${product.dataUnit || "GB"}`
    : "Flexible"

  const countryLabel =
    product.countries.length > 3
      ? `${product.countries.slice(0, 3).join(", ")} +${product.countries.length - 3}`
      : product.countries.join(", ")

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
        {/* Background gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <div
            style={{
              display: "flex",
              backgroundColor: "#1a1a2e",
              borderRadius: "999px",
              padding: "8px 20px",
              color: "#a78bfa",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {product.provider}
          </div>
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
          <div style={{ color: "#e4e4e7", fontSize: "28px", fontWeight: 500, display: "flex" }}>
            eSIM Data Plan
          </div>
          <div
            style={{
              color: "white",
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.1,
              maxWidth: "800px",
              display: "flex",
            }}
          >
            {product.name}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "40px", marginTop: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#71717a", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Data</span>
              <span style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>{dataLabel}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#71717a", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Validity</span>
              <span style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>{product.validityDays ? `${product.validityDays} days` : "Flexible"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#71717a", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Coverage</span>
              <span style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>{product.countries.length} {product.countries.length === 1 ? "country" : "countries"}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ color: "#71717a", fontSize: "18px", display: "flex" }}>
            {countryLabel}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            <span style={{ color: "white", fontSize: "56px", fontWeight: 900 }}>
              ${product.price.toFixed(2)}
            </span>
            <span style={{ color: "#71717a", fontSize: "24px", fontWeight: 500 }}>
              {product.currency}
            </span>
          </div>
        </div>
      </div>
    ),
    size
  )
}
