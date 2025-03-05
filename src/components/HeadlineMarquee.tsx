"use client";
import React, { useEffect, useRef, useState } from "react";
import { NewsArticle } from "@/types";

interface HeadlineMarqueeProps {
    articles: NewsArticle[];
}

const HeadlineMarquee: React.FC<HeadlineMarqueeProps> = ({ articles }) => {
    const [animationDuration, setAnimationDuration] = useState<number>(30); // seconds
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Adjust animation speed based on content width
            const containerWidth = containerRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            // Ensure the animation duration is proportional to content length
            const calculatedDuration = (containerWidth / viewportWidth) * 15;
            setAnimationDuration(Math.max(calculatedDuration, 10));
        }
    }, [articles]);

    return (
        <div className="w-full overflow-hidden py-2 sticky top-0 z-50 mb-5 bg-white border-b border-t border-gray-200">
            <div
                className="inline-flex whitespace-nowrap animate-marquee"
                ref={containerRef}
                style={{
                    ["--duration" as string]: `${animationDuration}s`,
                }}
            >
                {articles.map((article: NewsArticle, index: number) => (
                    <React.Fragment key={index}>
                        <a
                            href={article.url}
                            className="text-gray-800 no-underline font-semibold px-3 transition-colors duration-200 hover:text-blue-600 hover:underline"
                        >
                            {article.title}
                        </a>
                        {index < articles.length - 1 && (
                            <span className="opacity-50 mx-2">•</span>
                        )}
                    </React.Fragment>
                ))}

                {/* Duplicate headlines for seamless looping */}
                {articles.map((article: NewsArticle, index: number) => (
                    <React.Fragment key={`dup-${index}`}>
                        <a
                            href={article.url}
                            className="text-gray-800 no-underline font-semibold px-3 transition-colors duration-200 hover:text-blue-600 hover:underline"
                        >
                            {article.title}
                        </a>
                        {index < articles.length - 1 && (
                            <span className="opacity-50 mx-2">•</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default HeadlineMarquee;
