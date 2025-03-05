/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // Don't need the external rewrites anymore since we're handling it through our API route
    // But we'll keep the headers configuration for CORS
    async headers() {
        return [
            {
                // Apply these headers to all API routes in your application
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-priority",
                    },
                ],
            },
        ];
    },

    // Add any other Next.js config options you need
};

module.exports = nextConfig;
