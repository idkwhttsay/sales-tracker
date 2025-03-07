'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">Sales Tracker</h1>
                    </div>
                    <div>
                        <span className="mr-4">Welcome, {user.username}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}