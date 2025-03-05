"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Article {
    id: number;
    title: string;
    excerpt: string;
    // Add other properties as needed
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            setLoading(true);
            // Replace this with your actual API call
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Search error:", error);
                    setLoading(false);
                });
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">
                {query ? `Search results for: ${query}` : "Search"}
            </h1>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : results.length > 0 ? (
                <div className="space-y-6">
                    {results.map((article) => (
                        <div key={article.id} className="border-b pb-4">
                            <h2 className="text-xl font-semibold">
                                {article.title}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {article.excerpt}
                            </p>
                            <a
                                href="#"
                                className="text-zinc-600 hover:underline mt-2 inline-block"
                            >
                                Read more
                            </a>
                        </div>
                    ))}
                </div>
            ) : query ? (
                <p>No results found for "{query}"</p>
            ) : (
                <p>Enter a search query to find articles</p>
            )}
        </div>
    );
}
