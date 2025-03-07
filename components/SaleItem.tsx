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
            <div>
                <div className="font-medium">₸{sale.price.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{sale.comment || 'No comment'}</div>
                <div className="text-xs text-gray-500">
                    {new Date(sale.created_at).toLocaleTimeString()}
                </div>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
}