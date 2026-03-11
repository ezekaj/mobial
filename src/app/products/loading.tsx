import { Header } from "@/components/layout/header"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search skeleton */}
          <div className="h-12 rounded-xl bg-muted animate-pulse mb-8 max-w-md" />

          {/* Filter bar skeleton */}
          <div className="flex gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-5 w-12 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-7 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-10 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
