import { NextRequest, NextResponse } from "next/server";

// Using the API key server-side to avoid exposing it in client-side code
// In production, store this in environment variables
const API_KEY = process.env.NEWS_API_KEY;
if (!API_KEY) {
    throw new Error("Missing NEWS_API_KEY environment variable");
}
const BASE_URL = "https://newsapi.org/v2";

export async function GET(request: NextRequest) {
    try {
        // Get parameters from the request URL
        const searchParams = request.nextUrl.searchParams;
        const endpoint = searchParams.get("endpoint") || "top-headlines";

        // Create a new URL for the News API request
        const newsApiUrl = new URL(`${BASE_URL}/${endpoint}`);

        // Copy all search parameters except 'endpoint'
        searchParams.forEach((value, key) => {
            if (key !== "endpoint") {
                newsApiUrl.searchParams.append(key, value);
            }
        });

        // Add API key (server-side)
        newsApiUrl.searchParams.append("apiKey", API_KEY as string);

        console.log(`Proxying request to: ${newsApiUrl.toString()}`);

        // Make the request to News API
        const response = await fetch(newsApiUrl.toString(), {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(
                `News API error: ${response.status} ${response.statusText}`
            );
            return NextResponse.json(
                {
                    error: `News API returned ${response.status}`,
                    details: await response.text(),
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in News API proxy:", error);
        return NextResponse.json(
            { error: "Failed to fetch news" },
            { status: 500 }
        );
    }
}
