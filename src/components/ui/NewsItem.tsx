import { NewsItem as NewsItemType } from "@/store/useFeedStore";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface NewsItemProps {
    item: NewsItemType;
}

export default function NewsItem({ item }: NewsItemProps) {
    const timeAgo = formatDistanceToNow(new Date(item.publishedAt), {
        addSuffix: true,
    });

    return (
        <div className="bg-white dark:bg-dark-200 rounded-lg shadow mb-4 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {item.source}
                    </span>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">
                        •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {timeAgo}
                    </span>
                </div>

                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {item.title}
                </h2>

                {item.imageUrl && (
                    <div className="mb-3 relative h-48 w-full">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {item.summary}
                </p>

                <div className="flex justify-between items-center">
                    <span className="inline-block bg-gray-100 dark:bg-dark-300 rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {item.category.replace("_", " ")}
                    </span>
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary hover:underline text-sm font-medium"
                    >
                        Read more
                    </a>
                </div>
            </div>
        </div>
    );
}
