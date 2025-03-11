// Modified route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Verify the custom header
        const appAuthHeader = request.headers.get('X-App-Auth');
        const xRequestedWith = request.headers.get('X-Requested-With');

        // Check for expected headers
        const validAppAuth = process.env.APP_AUTH_KEY || 'app-frontend';
        if (appAuthHeader !== validAppAuth || xRequestedWith !== 'XMLHttpRequest') {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 403 }
            );
        }

        const { username, password } = await request.json();

        // Rest of your authentication logic remains the same
        const validUsername = process.env.APP_USERNAME;
        const validPassword = process.env.APP_PASSWORD;

        if (!validUsername || !validPassword) {
            return NextResponse.json(
                { error: 'Authentication system is not properly configured' },
                { status: 500 }
            );
        }

        if (username === validUsername && password === validPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during authentication' },
            { status: 500 }
        );
    }
}