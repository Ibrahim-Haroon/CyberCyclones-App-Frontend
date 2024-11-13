import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, User, ChevronRight, Users, Waves } from 'lucide-react';
import { getApiUrl, API_ROUTES } from "@/lib/api";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import {PageHeader} from "@/pages/page-header.tsx";

interface LeaderboardEntry {
    user_id: number;
    username: string;
    display_name: string | null;
    points: number;
    rank_title: string;
    discoveries_count: number;
}

interface PersonalRanking {
    rank: number;
    total_participants: number;
    points: number;
    rank_title: string;
}

type LeaderboardType = 'global' | 'weekly' | 'nearby';

export default function LeaderboardPage() {
    const [viewType, setViewType] = useState<LeaderboardType>('weekly');

    // Fetch leaderboard data
    const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery<LeaderboardEntry[]>({
        queryKey: ['leaderboard', viewType],
        queryFn: async () => {
            const response = await axios.get(
                getApiUrl(API_ROUTES.leaderboard[viewType === 'nearby' ? 'nearby' : viewType])
            );
            return response.data;
        }
    });

    // Fetch personal ranking
    const { data: personalRanking, isLoading: isPersonalRankingLoading } = useQuery<PersonalRanking>({
        queryKey: ['personal-ranking'],
        queryFn: async () => {
            const response = await axios.get(
                getApiUrl(API_ROUTES.leaderboard.my_ranking)
            );
            return response.data;
        }
    });

    const getRankIcon = (position: number) => {
        switch (position) {
            case 0:
                return (
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center"
                    >
                        <Trophy className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                );
            case 1:
                return (
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-gray-400" />
                    </div>
                );
            case 2:
                return (
                    <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-orange-400" />
                    </div>
                );
            default:
                return (
                    <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                        <Medal className="w-6 h-6 text-blue-500" />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-safe">
            <PageHeader
                title="Leaderboard"
                subtitle="Ocean Guardian Rankings"
                showBack
                showHome
            />
            {/* Header */}
            <motion.div
                className="pt-safe px-6 pb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Waves className="w-12 h-12 text-blue-500 mb-4" />
                <h1 className="text-2xl font-bold text-blue-900 mb-2">
                    Ocean Guardians
                </h1>
                <p className="text-blue-600">
                    {viewType === 'weekly' ? "This Week's Heroes" :
                        viewType === 'nearby' ? "Guardians Near Your Rank" :
                            "All-Time Champions"}
                </p>
            </motion.div>

            {/* View Type Selector */}
            <div className="px-6 pb-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    <Button
                        variant={viewType === 'weekly' ? 'default' : 'ghost'}
                        className="flex-1 rounded-lg"
                        onClick={() => setViewType('weekly')}
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        This Week
                    </Button>
                    <Button
                        variant={viewType === 'global' ? 'default' : 'ghost'}
                        className="flex-1 rounded-lg"
                        onClick={() => setViewType('global')}
                    >
                        <Medal className="w-4 h-4 mr-2" />
                        All Time
                    </Button>
                    <Button
                        variant={viewType === 'nearby' ? 'default' : 'ghost'}
                        className="flex-1 rounded-lg"
                        onClick={() => setViewType('nearby')}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Near You
                    </Button>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="px-6">
                {isLeaderboardLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white h-20 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {leaderboardData?.map((entry, index) => (
                                <motion.div
                                    key={entry.user_id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-2xl p-4 shadow-sm ${
                                        index < 3 && viewType !== 'nearby' ? 'border-2 border-blue-100' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {getRankIcon(index)}
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {entry.display_name || entry.username}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-blue-600">
                                                        {entry.rank_title}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <p className="font-bold text-blue-900">
                                                    {entry.points?.toLocaleString() ?? 0}
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                    {entry.discoveries_count ?? 0} finds
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Personal Ranking Card */}
            {!isPersonalRankingLoading && personalRanking && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-3xl pb-safe"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-600">Your Ranking</p>
                                    <p className="font-semibold text-gray-900">
                                        #{personalRanking.rank} of {personalRanking.total_participants}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-blue-600">Total Points</p>
                                <p className="font-bold text-blue-900">
                                    {personalRanking.points?.toLocaleString() ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}