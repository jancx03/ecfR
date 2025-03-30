"use client"

import { useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ComplexityAnalysis({ data }) {
  const [sortBy, setSortBy] = useState("score")

  // Sort data based on selected criteria
  const sortedData = [...data]
    .sort((a, b) => {
      if (sortBy === "score") return b.complexityScore - a.complexityScore
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })
    .slice(0, 15)

  const chartData = {
    labels: sortedData.map((agency) => agency.name),
    datasets: [
      {
        label: "Complexity Score",
        data: sortedData.map((agency) => agency.complexityScore),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Regulation Complexity Index by Agency",
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const agency = sortedData[context.dataIndex]
            return [
              `Reading Level: ${agency.readingLevel.toFixed(1)}`,
              `Technical Terms: ${agency.technicalTerms}`,
              `Cross-References: ${agency.crossReferences}`,
            ]
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Complexity Score",
        },
      },
      y: {
        title: {
          display: true,
          text: "Agency",
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="max-w-md">
          <p className="text-sm text-muted-foreground mb-4">
            The Complexity Index is a custom metric that combines reading level analysis, technical terminology density,
            cross-references, and conditional statements to measure how difficult regulations are to understand and
            implement.
          </p>
        </div>
        <div className="w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Sort by Complexity</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[500px]">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">What is the Complexity Index?</h3>
            <p className="text-sm text-muted-foreground">
              The Complexity Index combines multiple factors to measure how difficult regulations are to understand and
              implement:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Reading level (Flesch-Kincaid)</li>
              <li>Technical terminology density</li>
              <li>Number of cross-references</li>
              <li>Conditional statements</li>
              <li>Exceptions and special cases</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Why It Matters</h3>
            <p className="text-sm text-muted-foreground">Complex regulations are:</p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>More costly to implement</li>
              <li>More likely to be misinterpreted</li>
              <li>Harder for businesses to comply with</li>
              <li>More difficult to enforce consistently</li>
              <li>Potential targets for simplification</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Deregulation Opportunities</h3>
            <p className="text-sm text-muted-foreground">Agencies with high complexity scores may benefit most from:</p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Plain language rewrites</li>
              <li>Consolidation of related regulations</li>
              <li>Removal of redundant requirements</li>
              <li>Simplification of compliance processes</li>
              <li>Technology-enabled compliance solutions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

