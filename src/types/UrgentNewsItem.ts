export interface UrgentNewsItem {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    isLive: boolean;
    source: string;
    url?: string;
    hasVideo: boolean;
    videoUrl?: string;
    videoThumbnail?: string;
}
