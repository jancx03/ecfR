"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function HistoricalChanges({ data }) {
  const [selectedMetric, setSelectedMetric] = useState("wordCount")
  const [selectedTimeframe, setSelectedTimeframe] = useState("5years")

  // Filter data based on selected timeframe
  const timeframeMap = {
    "1year": 12,
    "5years": 60,
    "10years": 120,
    all: data.length,
  }

  const filteredData = data.slice(-timeframeMap[selectedTimeframe])

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: selectedMetric === "wordCount" ? "Word Count" : "Number of Regulations",
        data: filteredData.map((item) => item[selectedMetric]),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.1,
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
        text: "Historical Regulation Changes",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: selectedMetric === "wordCount" ? "Word Count" : "Number of Regulations",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  }

  // Calculate change statistics
  const calculateChange = () => {
    if (filteredData.length < 2) return { absolute: 0, percentage: 0 }

    const oldest = filteredData[0][selectedMetric]
    const newest = filteredData[filteredData.length - 1][selectedMetric]
    const absolute = newest - oldest
    const percentage = ((newest - oldest) / oldest) * 100

    return { absolute, percentage }
  }

  const change = calculateChange()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <label className="text-sm font-medium mb-1 block">Metric</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wordCount">Word Count</SelectItem>
              <SelectItem value="regulationCount">Number of Regulations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <label className="text-sm font-medium mb-1 block">Timeframe</label>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="5years">Last 5 Years</SelectItem>
              <SelectItem value="10years">Last 10 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Change Summary</h3>
          <p>
            <span className="font-medium">Absolute Change: </span>
            <span className={change.absolute > 0 ? "text-red-500" : "text-green-500"}>
              {change.absolute > 0 ? "+" : ""}
              {change.absolute.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-medium">Percentage Change: </span>
            <span className={change.percentage > 0 ? "text-red-500" : "text-green-500"}>
              {change.percentage > 0 ? "+" : ""}
              {change.percentage.toFixed(2)}%
            </span>
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Key Events</h3>
          <ul className="space-y-2 text-sm">
            {filteredData
              .filter((item) => item.events && item.events.length > 0)
              .slice(-3)
              .map((item, index) => (
                <li key={index}>
                  <span className="font-medium">{item.date}: </span>
                  {item.events[0]}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

