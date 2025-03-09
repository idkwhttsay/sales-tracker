// Now, let's update the Home component (page.tsx) to include our new period stats feature
'use client';

import { useState, useEffect } from 'react';
import SaleForm from '../components/SaleForm';
import DailySales from '../components/DailySales';
import PeriodStats from '../components/PeriodStats'; // Import the new component
import Navbar from '../components/NavBar';
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState('');
    const [viewDate, setViewDate] = useState('');
    const [keyPrefix, setKeyPrefix] = useState(Date.now().toString());
    const [showPeriodStats, setShowPeriodStats] = useState(false); // Toggle for period stats

    useEffect(() => {
        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
        setViewDate(today); // Initialize view date to today
    }, []);

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            router.push('/login');
        }
    }, [router]);

    const handleSaleAdded = () => {
        // Force refresh of sales list by updating the key
        setKeyPrefix(Date.now().toString());
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViewDate(e.target.value);
    };

    // Calculate default period (last 7 days)
    const getDefaultStartDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <SaleForm onSaleAdded={handleSaleAdded} />

                    {/* Toggle between daily view and period stats */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowPeriodStats(false)}
                                    className={`px-4 py-2 rounded-md ${
                                        !showPeriodStats
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Daily View
                                </button>
                                <button
                                    onClick={() => setShowPeriodStats(true)}
                                    className={`px-4 py-2 rounded-md ${
                                        showPeriodStats
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Period Stats
                                </button>
                            </div>

                            {!showPeriodStats && (
                                <div className="mt-2 sm:mt-0">
                                    <label htmlFor="viewDate" className="mr-2 text-sm font-medium text-gray-700">
                                        Select Date:
                                    </label>
                                    <input
                                        type="date"
                                        id="viewDate"
                                        value={viewDate}
                                        onChange={handleDateChange}
                                        max={currentDate}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {currentDate && (
                        <>
                            {showPeriodStats ? (
                                <PeriodStats
                                    maxDate={currentDate}
                                    initialStartDate={getDefaultStartDate()}
                                    initialEndDate={currentDate}
                                />
                            ) : (
                                <DailySales
                                    date={viewDate}
                                    key={`${keyPrefix}-${viewDate}`}
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}