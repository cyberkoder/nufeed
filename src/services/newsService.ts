import axios from "axios";
import { CacheItem, NewsArticle, NewsResponse } from "@/types";

// Set new base URL to our API proxy
const API_PROXY_URL = "/api/news";

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const headlinesCache: Record<string, CacheItem> = {};
const searchCache: Record<string, CacheItem> = {};

// Common news topics users may want to filter by
export const popularTopics = [
    "Technology",
    "Business",
    "Sports",
    "Entertainment",
    "Health",
    "Science",
    "Politics",
];

export const fetchTopHeadlines = async ({
    country = "us",
    category = "",
    pageSize = 10,
    topic = "", // Add topic parameter
}: {
    country?: string;
    category?: string;
    pageSize?: number;
    topic?: string;
}): Promise<NewsArticle[]> => {
    // Create a cache key based on the parameters
    const cacheKey = `${country}-${category}-${pageSize}-${topic}`;

    // Check if we have a valid cached response
    const cachedResponse = headlinesCache[cacheKey];
    const now = Date.now();

    if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
        console.log("Using cached headlines data");
        return cachedResponse.data;
    }

    try {
        // If a topic is specified, add it as a 'q' parameter
        const params: Record<string, string | number> = {
            endpoint: "top-headlines", // Specify which News API endpoint to use
            country,
            pageSize,
        };

        if (category) params.category = category;
        if (topic) params.q = topic;

        // Call our proxy endpoint instead of News API directly
        const response = await axios.get<NewsResponse>(API_PROXY_URL, {
            params,
            timeout: 10000,
        });

        // Cache the fresh data
        headlinesCache[cacheKey] = {
            data: response.data.articles || [],
            timestamp: now,
        };

        return response.data.articles || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        // Return cached data even if expired if request fails
        if (cachedResponse) {
            console.log("Using stale cache due to request failure");
            return cachedResponse.data;
        }

        return [];
    }
};

// Update the fetchUrgentNews function with better error handling and CORS support
export const fetchUrgentNews = async () => {
    try {
        // Use relative URL for same-origin API calls to avoid CORS issues
        const response = await axios.get("/api/urgent-news", {
            timeout: 10000, // 10 second timeout
            headers: {
                "Content-Type": "application/json",
                // If you're using authentication, add it here
                // 'Authorization': `Bearer ${token}`
            },
        });

        // Debug response
        console.log("Urgent news response:", response.status);

        // Cache successful responses
        if (response.data) {
            cacheUrgentNews(response.data);
        }

        return response.data;
    } catch (error) {
        // Enhanced error logging with more details
        if (axios.isAxiosError(error)) {
            const errorDetails = {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                statusText: error.response?.statusText,
                headers: error.config?.headers,
                message: error.message,
                isNetworkError: error.code === "ERR_NETWORK",
                isCORSError:
                    error.message.includes("CORS") ||
                    error.message.includes("cross-origin"),
            };

            console.error("Urgent news fetch failed:", errorDetails);

            // Handle specific CORS errors with better messaging
            if (errorDetails.isCORSError) {
                console.error(
                    "CORS error detected. This is likely due to a cross-origin policy issue."
                );
                throw new Error(
                    "Cross-origin request blocked. Please check your API configuration."
                );
            }

            // If it's a network error, we might want to use cached data if available
            if (error.code === "ERR_NETWORK") {
                const cachedNews = localStorage.getItem("cached_urgent_news");
                if (cachedNews) {
                    console.log(
                        "Using cached urgent news due to network error"
                    );
                    return JSON.parse(cachedNews);
                }
            }
        } else {
            console.error("Unexpected error fetching urgent news:", error);
        }

        // Re-throw with more helpful message
        throw new Error(
            `Failed to load urgent news: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
};

// Add a function to cache the urgent news for fallback
export const cacheUrgentNews = (data: any) => {
    try {
        localStorage.setItem("cached_urgent_news", JSON.stringify(data));
    } catch (err) {
        console.warn("Failed to cache urgent news:", err);
    }
};

export const searchNews = async (
    query: string,
    pageSize = 10
): Promise<NewsArticle[]> => {
    // Don't allow empty queries - use a default if empty
    const searchQuery = query.trim() || "latest news";

    // Create a cache key based on the parameters
    const cacheKey = `${searchQuery}-${pageSize}`;

    // Check if we have a valid cached response
    const cachedResponse = searchCache[cacheKey];
    const now = Date.now();

    if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
        console.log("Using cached search data");
        return cachedResponse.data;
    }

    try {
        const response = await axios.get<NewsResponse>(API_PROXY_URL, {
            params: {
                endpoint: "everything",
                q: searchQuery,
                pageSize,
            },
            timeout: 10000,
        });

        // Cache the fresh data
        searchCache[cacheKey] = {
            data: response.data.articles || [],
            timestamp: now,
        };

        return response.data.articles || [];
    } catch (error) {
        console.error("Error searching news:", error);
        // Return cached data even if expired if request fails
        if (cachedResponse) {
            console.log("Using stale cache due to request failure");
            return cachedResponse.data;
        }

        return [];
    }
};

// Add fetchEverything to your newsService.ts file if it doesn't exist

export interface NewsSearchParams {
    q?: string;
    pageSize?: number;
    page?: number;
    language?: string;
    sortBy?: "relevancy" | "popularity" | "publishedAt";
}

export async function fetchEverything({
    q = "",
    pageSize = 10,
    page = 1,
    language = "en",
    sortBy = "publishedAt",
}: NewsSearchParams): Promise<NewsArticle[]> {
    try {
        // If query is empty, use a default topic - empty queries cause 401 errors
        const searchQuery = q || "news";

        const params = {
            endpoint: "everything",
            q: searchQuery,
            pageSize: pageSize.toString(),
            page: page.toString(),
            language,
            sortBy,
        };

        // Use our proxy instead of direct API call
        const response = await axios.get(API_PROXY_URL, { params });

        if (response.status !== 200) {
            throw new Error(`News API returned ${response.status}`);
        }

        return response.data.articles || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}

// For debugging/development - utility to clear the cache if needed
export const clearNewsCache = () => {
    Object.keys(headlinesCache).forEach((key) => delete headlinesCache[key]);
    Object.keys(searchCache).forEach((key) => delete searchCache[key]);
};
