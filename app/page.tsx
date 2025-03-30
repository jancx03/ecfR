import { Suspense } from "react"
import Dashboard from "@/components/dashboard"
import { LoadingDashboard } from "@/components/loading"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Federal Regulations Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze and visualize federal regulations from the Electronic Code of Federal Regulations (eCFR)
          </p>
        </header>

        <Suspense fallback={<LoadingDashboard />}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  )
}

