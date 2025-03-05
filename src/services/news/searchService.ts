import axios from "axios";
import { NewsArticle, NewsResponse } from "./types";
import { API_KEY, BASE_URL, USE_MOCK_DATA } from "./config";
import { getCachedSearch, cacheSearch, getExpiredSearchCache } from "./cache";
import { mockNewsArticles } from "./mockNewsData";

export const searchNews = async (
    query: string,
    pageSize = 10
): Promise<NewsArticle[]> => {
    // If using mock data in development, return filtered mock headlines
    if (USE_MOCK_DATA) {
        console.log("Using mock search data");
        // Filter mock data based on query to simulate search
        const filteredMock = mockNewsArticles.filter(
            (article) =>
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                (article.description &&
                    article.description
                        .toLowerCase()
                        .includes(query.toLowerCase()))
        );
        return filteredMock.length
            ? filteredMock
            : mockNewsArticles.slice(0, 3);
    }

    // Create a cache key based on the parameters
    const cacheKey = `${query}-${pageSize}`;

    // Check if we have a valid cached response
    const cachedData = getCachedSearch(cacheKey);
    if (cachedData) {
        return cachedData.data;
    }

    try {
        const response = await axios.get<NewsResponse>(
            `${BASE_URL}/everything`,
            {
                params: {
                    q: query,
                    pageSize,
                    apiKey: API_KEY,
                },
                timeout: 10000, // Add timeout
            }
        );

        // Cache the fresh data
        cacheSearch(cacheKey, response.data.articles);
        return response.data.articles;
    } catch (error) {
        console.error("Error searching news:", error);

        // Return cached data even if expired if request fails
        const staleCache = getExpiredSearchCache(cacheKey);
        if (staleCache) {
            console.log("Using stale cache due to request failure");
            return staleCache.data;
        }

        // If no cached data and in development mode, return mock data
        if (USE_MOCK_DATA || axios.isAxiosError(error)) {
            console.log("API request failed, using mock search data");
            const filteredMock = mockNewsArticles.filter(
                (article) =>
                    article.title.toLowerCase().includes(query.toLowerCase()) ||
                    (article.description &&
                        article.description
                            .toLowerCase()
                            .includes(query.toLowerCase()))
            );
            return filteredMock.length
                ? filteredMock
                : mockNewsArticles.slice(0, 3);
        }

        return [];
    }
};
