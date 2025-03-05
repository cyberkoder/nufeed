import React, { useEffect } from "react";

interface TrendingTopicsProps {
    selectedTopic: string;
    onTopicChange: (topic: string) => void;
    className?: string;
}

// Move the interface outside the component so it can be exported
export interface TopicMapping {
    display: string;
    value: string;
    isCategory: boolean;
}

// Define topics with mapping between display name and API value
// Export this constant so it can be used elsewhere
export const trendingTopics: TopicMapping[] = [
    { display: "Latest", value: "latest", isCategory: false },
    { display: "Business", value: "business", isCategory: true },
    { display: "Entertainment", value: "entertainment", isCategory: true },
    { display: "Health", value: "health", isCategory: true },
    { display: "Science", value: "science", isCategory: true },
    { display: "Sports", value: "sports", isCategory: true },
    { display: "Technology", value: "technology", isCategory: true },
    // Custom topics (will use keyword search)
    { display: "United States", value: "united states", isCategory: false },
    { display: "World", value: "world", isCategory: false },
    { display: "Space", value: "space", isCategory: false },
    { display: "Politics", value: "politics", isCategory: false },
];

// Standalone utility function
export function isCategoryTopic(topicValue: string): boolean {
    const topic = trendingTopics.find((t) => t.value === topicValue);
    return topic ? topic.isCategory : false;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
    selectedTopic,
    onTopicChange,
    className = "",
}) => {
    // Set "Latest" as default when component loads if nothing is selected
    useEffect(() => {
        if (!selectedTopic) {
            onTopicChange("latest");
        }
    }, [selectedTopic, onTopicChange]);

    // Helper function to determine if a topic is selected
    const isTopicSelected = (topicValue: string): boolean => {
        if (topicValue === "latest") {
            return (
                selectedTopic === "latest" ||
                selectedTopic === "" ||
                !selectedTopic
            );
        }
        return selectedTopic === topicValue;
    };

    return (
        <div className={`overflow-x-auto pb-2 w-full ${className}`}>
            <div className="flex flex-col gap-3 items-start">
                <h2 className="text-2xl md:text-xl sm:text-lg text-gray-800 border-b-2 border-gray-100 pb-3 w-full">
                    Trending NuFeeds
                </h2>
                <div className="gap-2 md:gap-3 flex flex-wrap w-full justify-center md:justify-start">
                    {trendingTopics.map((topic) => (
                        <button
                            key={topic.display}
                            onClick={() => onTopicChange(topic.value)}
                            className={`
                                px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium
                                transition-all duration-200 transform hover:scale-105 cursor-pointer
                                ${
                                    isTopicSelected(topic.value)
                                        ? "bg-zinc-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                            `}
                        >
                            {topic.display}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingTopics;
