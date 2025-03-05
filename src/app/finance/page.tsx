"use client";

import { useState, useEffect } from "react";
import StockMarketGraph from "@/components/StockMarketGraph";
import {
    getFinancialNews,
    getStockData,
    getMarketIndices,
} from "@/services/financeService";
import { NewsItem, StockData } from "@/types/finance";
import MarketOverview from "@/components/finance/MarketOverview";
import StockCard from "@/components/finance/StockCard";
import NewsCard from "@/components/finance/NewsCard";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FinancePage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [indices, setIndices] = useState<
        { name: string; value: number; change: number }[]
    >([]);
    const [loading, setLoading] = useState<{
        news: boolean;
        stocks: boolean;
        indices: boolean;
    }>({
        news: true,
        stocks: true,
        indices: true,
    });
    const [error, setError] = useState<{
        news: string | null;
        stocks: string | null;
        indices: string | null;
    }>({
        news: null,
        stocks: null,
        indices: null,
    });

    const fetchData = async () => {
        // Fetch news
        setLoading((prev) => ({ ...prev, news: true }));
        try {
            const newsData = await getFinancialNews();
            setNews(newsData);
            setError((prev) => ({ ...prev, news: null }));
        } catch (err) {
            setError((prev) => ({
                ...prev,
                news: "Failed to load financial news",
            }));
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, news: false }));
        }

        // Fetch stocks
        setLoading((prev) => ({ ...prev, stocks: true }));
        try {
            const stockData = await getStockData();
            setStocks(stockData);
            setError((prev) => ({ ...prev, stocks: null }));
        } catch (err) {
            setError((prev) => ({
                ...prev,
                stocks: "Failed to load stock data",
            }));
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, stocks: false }));
        }

        // Fetch indices
        setLoading((prev) => ({ ...prev, indices: true }));
        try {
            const indicesData = await getMarketIndices();
            setIndices(indicesData);
            setError((prev) => ({ ...prev, indices: null }));
        } catch (err) {
            setError((prev) => ({
                ...prev,
                indices: "Failed to load market indices",
            }));
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, indices: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto">
                <div className="min-h-screen">
                    <div className="container mx-auto py-8 px-4">
                        <header className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">
                                        Finance Dashboard
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Real-time market insights and news
                                    </p>
                                </div>
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    disabled={
                                        loading.news ||
                                        loading.stocks ||
                                        loading.indices
                                    }
                                >
                                    <RefreshCw
                                        size={16}
                                        className={
                                            loading.news ||
                                            loading.stocks ||
                                            loading.indices
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />
                                    Refresh
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {indices.slice(0, 3).map((index) => (
                                    <div
                                        key={index.name}
                                        className="bg-white px-4 py-2 rounded-md shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {index.name}
                                            </span>
                                            <span className="font-semibold">
                                                {index.value.toLocaleString()}
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${
                                                    index.change >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {index.change >= 0 ? "+" : ""}
                                                {index.change.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Market Overview Section */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        Market Overview
                                    </h2>
                                    <div className="mb-6">
                                        {loading.indices ? (
                                            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
                                        ) : error.indices ? (
                                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded border border-gray-200">
                                                <div className="flex items-center text-red-600">
                                                    <AlertCircle
                                                        size={20}
                                                        className="mr-2"
                                                    />
                                                    <span>{error.indices}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <StockMarketGraph />
                                        )}
                                    </div>
                                </div>

                                {error.indices ? null : (
                                    <MarketOverview indices={indices} />
                                )}

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold">
                                        Top Stocks
                                    </h2>

                                    {loading.stocks ? (
                                        <div className="space-y-4">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="animate-pulse h-24 bg-gray-200 rounded-lg"
                                                ></div>
                                            ))}
                                        </div>
                                    ) : error.stocks ? (
                                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center text-red-600">
                                                <AlertCircle
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                <span>{error.stocks}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {stocks.map((stock) => (
                                                <StockCard
                                                    key={stock.symbol}
                                                    stock={stock}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* News Section */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-2xl font-semibold mb-6">
                                        Financial News
                                    </h2>

                                    {loading.news ? (
                                        <div className="space-y-6">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="animate-pulse space-y-3"
                                                >
                                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : error.news ? (
                                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex items-center text-red-600">
                                                <AlertCircle
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                <span>{error.news}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {news.map((item, index) => (
                                                <NewsCard
                                                    key={index}
                                                    news={item}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
