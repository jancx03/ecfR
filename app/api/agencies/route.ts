import { NextResponse } from "next/server"

const BASE_URL = "https://www.ecfr.gov"

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/v1/agencies.json`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch agencies: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching agencies:", error)
    return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 })
  }
}

