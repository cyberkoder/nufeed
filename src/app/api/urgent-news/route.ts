import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Mock urgent news data - in a real app, you would fetch this from your backend
        const urgentNews = {
            id: "urgent-001",
            title: "Breaking News Alert",
            content:
                "This is an urgent news update. The content has been loaded successfully.",
            timestamp: new Date().toISOString(),
            isLive: true,
            source: "NuFeed",
            severity: "high",
            hasVideo: false,
        };

        // Return the response with appropriate headers
        return NextResponse.json(urgentNews, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error serving urgent news:", error);
        return NextResponse.json(
            { error: "Failed to load urgent news" },
            { status: 500 }
        );
    }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json",
            },
        }
    );
}
