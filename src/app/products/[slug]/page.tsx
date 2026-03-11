import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById, ProductWithDetails, getProducts } from "@/services/product-service"
import { ProductDetailClient } from "./client"
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/common/json-ld"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mobialo.eu"

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ limit: 50 })
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch {
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const title = product.metaTitle || `${product.name} | MobiaL eSIM`
  const description = product.metaDescription || `Buy ${product.name} eSIM with ${product.dataAmount || 'unlimited'} data for ${product.validityDays || 'flexible'} days. Coverage in ${product.countries.slice(0, 3).join(', ')} and more.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

// Server component
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    notFound()
  }

  // Get related products
  const { products: relatedProducts } = await getProducts({
    provider: product.provider,
    limit: 4,
  })

  // Filter out current product
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <>
      <ProductJsonLd product={product} baseUrl={BASE_URL} />
      <BreadcrumbJsonLd
        baseUrl={BASE_URL}
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: product.name },
        ]}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={filteredRelated}
      />
    </>
  )
}
