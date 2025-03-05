export interface NewsItem {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
}

export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    volume: number;
}
