"use client";
import React, { useState, useEffect } from "react";
import {
    fetchTopHeadlines,
    fetchEverything,
    fetchUrgentNews,
} from "@/services/newsService";
import { NewsArticle, UrgentNewsItem } from "@/types";
import { RefreshCcw, Grid, List, Columns } from "lucide-react";
import TrendingTopics, { isCategoryTopic } from "./TrendingTopics";
import UrgentNewsAlert from "./UrgentNewsAlert";
import Article, { LayoutType } from "./Article";

// Define the valid API categories
const validCategories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
];

interface NewsFeedProps {
    category?: string;
    country?: string;
    pageSize?: number;
    forceRefresh?: boolean;
    articles?: NewsArticle[];
    onArticlesLoaded?: (articles: NewsArticle[]) => void; // Add this callback prop
}

const NewsFeed: React.FC<NewsFeedProps> = ({
    category = "",
    country = "us",
    pageSize = 10,
    forceRefresh = false,
    articles,
    onArticlesLoaded,
}) => {
    const [news, setNews] = useState<NewsArticle[]>(articles || []);
    const [loading, setLoading] = useState<boolean>(!articles);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [selectedTopic, setSelectedTopic] = useState<string>(category);
    const [layout, setLayout] = useState<LayoutType>("grid");
    const [urgentNews, setUrgentNews] = useState<UrgentNewsItem | null>(null);
    const [urgentNewsError, setUrgentNewsError] = useState<string | null>(null);
    const [isLoadingUrgent, setIsLoadingUrgent] = useState<boolean>(false);
    const [showRetryButton, setShowRetryButton] = useState<boolean>(false);

    // Use a data URL for the fallback image to prevent network requests
    const fallbackImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999999' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

    // Function to handle topic change
    const handleTopicChange = (topic: string) => {
        setSelectedTopic(topic);
        setRefreshKey((prev) => prev + 1);
    };

    // Function to manually refresh data
    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    // Function to change layout
    const changeLayout = (newLayout: LayoutType) => {
        setLayout(newLayout);
    };

    // Function to dismiss urgent news alert
    const dismissUrgentNews = () => {
        setUrgentNews(null);
    };

    // Update the getUrgentNews function
    const getUrgentNews = async () => {
        setIsLoadingUrgent(true);
        try {
            const data = await fetchUrgentNews();
            setUrgentNews(data);
            setUrgentNewsError(null);
        } catch (error) {
            console.error("Error fetching urgent news:", error);

            // More descriptive error message based on error type
            let errorMessage =
                "Unable to load urgent news. Please check your internet connection and try again.";

            // Check for CORS specific errors
            if (
                error &&
                typeof error === "object" &&
                "message" in error &&
                typeof error.message === "string" &&
                (error.message.includes("CORS") ||
                    error.message.includes("cross-origin") ||
                    error.message.includes("Cross-origin request blocked"))
            ) {
                errorMessage =
                    "Cross-origin request blocked. Please contact support.";
            }

            setUrgentNewsError(errorMessage);
            setShowRetryButton(true);

            // Try to load from cache on error
            try {
                const cachedData = localStorage.getItem("cachedUrgentNews");
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    setUrgentNews(parsedData);
                    // Still show error but with indication that we're using cached data
                    setUrgentNewsError("Using cached data. " + errorMessage);
                }
            } catch (cacheError) {
                console.error("Error retrieving cached data:", cacheError);
            }
        } finally {
            setIsLoadingUrgent(false);
        }
    };

    // In the useEffect where you call getUrgentNews, add offline detection
    useEffect(() => {
        getUrgentNews();

        // Add offline/online event listeners
        const handleOffline = () => {
            setUrgentNewsError(
                "You appear to be offline. Showing cached news if available."
            );
        };

        const handleOnline = () => {
            // When back online, retry fetching data
            if (urgentNewsError) {
                getUrgentNews();
            }
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    // Fetch regular news only if articles weren't provided as props
    useEffect(() => {
        // Skip API call if articles were provided as props
        if (articles) {
            setNews(articles);
            setLoading(false);
            // Call the callback even if articles are provided via props
            if (onArticlesLoaded) {
                onArticlesLoaded(articles);
            }
            return;
        }

        const getNews = async () => {
            setLoading(true);
            try {
                let fetchedArticles: NewsArticle[] = [];
                console.log(
                    "Fetching news for topic:",
                    selectedTopic || "latest news"
                );

                // Don't allow empty selectedTopic - use "latest" as default
                const effectiveTopic = selectedTopic || "latest";

                if (effectiveTopic === "latest") {
                    // For latest news, use top headlines with no category
                    fetchedArticles = await fetchTopHeadlines({
                        country,
                        pageSize,
                    });
                } else if (isCategoryTopic(effectiveTopic)) {
                    // For valid API categories, use the category parameter
                    fetchedArticles = await fetchTopHeadlines({
                        country,
                        category: effectiveTopic,
                        pageSize,
                    });
                } else {
                    // For custom topics (like "Space", "Politics"), use the everything endpoint with q parameter
                    fetchedArticles = await fetchEverything({
                        q: effectiveTopic,
                        pageSize,
                    });
                }

                setNews(fetchedArticles);
                setError(null);

                // Call the callback with the fetched articles
                if (onArticlesLoaded) {
                    onArticlesLoaded(fetchedArticles);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to load news. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, [
        country,
        category,
        pageSize,
        refreshKey,
        forceRefresh,
        selectedTopic,
        articles,
        onArticlesLoaded,
    ]);

    if (loading)
        return (
            <div className="py-5 text-center bg-gray-100 rounded-lg my-5">
                Loading news...
            </div>
        );
    if (error)
        return (
            <div className="py-5 text-center bg-gray-100 rounded-lg my-5 text-red-600">
                {error}
            </div>
        );

    // Get layout-specific container classes
    const getLayoutContainerClasses = () => {
        switch (layout) {
            case "grid":
                return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5";
            case "list":
            case "compact":
                return "flex flex-col";
            default:
                return "";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-5">
            {urgentNews && (
                <UrgentNewsAlert
                    news={urgentNews}
                    onDismiss={dismissUrgentNews}
                />
            )}

            <TrendingTopics
                selectedTopic={selectedTopic}
                onTopicChange={handleTopicChange}
                className="mb-5"
            />

            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl text-gray-800 border-b-2 border-gray-100 pb-2.5">
                    {(selectedTopic || category) &&
                        selectedTopic !== "" &&
                        `${(selectedTopic || category)
                            .split(" ")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}`}{" "}
                    News
                </h2>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-lg p-1 flex">
                        <button
                            onClick={() => changeLayout("grid")}
                            className={`p-2 rounded ${
                                layout === "grid" ? "bg-white shadow-sm" : ""
                            }`}
                            title="Grid view"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => changeLayout("list")}
                            className={`p-2 rounded ${
                                layout === "list" ? "bg-white shadow-sm" : ""
                            }`}
                            title="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => changeLayout("compact")}
                            className={`p-2 rounded ${
                                layout === "compact" ? "bg-white shadow-sm" : ""
                            }`}
                            title="Compact view"
                        >
                            <Columns className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition-colors flex items-center"
                        title="Refresh"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className={`${getLayoutContainerClasses()} w-full`}>
                {news.length === 0 ? (
                    <div className="col-span-full w-full p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                            No news articles available at the moment
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-zinc-500 text-white rounded-md hover:bg-zinc-600 transition-colors inline-flex items-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Try refreshing
                        </button>
                    </div>
                ) : (
                    news.map((article, index) => (
                        <div
                            key={index}
                            className="animate-slideUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Article
                                article={article}
                                layout={layout}
                                index={index}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
