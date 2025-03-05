"use client";
import React, { useEffect, useState } from "react";

// Import Shadcn components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Import types
import { StockData } from "@/types";

interface StockMarketGraphProps {
    className?: string;
}

const StockMarketGraph: React.FC<StockMarketGraphProps> = ({ className }) => {
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

    useEffect(() => {
        const fetchStockData = () => {
            setIsLoading(true);

            // Simulate API call delay
            setTimeout(() => {
                // Generate mock data based on selected timeframe
                const dataPoints =
                    selectedTimeframe === "1D"
                        ? 24
                        : selectedTimeframe === "1W"
                        ? 7
                        : selectedTimeframe === "1M"
                        ? 30
                        : selectedTimeframe === "3M"
                        ? 90
                        : 180;

                const generateMockData = () => {
                    const dates: string[] = [];
                    const values: number[] = [];
                    let baseValue = 150;

                    for (let i = 0; i < dataPoints; i++) {
                        if (selectedTimeframe === "1D") {
                            dates.push(`${i}:00`);
                        } else {
                            dates.push(`Day ${i + 1}`);
                        }

                        // Create some random movement
                        baseValue = baseValue + Math.random() * 10 - 5;
                        values.push(baseValue);
                    }

                    // Calculate change
                    const startValue = values[0];
                    const endValue = values[values.length - 1];
                    const changeValue = endValue - startValue;
                    const changePercentage = (changeValue / startValue) * 100;

                    return {
                        dates,
                        values,
                        change: {
                            value: changeValue,
                            percentage: changePercentage,
                        },
                    };
                };

                const mockData = generateMockData();
                setStockData(mockData);
                setIsLoading(false);
            }, 1000);
        };

        fetchStockData();
    }, [selectedTimeframe]);

    const timeframeOptions = ["1D", "1W", "1M", "3M", "6M"];

    // Function to find min and max values for scaling the chart
    const getMinMax = (values: number[]) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const buffer = (max - min) * 0.1; // Add 10% buffer
        return { min: min - buffer, max: max + buffer };
    };

    // Function to normalize y-values to fit in the chart height
    const normalizeValue = (
        value: number,
        min: number,
        max: number,
        height: number
    ) => {
        const range = max - min;
        if (range === 0) return height / 2;
        return height - ((value - min) / range) * height;
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle>Market Snapshot</CardTitle>
                    <Tabs
                        defaultValue="1D"
                        value={selectedTimeframe}
                        onValueChange={setSelectedTimeframe}
                        className="w-auto"
                    >
                        <TabsList>
                            {timeframeOptions.map((option) => (
                                <TabsTrigger key={option} value={option}>
                                    {option}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {isLoading ? (
                        <div className="w-full h-full flex flex-col gap-4 justify-center">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[70%]" />
                            <Skeleton className="h-4 w-[85%]" />
                        </div>
                    ) : stockData ? (
                        <div className="h-full">
                            <div className="flex items-baseline mb-4">
                                <h3 className="text-2xl font-bold">
                                    $
                                    {stockData.values[
                                        stockData.values.length - 1
                                    ].toFixed(2)}
                                </h3>
                                <span
                                    className={`ml-2 text-sm ${
                                        stockData.change.percentage >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {stockData.change.percentage >= 0
                                        ? "+"
                                        : ""}
                                    {stockData.change.percentage.toFixed(2)}%
                                </span>
                            </div>

                            {/* Improved custom chart implementation */}
                            <div className="relative h-[200px] w-full mt-6 pl-14 pr-2">
                                {stockData.values.length > 0 &&
                                    (() => {
                                        const { min, max } = getMinMax(
                                            stockData.values
                                        );
                                        const chartHeight = 200;
                                        const isPositive =
                                            stockData.change.percentage >= 0;
                                        const chartColor = isPositive
                                            ? "rgb(34, 197, 94)"
                                            : "rgb(239, 68, 68)";

                                        // Generate path points for area fill
                                        const areaPoints = [
                                            "0,200", // Start from bottom left
                                            ...stockData.values.map(
                                                (value, i) => {
                                                    const x =
                                                        (i /
                                                            (stockData.values
                                                                .length -
                                                                1)) *
                                                        100;
                                                    const y = normalizeValue(
                                                        value,
                                                        min,
                                                        max,
                                                        chartHeight
                                                    );
                                                    return `${x}%,${y}px`;
                                                }
                                            ),
                                            "100%,200px", // End at bottom right
                                        ].join(" ");

                                        // Generate path for the line
                                        const linePoints = stockData.values
                                            .map((value, i) => {
                                                const x =
                                                    (i /
                                                        (stockData.values
                                                            .length -
                                                            1)) *
                                                        100 +
                                                    "%";
                                                const y = normalizeValue(
                                                    value,
                                                    min,
                                                    max,
                                                    chartHeight
                                                );
                                                return `${x},${y}`;
                                            })
                                            .join(" ");

                                        const lastValue =
                                            stockData.values[
                                                stockData.values.length - 1
                                            ];
                                        const lastY = normalizeValue(
                                            lastValue,
                                            min,
                                            max,
                                            chartHeight
                                        );

                                        return (
                                            <>
                                                {/* Chart grid lines with better spacing */}
                                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                                                    <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>{" "}
                                                    {/* Heavier bottom line */}
                                                </div>

                                                {/* Y-axis labels with better positioning */}
                                                <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-xs text-muted-foreground">
                                                    <div>${max.toFixed(2)}</div>
                                                    <div>
                                                        $
                                                        {(
                                                            (max + min) /
                                                            2
                                                        ).toFixed(2)}
                                                    </div>
                                                    <div>${min.toFixed(2)}</div>
                                                </div>

                                                {/* Enhanced SVG chart */}
                                                <svg className="absolute inset-0 overflow-visible">
                                                    {/* Gradient for area fill */}
                                                    <defs>
                                                        <linearGradient
                                                            id="areaGradient"
                                                            x1="0%"
                                                            y1="0%"
                                                            x2="0%"
                                                            y2="100%"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor={
                                                                    isPositive
                                                                        ? "rgb(34, 197, 94)"
                                                                        : "rgb(239, 68, 68)"
                                                                }
                                                                stopOpacity="0.2"
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor={
                                                                    isPositive
                                                                        ? "rgb(34, 197, 94)"
                                                                        : "rgb(239, 68, 68)"
                                                                }
                                                                stopOpacity="0.02"
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    {/* Area fill under the line */}
                                                    <polygon
                                                        points={areaPoints}
                                                        fill="url(#areaGradient)"
                                                    />

                                                    {/* Line path with enhanced styling */}
                                                    <polyline
                                                        points={linePoints}
                                                        fill="none"
                                                        stroke={chartColor}
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        vectorEffect="non-scaling-stroke"
                                                    />

                                                    {/* Data points to enhance readability */}
                                                    {stockData.values.map(
                                                        (value, i) => {
                                                            // Only show a few dots to avoid cluttering
                                                            if (
                                                                i %
                                                                    Math.ceil(
                                                                        stockData
                                                                            .values
                                                                            .length /
                                                                            5
                                                                    ) !==
                                                                    0 &&
                                                                i !==
                                                                    stockData
                                                                        .values
                                                                        .length -
                                                                        1
                                                            )
                                                                return null;

                                                            const x =
                                                                (i /
                                                                    (stockData
                                                                        .values
                                                                        .length -
                                                                        1)) *
                                                                    100 +
                                                                "%";
                                                            const y =
                                                                normalizeValue(
                                                                    value,
                                                                    min,
                                                                    max,
                                                                    chartHeight
                                                                );

                                                            return (
                                                                <circle
                                                                    key={i}
                                                                    cx={x}
                                                                    cy={y}
                                                                    r={
                                                                        i ===
                                                                        stockData
                                                                            .values
                                                                            .length -
                                                                            1
                                                                            ? "4"
                                                                            : "3"
                                                                    }
                                                                    fill="white"
                                                                    stroke={
                                                                        chartColor
                                                                    }
                                                                    strokeWidth="2"
                                                                />
                                                            );
                                                        }
                                                    )}
                                                </svg>

                                                {/* X-axis labels with better spacing */}
                                                <div className="absolute bottom-[-24px] inset-x-0 flex justify-between text-xs text-muted-foreground">
                                                    <div>
                                                        {stockData.dates[0]}
                                                    </div>
                                                    {stockData.dates.length >
                                                        10 && (
                                                        <div>
                                                            {
                                                                stockData.dates[
                                                                    Math.floor(
                                                                        stockData
                                                                            .dates
                                                                            .length /
                                                                            4
                                                                    )
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                    <div>
                                                        {
                                                            stockData.dates[
                                                                Math.floor(
                                                                    stockData
                                                                        .dates
                                                                        .length /
                                                                        2
                                                                )
                                                            ]
                                                        }
                                                    </div>
                                                    {stockData.dates.length >
                                                        10 && (
                                                        <div>
                                                            {
                                                                stockData.dates[
                                                                    Math.floor(
                                                                        (stockData
                                                                            .dates
                                                                            .length *
                                                                            3) /
                                                                            4
                                                                    )
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                    <div>
                                                        {
                                                            stockData.dates[
                                                                stockData.dates
                                                                    .length - 1
                                                            ]
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StockMarketGraph;
