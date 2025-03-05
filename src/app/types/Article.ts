export interface Article {
    id: string;
    title: string;
    description: string;
    content: string;
    author: string;
    publishedDate: Date;
    imageUrl?: string;
    tags?: string[];
    slug: string;
}
