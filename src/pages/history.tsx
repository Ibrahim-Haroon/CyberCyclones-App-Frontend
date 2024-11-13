import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Timer,
    AlertCircle,
    Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api";
import axios from 'axios';
import {PageHeader} from "@/pages/page-header.tsx";

interface PointsHistoryEntry {
    period: string;
    points_earned: number;
    discoveries_count: number;
    average_points_per_discovery: number;
}

type TimeFrame = 'week' | 'month' | 'year';

function HistoryPage() {
    const navigate = useNavigate();
    const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('week');

    const { data: history, isLoading } = useQuery<PointsHistoryEntry[]>({
        queryKey: ['points-history', selectedTimeframe],
        queryFn: async () => {
            const response = await axios.get(
                getApiUrl(`/api/v1/points/history/?timeframe=${selectedTimeframe}`)
            );
            return response.data;
        }
    });

    const timeframeOptions = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' }
    ] as const;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <PageHeader
                title="History"
                subtitle="Your Ocean Impact"
                showBack
                showHome
            />
            {/* Header */}
            <div className="pt-safe px-6 pb-4 bg-white shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => navigate('/profile')}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Points History</h1>
                        <p className="text-blue-600">Track your ocean impact</p>
                    </div>
                </div>

                {/* Timeframe Selector */}
                <div className="flex gap-2">
                    {timeframeOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={selectedTimeframe === option.value ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setSelectedTimeframe(option.value)}
                        >
                            <Timer className="w-4 h-4 mr-2" />
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* History List */}
            <div className="px-6 py-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-24 bg-white rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : history && history.length > 0 ? (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {history.map((entry, index) => (
                                <motion.div
                                    key={entry.period}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl p-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <Search className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-blue-600">
                                                        {formatDate(entry.period)}
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {entry.discoveries_count} {entry.discoveries_count === 1 ? 'Discovery' : 'Discoveries'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">
                                                        +{entry.points_earned}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ~{Math.round(entry.average_points_per_discovery)} pts/discovery
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                        <p className="text-gray-600">No discoveries found for this timeframe</p>
                        <p className="text-sm text-gray-500 mt-2">Start scanning items to build your history!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryPage;