// Re-export all functionality from the modular files
export * from "./config";
export { fetchTopHeadlines } from "./headlinesService";
export { fetchUrgentNews } from "./urgentNewsService";
export { searchNews } from "./searchService";
export { clearNewsCache } from "./cache";
