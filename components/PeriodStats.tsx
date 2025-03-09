'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale } from '@/lib/types';
import DateRangeSelector from './DateRangeSelector';
import SalesCharts from './SalesCharts';

interface PeriodStatsProps {
    maxDate: string;
    initialStartDate: string;
    initialEndDate: string;
}

export default function PeriodStats({
                                        maxDate,
                                        initialStartDate,
                                        initialEndDate
                                    }: PeriodStatsProps) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCharts, setShowCharts] = useState(true);

    const fetchSalesForPeriod = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            if (error) throw error;
            setSales(data as Sale[] || []);
        } catch (err) {
            console.error('Error fetching sales for period:', err);
            setError('Failed to load sales for the selected period. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesForPeriod();
    }, [startDate, endDate]);

    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Calculate statistics
    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.price, 0);
    const averageCheck = totalSales > 0 ? totalAmount / totalSales : 0;

    // Calculate min, max, and median values
    let minValue = 0;
    let maxValue = 0;
    let medianValue = 0;

    if (totalSales > 0) {
        // Get all prices
        const prices = sales.map(sale => sale.price);

        // Min and max values
        minValue = Math.min(...prices);
        maxValue = Math.max(...prices);

        // Calculate median value
        // Sort prices in ascending order
        const sortedPrices = [...prices].sort((a, b) => a - b);

        if (totalSales % 2 === 0) {
            // Even number of sales - median is average of two middle values
            const midIndex = totalSales / 2;
            medianValue = (sortedPrices[midIndex - 1] + sortedPrices[midIndex]) / 2;
        } else {
            // Odd number of sales - median is middle value
            const midIndex = Math.floor(totalSales / 2);
            medianValue = sortedPrices[midIndex];
        }
    }

    // Calculate sales by date (for potential chart usage)
    const salesByDate = sales.reduce((acc: Record<string, number>, sale) => {
        const date = sale.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += sale.price;
        return acc;
    }, {});

    // Format date range for display
    const formatDateDisplay = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Period Statistics</h2>
                <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                    maxDate={maxDate}
                />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading statistics...</div>
            ) : (
                <>
                    <div className="mb-4 p-3 bg-indigo-50 rounded-md">
                        <h3 className="text-lg font-medium text-indigo-800 mb-1">
                            {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                        </h3>
                        <p className="text-indigo-600">
                            {totalSales} {totalSales === 1 ? 'sale' : 'sales'} over {
                            Object.keys(salesByDate).length
                        } {Object.keys(salesByDate).length === 1 ? 'day' : 'days'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-md">
                            <div className="text-sm text-blue-600 font-medium">Total Sales</div>
                            <div className="text-2xl font-bold">{totalSales}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md">
                            <div className="text-sm text-green-600 font-medium">Total Amount</div>
                            <div className="text-2xl font-bold">₸{totalAmount.toFixed(2)}</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-md">
                            <div className="text-sm text-purple-600 font-medium">Average Check</div>
                            <div className="text-2xl font-bold">₸{averageCheck.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-red-50 p-3 rounded-md">
                            <div className="text-sm text-red-600 font-medium">Min Value</div>
                            <div className="text-2xl font-bold">₸{minValue.toFixed(2)}</div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md">
                            <div className="text-sm text-amber-600 font-medium">Median Value</div>
                            <div className="text-2xl font-bold">₸{medianValue.toFixed(2)}</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-md">
                            <div className="text-sm text-emerald-600 font-medium">Max Value</div>
                            <div className="text-2xl font-bold">₸{maxValue.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Toggle button for charts */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md font-medium"
                        >
                            {showCharts ? 'Hide Charts' : 'Show Charts'}
                        </button>
                    </div>

                    {/* Visualization section */}
                    {showCharts && <SalesCharts sales={sales} period={true} />}
                </>
            )}
        </div>
    );
}