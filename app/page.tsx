'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SaleForm from '../components/SaleForm';
import DailySales from '../components/DailySales';
import Navbar from '../components/NavBar';
import { Sale } from '@/lib/types';

export default function Home() {
  const { user, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [keyPrefix, setKeyPrefix] = useState(Date.now().toString());

  useEffect(() => {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    setCurrentDate(today.toISOString().split('T')[0]);
  }, []);

  const handleSaleAdded = (sale: Sale) => {
    // Force refresh of sales list by updating the key
    setKeyPrefix(Date.now().toString());
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return null; // Will be redirected by middleware
  }

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