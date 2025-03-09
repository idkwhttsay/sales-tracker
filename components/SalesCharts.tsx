'use client';

import { useState } from 'react';
import { Sale } from '@/lib/types';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface SalesChartsProps {
    sales: Sale[];
    period?: boolean;
}

export default function SalesCharts({ sales }: SalesChartsProps) {
    const [activeChart, setActiveChart] = useState<'trend' | 'distribution' | 'hourly'>('trend');

    // No data case
    if (sales.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center py-12">
                <h3 className="text-lg font-medium text-gray-500">No data available for visualization</h3>
            </div>
        );
    }

    // Prepare data for trend chart (sales over time)
    const prepareTrendData = () => {
        const salesByDate = sales.reduce((acc: Record<string, {date: string, total: number, count: number}>, sale) => {
            const date = sale.date;
            if (!acc[date]) {
                acc[date] = { date, total: 0, count: 0 };
            }
            acc[date].total += sale.price;
            acc[date].count += 1;
            return acc;
        }, {});

        return Object.values(salesByDate)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(item => ({
                date: new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC'
                }),
                total: parseFloat(item.total.toFixed(2)),
                count: item.count,
                average: parseFloat((item.total / item.count).toFixed(2))
            }));
    };

    // Prepare data for distribution chart (frequency of sale amounts)
    const prepareDistributionData = () => {
        // Create price ranges
        const priceRanges: Record<string, { range: string, count: number, total: number }> = {};

        // Find min and max price to create appropriate ranges
        const prices = sales.map(sale => sale.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Create dynamic ranges based on data
        const rangeSize = Math.max(1000, Math.ceil((maxPrice - minPrice) / 5 / 1000) * 1000);

        sales.forEach(sale => {
            const rangeStart = Math.floor(sale.price / rangeSize) * rangeSize;
            const rangeEnd = rangeStart + rangeSize;
            const rangeKey = `${rangeStart}-${rangeEnd}`;

            if (!priceRanges[rangeKey]) {
                priceRanges[rangeKey] = {
                    range: `₸${rangeStart.toLocaleString()}-${rangeEnd.toLocaleString()}`,
                    count: 0,
                    total: 0
                };
            }

            priceRanges[rangeKey].count += 1;
            priceRanges[rangeKey].total += sale.price;
        });

        return Object.values(priceRanges).sort((a, b) => {
            const aStart = parseInt(a.range.split('-')[0].replace('₸', '').replace(/,/g, ''));
            const bStart = parseInt(b.range.split('-')[0].replace('₸', '').replace(/,/g, ''));
            return aStart - bStart;
        });
    };

    // Prepare data for hourly distribution (if timestamps are available)
    const prepareHourlyData = () => {
        const hourlyData = Array(24).fill(0).map((_, i) => ({
            hour: i,
            sales: 0,
            total: 0,
            label: `${i}:00`
        }));

        sales.forEach(sale => {
            if (sale.created_at) {
                const hour = new Date(sale.created_at).getHours();
                hourlyData[hour].sales += 1;
                hourlyData[hour].total += sale.price;
            }
        });

        return hourlyData;
    };

    // Prepare color data for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const trendData = prepareTrendData();
    const distributionData = prepareDistributionData();
    const hourlyData = prepareHourlyData();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Sales Visualization</h2>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveChart('trend')}
                    className={`px-4 py-2 rounded-md ${
                        activeChart === 'trend'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Sales Trend
                </button>
                <button
                    onClick={() => setActiveChart('distribution')}
                    className={`px-4 py-2 rounded-md ${
                        activeChart === 'distribution'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Price Distribution
                </button>
                <button
                    onClick={() => setActiveChart('hourly')}
                    className={`px-4 py-2 rounded-md ${
                        activeChart === 'hourly'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Hourly Sales
                </button>
            </div>

            <div className="h-80">
                {activeChart === 'trend' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={trendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip formatter={(value, name) => [name === 'Number of Sales' ? value : `₸${value}`, name === 'Number of Sales' ? 'Number of Sales' : 'Total Amount']} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="total"
                                name="Total Sales (₸)"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="count"
                                name="Number of Sales"
                                stroke="#82ca9d"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {activeChart === 'distribution' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={distributionData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip formatter={(value, name) => [name === 'Number of Sales' ? value : `₸${value}`, name === 'Number of Sales' ? 'Number of Sales' : 'Total Amount']} />
                                <Legend />
                                <Bar dataKey="count" name="Number of Sales" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="range"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} sales`, 'Count']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {activeChart === 'hourly' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={hourlyData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip formatter={(value, name) => [name === 'Number of Sales' ? value : `₸${value}`, name === 'Number of Sales' ? 'Number of Sales' : 'Total Amount']} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="sales" name="Number of Sales" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="total" name="Total Amount (₸)" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}