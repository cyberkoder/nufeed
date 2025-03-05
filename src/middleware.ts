import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Get the origin from the request headers
    const origin = request.headers.get("origin") || "";

    // Only run this middleware for API routes
    if (request.nextUrl.pathname.startsWith("/api/")) {
        // Clone the response and add CORS headers
        const response = NextResponse.next();

        // Set CORS headers - you can make these more restrictive in production
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, DELETE"
        );
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return response;
    }

    return NextResponse.next();
}

// Configure the middleware to run on API routes
export const config = {
    matcher: "/api/:path*",
};
