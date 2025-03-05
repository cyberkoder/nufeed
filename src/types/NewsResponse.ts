import { NewsArticle } from "./NewsArticle";

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}
