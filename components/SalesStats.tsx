import { SalesStatsProps } from '@/lib/types';

export default function SalesStats({ sales }: SalesStatsProps) {
    // Calculate statistics
    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.price, 0);
    const averageCheck = totalSales > 0 ? totalAmount / totalSales : 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-3">Today&#39;s Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
    );
}