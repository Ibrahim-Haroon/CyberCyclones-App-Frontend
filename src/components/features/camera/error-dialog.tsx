import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button} from "@/components/ui/button.tsx";
import {CameraErrorData} from "@/components/features/camera/types.ts";

interface ErrorDialogProps {
    error: CameraErrorData | null;
    onDismiss: () => void;
}

export function ErrorDialog({ error, onDismiss }: ErrorDialogProps) {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl mx-4"
                >
                    <div className="flex flex-col items-center text-center gap-4">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center"
                        >
                            <AlertTriangle className="w-8 h-8 text-orange-500" />
                        </motion.div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {error.title}
                            </h3>
                            <p className="text-gray-600">
                                {error.message}
                            </p>
                        </div>

                        <Button
                            className="w-full rounded-full"
                            onClick={onDismiss}
                        >
                            {error.action || 'Try Again'}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}