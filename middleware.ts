import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const { pathname } = request.nextUrl;

    // Check if the pathname is the login page
    if (pathname === '/login') {
        // If user is already logged in, redirect to home page
        if (request.cookies.has('user_logged_in')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // For all other routes, check if user is logged in
    if (!request.cookies.has('user_logged_in')) {
        // Redirect to login page if not logged in
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Specify the paths this middleware should run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};