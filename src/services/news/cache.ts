import { CacheItem } from "./types";
import { CACHE_DURATION } from "./config";

// Cache storage
const headlinesCache: Record<string, CacheItem> = {};
const searchCache: Record<string, CacheItem> = {};

export function getCachedHeadlines(cacheKey: string): CacheItem | null {
    const cachedResponse = headlinesCache[cacheKey];
    const now = Date.now();

    if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
        console.log("Using cached headlines data");
        return cachedResponse;
    }
    return null;
}

export function cacheHeadlines(cacheKey: string, data: any): void {
    headlinesCache[cacheKey] = {
        data,
        timestamp: Date.now(),
    };
}

export function getExpiredHeadlinesCache(cacheKey: string): CacheItem | null {
    return headlinesCache[cacheKey] || null;
}

export function getCachedSearch(cacheKey: string): CacheItem | null {
    const cachedResponse = searchCache[cacheKey];
    const now = Date.now();

    if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
        console.log("Using cached search data");
        return cachedResponse;
    }
    return null;
}

export function cacheSearch(cacheKey: string, data: any): void {
    searchCache[cacheKey] = {
        data,
        timestamp: Date.now(),
    };
}

export function getExpiredSearchCache(cacheKey: string): CacheItem | null {
    return searchCache[cacheKey] || null;
}

export function clearNewsCache(): void {
    Object.keys(headlinesCache).forEach((key) => delete headlinesCache[key]);
    Object.keys(searchCache).forEach((key) => delete searchCache[key]);
}
