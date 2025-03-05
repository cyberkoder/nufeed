import { NewsArticle } from "./NewsArticle";

export interface CacheItem {
    data: NewsArticle[];
    timestamp: number;
}
