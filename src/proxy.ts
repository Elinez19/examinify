import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://backend.skilled4u.com",
  "https://skilled4u.com",
  "https://www.skilled4u.com",
  ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
]);

function isTrustedOrigin(origin: string): boolean {
  if (!origin) return false;
  return (
    ALLOWED_ORIGINS.has(origin) ||
    origin.startsWith("exp://") ||
    origin.startsWith("skilled4u://")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") || "";

  // 1. API CORS Handling (No wildcard '*' paired with Allow-Credentials)
  const isApiRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/v1") ||
    pathname.startsWith("/v1/");

  if (isApiRoute) {
    const trusted = isTrustedOrigin(origin);
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept",
      "Access-Control-Expose-Headers": "set-auth-token",
    };

    if (trusted) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
      corsHeaders["Access-Control-Allow-Credentials"] = "true";
      corsHeaders["Vary"] = "Origin";
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const response = NextResponse.next();
    for (const [k, v] of Object.entries(corsHeaders)) {
      response.headers.set(k, v);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/v1/:path*",
    "/v1/:path*",
  ],
};
