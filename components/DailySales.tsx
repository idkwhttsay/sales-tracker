'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import SaleItem from './SaleItem';
import SalesStats from './SalesStats';
import { DailySalesProps, Sale } from '@/lib/types';

export default function DailySales({ date }: DailySalesProps) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .eq('date', date)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSales(data as Sale[] || []);
        } catch (err) {
            console.error('Error fetching sales:', err);
            setError('Failed to load sales. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [date]);

    const handleSaleDeleted = (deletedId: string) => {
        setSales(sales.filter(sale => sale.id !== deletedId));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </h2>

            <SalesStats sales={sales} />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading sales...</div>
            ) : sales.length === 0 ? (
                <div className="text-center py-4 bg-white rounded-lg shadow-md">
                    No sales recorded for today.
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium mb-3">Sales List</h3>
                    {sales.map(sale => (
                        <SaleItem
                            key={sale.id}
                            sale={sale}
                            onSaleDeleted={handleSaleDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}