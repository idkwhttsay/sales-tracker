'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SaleItemProps } from '@/lib/types';

export default function SaleItem({ sale, onSaleDeleted }: SaleItemProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this sale?')) {
            setDeleting(true);
            try {
                const { error } = await supabase
                    .from('sales')
                    .delete()
                    .eq('id', sale.id);

                if (error) throw error;

                onSaleDeleted(sale.id);
            } catch (err) {
                console.error('Error deleting sale:', err);
                alert('Failed to delete sale. Please try again.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-md shadow mb-2 flex justify-between items-center">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium">₸{sale.price.toFixed(2)}</div>
                    {sale.order_id && (
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Order: {sale.order_id}
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-600">{sale.comment || 'No comment'}</div>
                <div className="text-xs text-gray-500">
                    {new Date(sale.created_at).toLocaleTimeString()}
                </div>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 ml-4"
            >
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
}