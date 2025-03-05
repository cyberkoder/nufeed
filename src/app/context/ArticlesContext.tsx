"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { NewsArticle } from "@/types";

interface ArticlesContextType {
    articles: NewsArticle[];
    setArticles: (articles: NewsArticle[]) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
    undefined
);

export function ArticlesProvider({ children }: { children: ReactNode }) {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    return (
        <ArticlesContext.Provider value={{ articles, setArticles }}>
            {children}
        </ArticlesContext.Provider>
    );
}

export function useArticles() {
    const context = useContext(ArticlesContext);
    if (context === undefined) {
        throw new Error("useArticles must be used within an ArticlesProvider");
    }
    return context;
}
