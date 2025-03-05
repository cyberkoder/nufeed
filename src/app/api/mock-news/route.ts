import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Get parameters from the request URL
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category") || "general";

        // Generate mock news articles based on category
        const mockArticles = generateMockArticles(category);

        return NextResponse.json({
            status: "ok",
            totalResults: mockArticles.length,
            articles: mockArticles,
        });
    } catch (error) {
        console.error("Error generating mock news:", error);
        return NextResponse.json(
            { error: "Failed to generate mock news" },
            { status: 500 }
        );
    }
}

// Generate fake news articles for testing
function generateMockArticles(category: string) {
    const topics = {
        general: ["Current Events", "Global News", "Local Updates"],
        business: ["Market Trends", "Start-ups", "Corporate News"],
        technology: [
            "Tech Innovations",
            "Software Updates",
            "Hardware Reviews",
        ],
        entertainment: ["Celebrity News", "Film Industry", "Music Releases"],
        sports: ["Game Results", "Player Transfers", "Tournament Updates"],
        science: [
            "Research Breakthroughs",
            "Space Exploration",
            "Environmental Studies",
        ],
        health: ["Medical Advances", "Wellness Tips", "Healthcare Policy"],
    };

    // Use the requested category or default to general
    const selectedTopics =
        topics[category as keyof typeof topics] || topics.general;

    // Generate 10 articles
    return Array.from({ length: 10 }, (_, i) => {
        const topic = selectedTopics[i % selectedTopics.length];
        return {
            source: {
                id: `mock-source-${i}`,
                name: `Mock News Source ${i + 1}`,
            },
            author: `Author ${i + 1}`,
            title: `${topic}: This is a mock news article title ${i + 1}`,
            description: `This is a mock description for article ${
                i + 1
            } about ${topic.toLowerCase()}.`,
            url: `https://example.com/article${i + 1}`,
            urlToImage: `https://via.placeholder.com/800x400?text=Mock+News+Image+${
                i + 1
            }`,
            publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
            content: `This is the mock content for article ${
                i + 1
            }. It's about ${topic.toLowerCase()} and is generated for testing purposes when the News API is not available.`,
        };
    });
}
