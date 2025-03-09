'use client';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    // Check for session timeout
    useEffect(() => {
        const checkSession = () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) return;

            const loginTimestamp = localStorage.getItem('loginTimestamp');
            if (!loginTimestamp) return;

            // Session timeout after 8 hours (28800000 ms)
            const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;
            const now = Date.now();
            const sessionAge = now - parseInt(loginTimestamp);

            if (sessionAge > SESSION_TIMEOUT) {
                // Session expired
                handleLogout();
                alert('Your session has expired. Please log in again.');
            }
        };

        // Check on component mount
        checkSession();

        // Set up periodic checks (every 5 minutes)
        const interval = setInterval(checkSession, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [router]);

    const handleLogout = () => {
        // Remove logged in status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTimestamp');

        // Redirect to login page
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">Sales Tracker</h1>
                    </div>
                    <div>
                        <span className="mr-4">Welcome, Kamilla!</span>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            onClick={() => handleLogout()}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}