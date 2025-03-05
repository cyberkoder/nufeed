"use client";

import { useFeedStore, NewsCategory } from "@/store/useFeedStore";
import clsx from "clsx";

const categories: { id: NewsCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "us_news", label: "US News" },
    { id: "world_news", label: "World News" },
    { id: "technology", label: "Technology" },
    { id: "business", label: "Business" },
    { id: "sports", label: "Sports" },
    { id: "entertainment", label: "Entertainment" },
    { id: "health", label: "Health" },
    { id: "science", label: "Science" },
];

export default function CategoryFilter() {
    const { selectedCategory, setCategory } = useFeedStore();

    return (
        <div className="flex flex-wrap gap-2 mb-6 mt-2">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setCategory(category.id)}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        selectedCategory === category.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300"
                    )}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}
