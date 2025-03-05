/**
 * Network utilities to help with error recovery and status checking
 */

// Check if the user is currently online
export const isOnline = (): boolean => {
    return navigator.onLine;
};

// Create a ping function to test connectivity to your API
export const pingServer = async (
    url: string = "/api/ping"
): Promise<boolean> => {
    try {
        const response = await fetch(url, {
            method: "HEAD",
            cache: "no-store",
            mode: "no-cors", // This allows calling without CORS issues
            headers: {
                "Cache-Control": "no-cache",
            },
        });
        return true;
    } catch (error) {
        console.warn("Server ping failed:", error);
        return false;
    }
};

// Simple exponential backoff retry function
export const retry = async <T>(
    fn: () => Promise<T>,
    retriesLeft: number = 3,
    interval: number = 1000,
    exponential: boolean = true
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retriesLeft === 0) {
            throw error;
        }

        console.log(`Retrying... ${retriesLeft} attempts left`);

        // Wait for the specified interval
        await new Promise((resolve) => setTimeout(resolve, interval));

        // Exponential backoff
        const nextInterval = exponential ? interval * 2 : interval;

        // Recursive retry with one less retry left
        return retry(fn, retriesLeft - 1, nextInterval, exponential);
    }
};
