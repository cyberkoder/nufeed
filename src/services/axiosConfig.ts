import axios from "axios";
import { retry } from "../utils/networkUtils";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify config here (add auth headers, etc)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is a network error or 5xx error, and we haven't retried yet
        if (
            (error.code === "ERR_NETWORK" ||
                (error.response && error.response.status >= 500)) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Retry the request with exponential backoff
                return await retry(() => axios(originalRequest), 2);
            } catch (retryError) {
                return Promise.reject(retryError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
