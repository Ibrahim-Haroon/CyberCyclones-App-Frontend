import { motion } from 'framer-motion';
import { Camera, RotateCcw, X } from 'lucide-react';
import { Button} from "@/components/ui/button.tsx";

interface CameraControlsProps {
    onClose: () => void;
    onFlip: () => void;
    onCapture: () => void;
    isLoading: boolean;
    disabled: boolean;
}

export function CameraControls({
                                   onClose,
                                   onFlip,
                                   onCapture,
                                   isLoading,
                                   disabled
                               }: CameraControlsProps) {
    return (
        <>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 pt-[env(safe-area-inset-top,0px)] px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="h-16 flex justify-between items-center"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/20 text-white hover:bg-black/30 backdrop-blur-lg rounded-full"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/20 text-white hover:bg-black/30 backdrop-blur-lg rounded-full"
                        onClick={onFlip}
                    >
                        <RotateCcw className="w-6 h-6" />
                    </Button>
                </motion.div>
            </div>

            {/* Capture Button */}
            <div className="absolute bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom,24px)] px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="h-24 flex justify-center items-center"
                >
                    <Button
                        size="icon"
                        className={`w-20 h-20 rounded-full transition-all shadow-lg ${
                            isLoading
                                ? 'bg-blue-500 scale-95'
                                : 'bg-white scale-100 hover:scale-105'
                        }`}
                        onClick={onCapture}
                        disabled={disabled || isLoading}
                    >
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : {}}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Camera className={`w-8 h-8 ${
                                isLoading ? 'text-white' : 'text-blue-500'
                            }`} />
                        </motion.div>
                    </Button>
                </motion.div>
            </div>
        </>
    );
}
