import { NewsItem, StockData } from "../types/finance";

// API keys would typically come from environment variables
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "demo-key";
const STOCK_API_KEY = process.env.NEXT_PUBLIC_STOCK_API_KEY || "demo-key";

export async function getFinancialNews(): Promise<NewsItem[]> {
    try {
        // In a real app, use actual financial news API
        // For demo, we're creating mock data
        return [
            {
                title: "Fed Signals Rate Cuts Coming Later This Year",
                description:
                    "The Federal Reserve indicated today that it's prepared to begin cutting interest rates later this year if inflation continues to cool, signaling a potential shift in monetary policy.",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: "Financial Times",
            },
            {
                title: "Tech Giants Report Strong Quarterly Earnings",
                description:
                    "Major technology companies exceeded analyst expectations in their latest earnings reports, driving market optimism despite ongoing economic uncertainties.",
                url: "#",
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: "Wall Street Journal",
            },
            {
                title: "Oil Prices Surge Amid Supply Concerns",
                description:
                    "Crude oil prices jumped to a six-month high as geopolitical tensions raised concerns about global supply disruptions. Analysts predict continued volatility in energy markets.",
                url: "#",
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: "Bloomberg",
            },
            {
                title: "Retail Sales Show Unexpected Growth in Q2",
                description:
                    "Consumer spending increased by 2.3% in the second quarter, surpassing economist forecasts and suggesting resilient consumer confidence despite inflation pressures.",
                url: "#",
                publishedAt: new Date(Date.now() - 10800000).toISOString(),
                source: "CNBC",
            },
            {
                title: "Cryptocurrency Market Stabilizes After Recent Volatility",
                description:
                    "Major cryptocurrencies have found support levels following weeks of price swings, as institutional interest continues to grow in digital asset markets.",
                url: "#",
                publishedAt: new Date(Date.now() - 14400000).toISOString(),
                source: "CoinDesk",
            },
        ];

        // Real implementation would look like:
        // const response = await fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${NEWS_API_KEY}`);
        // const data = await response.json();
        // return data.articles.map(article => ({
        //   title: article.title,
        //   description: article.description,
        //   url: article.url,
        //   publishedAt: article.publishedAt,
        //   source: article.source.name
        // }));
    } catch (error) {
        console.error("Error fetching financial news:", error);
        throw new Error("Failed to fetch financial news");
    }
}

export async function getStockData(): Promise<StockData[]> {
    try {
        // Mock data for demonstration
        return [
            {
                symbol: "AAPL",
                name: "Apple Inc.",
                price: 178.72,
                change: 1.23,
                volume: 82731400,
            },
            {
                symbol: "MSFT",
                name: "Microsoft Corp.",
                price: 402.56,
                change: -0.45,
                volume: 24567800,
            },
            {
                symbol: "GOOGL",
                name: "Alphabet Inc.",
                price: 142.35,
                change: 2.17,
                volume: 19834500,
            },
            {
                symbol: "AMZN",
                name: "Amazon.com Inc.",
                price: 175.35,
                change: 0.89,
                volume: 30456700,
            },
            {
                symbol: "TSLA",
                name: "Tesla Inc.",
                price: 191.59,
                change: -2.34,
                volume: 105678300,
            },
        ];

        // Real implementation would look like:
        // const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        // const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${STOCK_API_KEY}`);
        // const data = await response.json();
        // return data.map(stock => ({
        //   symbol: stock.symbol,
        //   name: stock.name,
        //   price: stock.price,
        //   change: stock.changesPercentage,
        //   volume: stock.volume
        // }));
    } catch (error) {
        console.error("Error fetching stock data:", error);
        throw new Error("Failed to fetch stock data");
    }
}

export async function getMarketIndices(): Promise<
    { name: string; value: number; change: number }[]
> {
    try {
        // Mock data for demonstration
        return [
            { name: "S&P 500", value: 5021.84, change: 0.58 },
            { name: "Dow Jones", value: 38996.39, change: 0.34 },
            { name: "NASDAQ", value: 16041.62, change: 1.12 },
            { name: "Russell 2000", value: 2042.57, change: -0.26 },
        ];
    } catch (error) {
        console.error("Error fetching market indices:", error);
        throw new Error("Failed to fetch market indices");
    }
}
