import React from "react";
import { UrgentNewsItem } from "../../services/newsService";
import { AlertCircle, Radio } from "lucide-react";

interface UrgentNewsAlertProps {
    news: UrgentNewsItem;
    onDismiss: () => void;
}

const UrgentNewsAlert: React.FC<UrgentNewsAlertProps> = ({
    news,
    onDismiss,
}) => {
    return (
        <div className="mb-6 animate-fadeIn">
            <div
                className={`rounded-lg shadow-md overflow-hidden ${
                    news.isLive
                        ? "border-l-8 border-red-500"
                        : "border-l-8 border-amber-500"
                }`}
            >
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            {news.isLive ? (
                                <div className="flex items-center">
                                    <Radio className="w-4 h-4 text-red-500 mr-2 animate-pulse" />
                                    <span className="text-red-400 font-semibold text-sm uppercase tracking-wider mr-2">
                                        Live
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 text-amber-400 mr-2" />
                                    <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider mr-2">
                                        Breaking
                                    </span>
                                </div>
                            )}
                            <span className="text-gray-300 text-xs">
                                {new Date(news.timestamp).toLocaleTimeString()}{" "}
                                · {news.source}
                            </span>
                        </div>
                        <button
                            onClick={onDismiss}
                            className="text-gray-400 hover:text-white transition-colors ml-4"
                            aria-label="Dismiss alert"
                        >
                            ×
                        </button>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{news.title}</h3>
                    <p className="text-gray-200 mb-2">{news.content}</p>
                    {news.url && (
                        <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm text-blue-400 hover:text-blue-300 hover:underline mt-1"
                        >
                            Read more →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UrgentNewsAlert;
