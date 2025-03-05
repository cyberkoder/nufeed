import React from "react";
import { NewsArticle } from "@/types";

export type LayoutType = "grid" | "list" | "compact";

interface ArticleProps {
    article: NewsArticle;
    layout: LayoutType;
    index: number;
}

// Format date helper function
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // Format for date: Jan 1, 2023
    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Format for time: 3:45 PM
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
};

const Article: React.FC<ArticleProps> = ({ article, layout, index }) => {
    switch (layout) {
        case "grid":
            return (
                <div className="border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
                    {article.urlToImage && (
                        <div className="h-44 overflow-hidden">
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).onerror =
                                        null;
                                    (e.target as HTMLImageElement).src =
                                        "https://via.placeholder.com/150?text=No+Image";
                                }}
                            />
                        </div>
                    )}
                    <div className="p-4">
                        <h3 className="text-lg mb-2">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-blue-600 no-underline"
                            >
                                {article.title}
                            </a>
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                            {article.source.name} •{" "}
                            {formatDate(article.publishedAt)}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {article.description}
                        </p>
                    </div>
                </div>
            );

        case "list":
            return (
                <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg bg-white mb-4">
                    {article.urlToImage && (
                        <div className="md:w-1/4 h-44 md:h-auto overflow-hidden">
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).onerror =
                                        null;
                                    (e.target as HTMLImageElement).src =
                                        "https://via.placeholder.com/150?text=No+Image";
                                }}
                            />
                        </div>
                    )}
                    <div className="p-4 md:w-3/4">
                        <h3 className="text-xl font-bold mb-2">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-blue-600 no-underline"
                            >
                                {article.title}
                            </a>
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                            {article.source.name} •{" "}
                            {formatDate(article.publishedAt)}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {article.description}
                        </p>
                    </div>
                </div>
            );

        case "compact":
            return (
                <div className="border-b border-gray-200 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                        {article.urlToImage && (
                            <div className="w-16 h-16 mr-3 flex-shrink-0">
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).onerror =
                                            null;
                                        (e.target as HTMLImageElement).src =
                                            "https://via.placeholder.com/150?text=No+Image";
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium mb-1">
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:text-blue-600 no-underline"
                                >
                                    {article.title}
                                </a>
                            </h3>
                            <p className="text-xs text-gray-500">
                                {article.source.name} •{" "}
                                {formatDate(article.publishedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

export default Article;
