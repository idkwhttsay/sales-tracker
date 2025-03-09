// LoadingComponents.tsx
import React from 'react';

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

export const LoadingCard = ({ rows = 3 }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
        {Array(rows).fill(0).map((_, i) => (
            <div key={i} className="space-y-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, j) => (
                        <div key={j} className="h-20 bg-gray-100 rounded-md">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mx-3 mt-3"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mx-3 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export const LoadingCharts = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-6">
            {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-md w-28"></div>
            ))}
        </div>
        <div className="h-80 bg-gray-100 rounded-md"></div>
    </div>
);

export const LoadingTable = ({ rows = 5 }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/5 mb-3"></div>
        {Array(rows).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-md shadow mb-2">
                <div className="flex justify-between">
                    <div className="space-y-2 w-full">
                        <div className="flex items-center gap-2">
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-blue-100 rounded w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        ))}
    </div>
);

export const LoadingText = ({ text }: { text: string }) => (
    <div className="flex items-center space-x-2">
        <span>{text}</span>
        <div className="flex space-x-1">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
        </div>
    </div>
);