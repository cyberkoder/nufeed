import { Card, CardContent } from "@/components/ui/card";

interface MarketIndexProps {
    name: string;
    value: number;
    change: number;
}

export default function MarketOverview({
    indices,
}: {
    indices: MarketIndexProps[];
}) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Market Indices</h2>
            <div className="space-y-3">
                {indices.map((index) => (
                    <Card
                        key={index.name}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">{index.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    Last updated:{" "}
                                    {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">
                                    {index.value.toLocaleString()}
                                </p>
                                <p
                                    className={`text-sm font-medium ${
                                        index.change >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {index.change >= 0 ? "+" : ""}
                                    {index.change.toFixed(2)}%
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
