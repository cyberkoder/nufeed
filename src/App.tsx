import React, { useState, useEffect } from "react";
import { fetchTopHeadlines } from "./services/newsService";
import Header from "./app/components/Header";
import NewsFeed from "./app/components/NewsFeed";
import HeadlineMarquee from "./app/components/HeadlineMarquee";
import { NewsArticle } from "@/types";

const App: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState("");

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const newsArticles = await fetchTopHeadlines({
                    country: "us",
                    category: "",
                    pageSize: 20,
                    topic: selectedTopic,
                });
                setArticles(newsArticles);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An error occurred";
                setError(errorMessage);
                console.error("Failed to load news:", error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [selectedTopic]);

    const handleTopicChange = (topic: string) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="app">
            <Header />
            <HeadlineMarquee articles={articles} />
            <main className="content">
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                    <div className="loading-spinner">
                        {/* Add a proper loading spinner component here */}
                        Loading news...
                    </div>
                ) : (
                    <>
                        <NewsFeed articles={articles} />
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
