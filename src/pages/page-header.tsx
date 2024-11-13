import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    showHome?: boolean;
    backgroundColor?: string;
    textColor?: string;
    action?: React.ReactNode;
}

export function PageHeader({
                               title,
                               subtitle,
                               showBack = true,
                               showHome = false,
                               backgroundColor = 'bg-white',
                               textColor = 'text-blue-900',
                               action
                           }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className={`${backgroundColor} shadow-sm`}>
            <div className="pt-safe px-6 pb-4">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}

                    {showHome && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => navigate('/')}
                        >
                            <Home className="h-6 w-6" />
                        </Button>
                    )}

                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-2xl font-bold ${textColor}`}
                        >
                            {title}
                        </motion.h1>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={`${textColor.replace('900', '600')}`}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    {action && (
                        <div className="shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}