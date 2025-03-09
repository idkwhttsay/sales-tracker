import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Use environment variables without NEXT_PUBLIC_ prefix
        // These will only be accessible on the server
        const validUsername = process.env.APP_USERNAME;
        const validPassword = process.env.APP_PASSWORD;

        if (!validUsername || !validPassword) {
            console.error('Authentication credentials not configured in environment variables');
            return NextResponse.json(
                { error: 'Authentication system is not properly configured' },
                { status: 500 }
            );
        }

        if (username === validUsername && password === validPassword) {
            // Don't include sensitive data in the response
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
