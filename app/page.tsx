'use client';

import { useState, useEffect } from 'react';
import SaleForm from '../components/SaleForm';
import DailySales from '../components/DailySales';
import Navbar from '../components/NavBar';
import { Sale } from '@/lib/types';
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState('');
    const [keyPrefix, setKeyPrefix] = useState(Date.now().toString());

    useEffect(() => {
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        setCurrentDate(today.toISOString().split('T')[0]);
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

  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <SaleForm onSaleAdded={handleSaleAdded} />

            {currentDate && (
                <DailySales
                    date={currentDate}
                    key={`${keyPrefix}-${currentDate}`}
                />
            )}
          </div>
        </main>
      </div>
  );
}