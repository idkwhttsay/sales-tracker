'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale } from '@/lib/types';

interface ExportSalesDataProps {
    maxDate: string;
}

export default function ExportSalesData({ maxDate }: ExportSalesDataProps) {
    const [startDate, setStartDate] = useState(maxDate);
    const [endDate, setEndDate] = useState(maxDate);
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // If start date is after end date, update end date
        if (newStartDate > endDate) {
            setEndDate(newStartDate);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);

        // If end date is before start date, update start date
        if (newEndDate < startDate) {
            setStartDate(newEndDate);
        }
    };

    const generateExportText = (sales: Sale[]): string => {
        // Group sales by date
        const salesByDate: Record<string, Sale[]> = {};

        sales.forEach(sale => {
            if (!salesByDate[sale.date]) {
                salesByDate[sale.date] = [];
            }
            salesByDate[sale.date].push(sale);
        });

        // Generate text for each date
        let resultText = '';

        // Sort dates
        const sortedDates = Object.keys(salesByDate).sort();

        sortedDates.forEach(date => {
            resultText += `${date}\n`;

            // Add each sale in the required format
            salesByDate[date].forEach(sale => {
                const orderId = sale.order_id || '';
                const price = sale.price.toFixed(2);
                const comment = sale.comment || '';

                resultText += `${orderId}-${price}-${comment}\n`;
            });

            resultText += '\n';
        });

        return resultText;
    };

    const handleExport = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Create datetime strings for the query
            const startDateTime = `${startDate}T${startTime}:00`;
            const endDateTime = `${endDate}T${endTime}:59`;

            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .gte('created_at', startDateTime)
                .lte('created_at', endDateTime)
                .order('date', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                setError('No sales found for the selected period.');
                return;
            }

            const exportText = generateExportText(data as Sale[]);
            setGeneratedText(exportText);
            setSuccess(true);

        } catch (err) {
            console.error('Error exporting sales:', err);
            setError('Failed to export sales data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText)
            .then(() => {
                // Show temporary success message
                const successEl = document.getElementById('copy-success');
                if (successEl) {
                    successEl.classList.remove('opacity-0');
                    setTimeout(() => {
                        successEl.classList.add('opacity-0');
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                setError('Failed to copy to clipboard. Please try again.');
            });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Export Sales Data</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={maxDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time:
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={handleEndDateChange}
                            max={maxDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                            End Time:
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Export Data'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">Generated Export Data</h3>
                        <div className="flex items-center gap-2">
                            <span id="copy-success" className="text-green-600 text-sm transition-opacity duration-300 opacity-0">
                                Copied!
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Copy to Clipboard
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-64 font-mono text-sm whitespace-pre">
                        {generatedText}
                    </div>
                </div>
            )}
        </div>
    );
}