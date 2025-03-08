import { SalesStatsProps } from '@/lib/types';

export default function SalesStats({ sales }: SalesStatsProps) {
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

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-3">Today&#39;s Statistics</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
    );
}