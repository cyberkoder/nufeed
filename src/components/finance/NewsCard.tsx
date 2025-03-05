import { NewsItem } from "@/types/finance";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { squareArrowUpRight } from "lucide-react";

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function NewsCard({ news }: { news: NewsItem }) {
    return (
        <Card className="hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold hover:text-blue-600 flex-grow">
                        <a
                            href={news.url}
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                            {news.title}
                        </a>
                    </h3>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="font-medium">{news.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(news.publishedAt)}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="text-gray-700 leading-relaxed">
                    {news.description}
                </p>
                <a
                    href={news.url}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center mt-3 text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Read full article
                    <squareArrowUpRight className="ml-1 h-4 w-4" />
                </a>
            </CardContent>
        </Card>
    );
}
