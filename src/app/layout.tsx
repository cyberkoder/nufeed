"use client";
import React, { FC, ReactNode, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeadlineMarquee from "@/components/HeadlineMarquee";
import { NewsArticle } from "@/types";
import ClientLogger from "@/components/ClientLogger";
import "./globals.css";

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    // This function will be passed to NewsFeed components
    const handleArticlesLoaded = (loadedArticles: NewsArticle[]) => {
        setArticles(loadedArticles);
    };

    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                {articles.length > 0 && <HeadlineMarquee articles={articles} />}
                <ClientLogger
                    data={articles.length}
                    label="Number of articles"
                />
                <div className="flex-grow">
                    {React.isValidElement(children) && "props" in children
                        ? React.cloneElement(children, {
                              ...children.props,
                              onArticlesLoaded: handleArticlesLoaded,
                          })
                        : children}
                </div>
            </body>
        </html>
    );
};

export default RootLayout;
