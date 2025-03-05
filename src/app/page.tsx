"use client";
import { useState, useEffect } from "react";
import { FC } from "react";
import Header from "@/components/Header";
import HeadlineMarquee from "@/components/HeadlineMarquee";
import NewsFeed from "@/components/NewsFeed";
import Footer from "@/components/Footer";
import StockMarketGraph from "@/components/StockMarketGraph";

import { NewsArticle } from "@/types";

const Page: FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    // Handler for when articles are loaded
    const handleArticlesLoaded = (loadedArticles: NewsArticle[]) => {
        setArticles(loadedArticles);
    };

    return (
        <>
            <Header />
            {articles && articles.length > 0 && (
                <HeadlineMarquee articles={articles} />
            )}
            <main className="p-8">
                <div className="max-w-7xl mx-auto">
                    <NewsFeed
                        pageSize={12}
                        onArticlesLoaded={handleArticlesLoaded}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Page;
