"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchAgencySummary } from "@/lib/api"
import AgencyWordCount from "./agency-word-count"
import HistoricalChanges from "./historical-changes"
import ComplexityAnalysis from "./complexity-analysis"
import { Button } from "./ui/button"
import { Download } from "lucide-react"
import { LoadingDashboard } from "./loading"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const summary = await fetchAgencySummary()
        setData(summary)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load regulation data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <LoadingDashboard />
  if (error)
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">eCFR Analysis Dashboard</h2>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Agencies</CardTitle>
            <CardDescription>Number of federal agencies analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalAgencies || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Regulations</CardTitle>
            <CardDescription>Number of regulations analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalRegulations?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Words</CardTitle>
            <CardDescription>Word count across all regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalWords?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wordCount" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="wordCount">Word Count Analysis</TabsTrigger>
          <TabsTrigger value="historical">Historical Changes</TabsTrigger>
          <TabsTrigger value="complexity">Complexity Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="wordCount">
          <Card>
            <CardHeader>
              <CardTitle>Agency Word Count</CardTitle>
              <CardDescription>
                Comparing the volume of regulations across federal agencies by word count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgencyWordCount data={data?.agencyWordCounts || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historical">
          <Card>
            <CardHeader>
              <CardTitle>Historical Regulation Changes</CardTitle>
              <CardDescription>Tracking changes in regulation volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoricalChanges data={data?.historicalChanges || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="complexity">
          <Card>
            <CardHeader>
              <CardTitle>Regulation Complexity Index</CardTitle>
              <CardDescription>Custom metric analyzing the complexity of regulations by agency</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplexityAnalysis data={data?.complexityScores || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

