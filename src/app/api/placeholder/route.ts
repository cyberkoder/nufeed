import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const width = parseInt(searchParams.get("width") || "300");
    const height = parseInt(searchParams.get("height") || "200");
    const text = searchParams.get("text") || "Placeholder";
    const bgColor = searchParams.get("bg") || "e2e8f0";
    const textColor = searchParams.get("fg") || "64748b";

    // Create an SVG placeholder
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="20" 
        fill="#${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text.replace(/\+/g, " ")}
      </text>
    </svg>
  `;

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
