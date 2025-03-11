// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Only apply to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // Check for the Origin or Referer header
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');

        // Get host from request
        const host = request.headers.get('host');

        // List of allowed origins (your Vercel deployment URL and localhost for development)
        const allowedOrigins = [
            `https://${host}`,
            host?.includes('localhost') ? 'http://localhost:3000' : null
        ].filter(Boolean);

        // Check if the request is coming from an allowed origin
        const isAllowedOrigin = origin && allowedOrigins.some(allowed => origin === allowed);
        const isAllowedReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed as string));

        // If not from an allowed origin or referer, block the request
        if (!isAllowedOrigin && !isAllowedReferer) {
            return new NextResponse(
                JSON.stringify({ error: 'Access denied' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};