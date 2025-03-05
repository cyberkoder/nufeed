import axios from "axios";
import { NewsArticle, NewsResponse } from "./types";
import { API_KEY, BASE_URL } from "./config";
import {
    getCachedHeadlines,
    cacheHeadlines,
    getExpiredHeadlinesCache,
} from "./cache";

export const fetchTopHeadlines = async (
    country = "us",
    category = "",
    pageSize = 10,
    topic = "" // Topic parameter for more specific queries
): Promise<NewsArticle[]> => {
    // Create a cache key based on the parameters
    const cacheKey = `${country}-${category}-${pageSize}-${topic}`;

    // Check if we have a valid cached response
    const cachedData = getCachedHeadlines(cacheKey);
    if (cachedData) {
        return cachedData.data;
    }

    try {
        // If a topic is specified, add it as a 'q' parameter
        const params: Record<string, string | number> = {
            country,
            pageSize,
            apiKey: API_KEY,
        };

        if (category) params.category = category;
        if (topic) params.q = topic;

        // Add timeout to prevent hanging requests
        const response = await axios.get<NewsResponse>(
            `${BASE_URL}/top-headlines`,
            {
                params,
                timeout: 10000,
            }
        );

        // Cache the fresh data
        cacheHeadlines(cacheKey, response.data.articles);
        return response.data.articles;
    } catch (error) {
        console.error("Error fetching news:", error);
        // Return cached data even if expired if request fails
        const staleCache = getExpiredHeadlinesCache(cacheKey);
        if (staleCache) {
            console.log("Using stale cache due to request failure");
            return staleCache.data;
        }

        return [];
    }
};
