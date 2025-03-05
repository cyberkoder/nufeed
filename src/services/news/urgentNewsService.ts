import axios from "axios";
import { UrgentNewsItem, NewsResponse } from "./types";
import { API_KEY, BASE_URL, USE_MOCK_DATA } from "./config";
import { getRandomUrgentNews } from "./mockNewsData";

// Helper function to get a local placeholder image
const getLocalPlaceholder = (text: string) => {
    return `/api/placeholder?width=640&height=360&text=${encodeURIComponent(
        text
    )}&bg=fee2e2&fg=ef4444`;
};

export const fetchUrgentNews = async (): Promise<UrgentNewsItem | null> => {
    // If configured to use mock data, return it immediately
    if (USE_MOCK_DATA) {
        console.log("Using mock urgent news data");
        return getRandomUrgentNews();
    }

    const URGENT_NEWS_ENDPOINT = `${BASE_URL}/top-headlines`;

    try {
        // Fetch real breaking news with high priority
        const response = await axios.get<NewsResponse>(URGENT_NEWS_ENDPOINT, {
            params: {
                country: "us",
                category: "general",
                pageSize: 1,
                apiKey: API_KEY,
            },
            headers: {
                "X-Priority": "high",
            },
            // Add timeout to avoid hanging requests
            timeout: 10000,
        });

        // Check if we have any urgent news
        if (response.data.articles && response.data.articles.length > 0) {
            const urgentArticle = response.data.articles[0];

            // Determine if this is truly urgent news (could implement more sophisticated logic)
            // For now, checking if title contains certain keywords
            const urgentKeywords = [
                "breaking",
                "urgent",
                "emergency",
                "alert",
                "crisis",
            ];

            const isUrgent = urgentKeywords.some((keyword) =>
                urgentArticle.title
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
            );

            if (isUrgent) {
                // Check if the article has video content
                const hasVideo = Boolean(
                    urgentArticle.urlToImage &&
                        urgentArticle.url &&
                        (urgentArticle.url.includes("video") ||
                            urgentArticle.content?.includes("video"))
                );

                // Create a safe local placeholder instead of potentially using a CORS-restricted image
                const safeVideoThumbnail = hasVideo
                    ? urgentArticle.urlToImage?.startsWith("http")
                        ? getLocalPlaceholder(urgentArticle.title)
                        : urgentArticle.urlToImage ?? undefined
                    : undefined;

                return {
                    id: `urgent-${Date.now()}`,
                    title: urgentArticle.title,
                    content:
                        urgentArticle.description ||
                        urgentArticle.content ||
                        "Breaking news update",
                    timestamp: urgentArticle.publishedAt,
                    isLive: hasVideo, // If it has video, consider it potentially live
                    source: urgentArticle.source.name || "News Alert",
                    url: urgentArticle.url,
                    hasVideo: hasVideo,
                    videoUrl: hasVideo ? urgentArticle.url : undefined,
                    videoThumbnail: safeVideoThumbnail,
                };
            }
        }

        // Fallback to a reliable emergency news source if needed
        // This could be implemented by adding additional API calls to emergency news services

        return null; // No urgent news at this time
    } catch (error) {
        console.error("Error fetching urgent news:", error);

        // In development or when API fails, use mock data
        if (USE_MOCK_DATA || axios.isAxiosError(error)) {
            console.log("API request failed, using mock urgent news data");
            return getRandomUrgentNews();
        }

        return null;
    }
};
