// First, let's create a new component for the period selection
// DateRangeSelector.tsx
'use client';

import { useState } from 'react';

interface DateRangeSelectorProps {
    startDate: string;
    endDate: string;
    onDateRangeChange: (startDate: string, endDate: string) => void;
    maxDate: string;
}

export default function DateRangeSelector({
                                              startDate,
                                              endDate,
                                              onDateRangeChange,
                                              maxDate
                                          }: DateRangeSelectorProps) {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStart(newStartDate);

        // If start date is after end date, update end date
        if (newStartDate > end) {
            setEnd(newStartDate);
            onDateRangeChange(newStartDate, newStartDate);
        } else {
            onDateRangeChange(newStartDate, end);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setEnd(newEndDate);

        // If end date is before start date, update start date
        if (newEndDate < start) {
            setStart(newEndDate);
            onDateRangeChange(newEndDate, newEndDate);
        } else {
            onDateRangeChange(start, newEndDate);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    From:
                </label>
                <input
                    type="date"
                    id="startDate"
                    value={start}
                    onChange={handleStartDateChange}
                    max={maxDate}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    To:
                </label>
                <input
                    type="date"
                    id="endDate"
                    value={end}
                    onChange={handleEndDateChange}
                    max={maxDate}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
        </div>
    );
}