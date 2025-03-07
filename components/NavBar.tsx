'use client';
import {useRouter} from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        // Remove logged in status
        localStorage.removeItem('isLoggedIn');

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