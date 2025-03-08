'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SaleFormProps, Sale } from '@/lib/types';

export default function SaleForm({ onSaleAdded }: SaleFormProps) {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const [price, setPrice] = useState('');
    const [comment, setComment] = useState('');
    const [orderId, setOrderId] = useState('');
    const [date, setDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const saleData = {
                price: parseFloat(price),
                comment,
                order_id: orderId,
                date,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('sales')
                .insert([saleData])
                .select();

            if (error) throw error;

            // Reset form
            setPrice('');
            setComment('');
            setOrderId('');
            setDate(today); // Reset date to today

            // Notify parent component about the new sale
            if (onSaleAdded && data) {
                onSaleAdded(data[0] as Sale);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to add sale. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Sale</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                            Order ID
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Order ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₸)
                        </label>
                        <input
                            type="number"
                            id="price"
                            min="0.01"
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Comment
                        </label>
                        <input
                            type="text"
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Sale description"
                        />
                    </div>

                    <div>
                        <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Sale Date
                        </label>
                        <input
                            type="date"
                            id="saleDate"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Sale'}
                    </button>
                </div>
            </form>
        </div>
    );
}