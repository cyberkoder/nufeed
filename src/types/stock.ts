/**
 * Represents stock market data for display in charts and graphs
 */
export interface StockData {
    /**
     * Date/time labels for each data point
     */
    dates: string[];

    /**
     * Numerical values for the stock/market index
     */
    values: number[];

    /**
     * Price change information
     */
    change: {
        /**
         * Absolute value change
         */
        value: number;

        /**
         * Percentage change
         */
        percentage: number;
    };
}

/**
 * Represents an individual stock or index
 */
export interface StockItem {
    /**
     * Stock ticker symbol
     */
    symbol: string;

    /**
     * Company or index name
     */
    name: string;

    /**
     * Current price
     */
    price: number;

    /**
     * Daily percentage change
     */
    change: number;

    /**
     * Trading volume
     */
    volume?: number;
}
