"use client"

import { useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AgencyWordCount({ data }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter agencies based on search term
  const filteredData = data
    .filter((agency) => agency.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.wordCount - a.wordCount)
    .slice(0, 20)

  const chartData = {
    labels: filteredData.map((agency) => agency.name),
    datasets: [
      {
        label: "Word Count",
        data: filteredData.map((agency) => agency.wordCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Agency Regulation Word Count",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Word Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Agency",
        },
      },
    },
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search agencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <ScrollArea className="h-[400px]">
        <div className="h-[400px] min-w-[800px]">
          <Bar data={chartData} options={options} />
        </div>
      </ScrollArea>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Top 5 Agencies by Word Count</h3>
          <ul className="space-y-2">
            {filteredData.slice(0, 5).map((agency, index) => (
              <li key={index} className="flex justify-between">
                <span>{agency.name}</span>
                <span className="font-medium">{agency.wordCount.toLocaleString()} words</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Agency Checksums</h3>
          <p className="text-sm text-muted-foreground mb-2">Checksums help identify when regulations have changed</p>
          <ul className="space-y-2">
            {filteredData.slice(0, 5).map((agency, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{agency.name}</span>
                <span className="font-mono">{agency.checksum}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

