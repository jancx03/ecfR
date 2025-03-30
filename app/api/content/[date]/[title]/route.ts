import { NextResponse } from "next/server"

const BASE_URL = "https://www.ecfr.gov"

export async function GET(request: Request, { params }: { params: { date: string; title: string } }) {
  try {
    const { date, title } = params

    const response = await fetch(`${BASE_URL}/api/versioner/v1/full/${date}/${title}.xml`, {
      headers: {
        Accept: "application/xml",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }

    const text = await response.text()
    return new Response(text, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

