import { StockData } from "@/types/finance";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function StockCard({ stock }: { stock: StockData }) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {stock.symbol}
                        </h3>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold">
                            ${stock.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-end">
                            {stock.change >= 0 ? (
                                <ArrowUpCircle className="text-green-600 mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownCircle className="text-red-600 mr-1 h-4 w-4" />
                            )}
                            <span
                                className={`${
                                    stock.change >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                } text-sm font-medium`}
                            >
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change}%
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xs text-gray-500">
                        Vol: {formatNumber(stock.volume)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
