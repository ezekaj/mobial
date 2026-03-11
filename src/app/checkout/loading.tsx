import { Header } from "@/components/layout/header"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 rounded bg-muted animate-pulse mb-8" />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {/* Contact info skeleton */}
                <div className="rounded-xl border p-6 space-y-4">
                  <div className="h-6 w-40 rounded bg-muted animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted animate-pulse" />
                </div>
                {/* Payment skeleton */}
                <div className="rounded-xl border p-6 space-y-4">
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-32 rounded-lg bg-muted animate-pulse" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-xl border p-6 space-y-4">
                  <div className="h-6 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-16 rounded-lg bg-muted animate-pulse" />
                  <div className="h-16 rounded-lg bg-muted animate-pulse" />
                  <div className="h-px bg-border" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
