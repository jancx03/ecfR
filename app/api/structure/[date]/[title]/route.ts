import { NextResponse } from "next/server"

const BASE_URL = "https://www.ecfr.gov"

export async function GET(request: Request, { params }: { params: { date: string; title: string } }) {
  try {
    const { date, title } = params

    const response = await fetch(`${BASE_URL}/api/versioner/v1/structure/${date}/${title}.json`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch structure: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching structure:", error)
    return NextResponse.json({ error: "Failed to fetch structure" }, { status: 500 })
  }
}

