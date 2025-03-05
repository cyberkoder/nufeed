/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#007bff",
                secondary: "#f8f9fa",
                accent: "#0066cc",
                dark: {
                    100: "#1A1A1B",
                    200: "#272729",
                    300: "#3D3D3F",
                },
            },
            maxWidth: {
                "feed-slim": "650px",
                "feed-regular": "1000px",
            },
            boxShadow: {
                card: "0 4px 8px rgba(0, 0, 0, 0.1)",
                header: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
