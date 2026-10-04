import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Edge Middleware
 * Responsibilities:
 *  1. Inject security headers on every response.
 *  2. Attach a short unique request-ID for tracing in logs.
 *
 * Rate-limiting is handled per-route inside src/server/http/rate-limit.ts
 * because Edge Middleware cannot import Node-specific modules.
 */

const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Disable MIME sniffing
  "X-Content-Type-Options": "nosniff",
  // Modern referrer policy — don't leak path on cross-origin navigations
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Restrict browser features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // Content Security Policy
  // Allows self + data URIs for images (QR code uses data:image/png)
  // Allows inline scripts/styles only for Next.js internal hydration
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev HMR
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  const response = NextResponse.next({
    headers: {
      "X-Request-Id": requestId,
    },
  });

  // Attach security headers to every response
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  // Run middleware on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.webmanifest).*)",
  ],
};
