import { NextResponse } from "next/server"

const BASE_URL = "https://www.ecfr.gov"

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/api/versioner/v1/titles.json`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch titles: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching titles:", error)
    return NextResponse.json({ error: "Failed to fetch titles" }, { status: 500 })
  }
}

