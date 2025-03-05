const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy endpoint for NewsAPI
app.get("/api/news", async (req, res) => {
    try {
        const { country, category, pageSize, page } = req.query;

        const response = await axios.get(
            "https://newsapi.org/v2/top-headlines",
            {
                params: {
                    country: country || "us",
                    category: category || "general",
                    pageSize: pageSize || 10,
                    page: page || 1,
                    apiKey: process.env.NEWS_API_KEY,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({
            error: "Failed to fetch news",
            message: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
