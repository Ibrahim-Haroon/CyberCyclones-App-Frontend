import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getApiUrl, API_ROUTES } from "@/lib/api";
import axios from 'axios';
import {PageHeader} from "@/pages/page-header.tsx";

interface CameraErrorData {
    title: string;
    message: string;
    action?: string;
}

interface ScanResponse {
    item_name: string;
    category: string;
    points_awarded: number;
    environmental_impact: string;
    decomposition_time: number;
    threat_level: number;
}

export default function CameraPage() {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<CameraErrorData | null>(null);
    const [useFrontCamera, setUseFrontCamera] = useState(false);
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [isFrozen, setIsFrozen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showGuidance, setShowGuidance] = useState(true);

    const parseErrorMessage = useCallback((error: string): CameraErrorData => {
        if (error.includes("not recognized in our database")) {
            const match = error.match(/Item '(.+)' not recognized/);
            const itemName = match?.[1] || "this item";
            return {
                title: `Hmm, I Don't Know That One Yet!`,
                message: `I haven't learned about ${itemName.toLowerCase()} yet. Let's try something else!`,
                action: 'Try Another Item'
            };
        }
        if (error.includes("You have already discovered")) {
            return {
                title: "Already Discovered!",
                message: "You've already found this item. Try finding something new!",
                action: 'Find Something New'
            };
        }
        return {
            title: "Oops, Let's Try Again!",
            message: "I couldn't see that clearly. Can you help me get a better look?",
            action: 'Try Again'
        };
    }, []);

    const stopCurrentStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            stopCurrentStream();
            setError(null);
            setIsFrozen(false);
            setCapturedImage(null);

            const constraints = {
                video: {
                    facingMode: useFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setPermissionState('granted');
            setShowGuidance(true);
        } catch (err) {
            console.error('Error accessing camera:', err);
            setPermissionState('denied');
            setError({
                title: 'Camera Access Needed',
                message: 'Hey Ocean Guardian! I need your camera to help identify items! 🌊',
                action: 'Enable Camera'
            });
            stopCurrentStream();
        }
    }, [useFrontCamera, stopCurrentStream]);

    useEffect(() => {
        startCamera();
        return stopCurrentStream;
    }, [startCamera, stopCurrentStream]);

    const captureImage = async () => {
        if (!videoRef.current || permissionState !== 'granted') return;

        setIsLoading(true);
        setError(null);
        setIsFrozen(true);
        setShowGuidance(false);

        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not create image');

            if (useFrontCamera) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Failed to create image blob'));
                    },
                    'image/jpeg',
                    0.8
                );
            });

            const formData = new FormData();
            formData.append('image', blob, 'discovery.jpg');

            const response = await axios.post<ScanResponse>(
                getApiUrl(API_ROUTES.discoveries.scan),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            navigate('/scan-result', { state: response.data });
        } catch (error) {
            let errorMessage = 'Could not process the image. Please try again.';

            if (axios.isAxiosError(error) && error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            setError(parseErrorMessage(errorMessage));
            setIsFrozen(false);
            setCapturedImage(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        startCamera();
    };

    if (permissionState === 'denied') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
                <motion.div
                    className="w-24 h-24 mb-6 text-blue-500"
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Camera className="w-full h-full" />
                </motion.div>
                <h2 className="text-2xl font-bold text-blue-900 mb-3 text-center">
                    Camera Access Needed
                </h2>
                <p className="text-blue-600 text-center mb-8 max-w-xs">
                    Hey Ocean Guardian! I need your camera to help identify items! 🌊
                </p>
                <Button
                    onClick={handleRetry}
                    size="lg"
                    className="rounded-full px-8 gap-2"
                >
                    <Camera className="w-5 h-5" />
                    Enable Camera
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black">
            <PageHeader
                title="Camera"
                subtitle="Your Ocean Impact"
                showBack
                showHome
            />
            {/* Camera Feed */}
            <div className="relative h-full w-full">
                {capturedImage ? (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className={`h-full w-full object-cover ${
                            isFrozen ? 'brightness-50' : ''
                        }`}
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`h-full w-full object-cover ${
                            useFrontCamera ? 'scale-x-[-1]' : ''
                        } ${isFrozen ? 'brightness-50' : ''}`}
                    />
                )}

                {/* Scanner Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 relative">
                        <motion.div
                            animate={{
                                y: [0, 256, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        />
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
                        </div>
                    </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top Controls */}
                    <div className="flex justify-between items-start p-4 pt-safe">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto h-12 w-12"
                            onClick={() => navigate('/')}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto h-12 w-12"
                            onClick={() => setUseFrontCamera(!useFrontCamera)}
                        >
                            <RotateCcw className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Center Guidance Text */}
                    <AnimatePresence>
                        {showGuidance && !isFrozen && !capturedImage && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                <div className="text-white text-lg font-medium px-6 py-3 bg-black/30 rounded-full backdrop-blur-sm flex items-center gap-2">
                                    <Camera className="w-5 h-5" />
                                    <span>Point at any item to scan</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Capture Button */}
                    <div className="absolute bottom-0 inset-x-0 pb-safe">
                        <div className="flex justify-center items-center p-4 pointer-events-auto">
                            <Button
                                size="icon"
                                className={`w-18 h-18 rounded-full shadow-lg transition-all duration-200 ${
                                    isLoading
                                        ? 'bg-blue-500 scale-95'
                                        : 'bg-white hover:bg-gray-100 scale-100 hover:scale-105'
                                }`}
                                onClick={captureImage}
                                disabled={isLoading || permissionState !== 'granted'}
                            >
                                <motion.div
                                    animate={isLoading ? { rotate: 360 } : {}}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Camera className={`h-8 w-8 ${
                                        isLoading ? 'text-white' : 'text-blue-500'
                                    }`} />
                                </motion.div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Error Dialog */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {error.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {error.message}
                                </p>
                                <Button
                                    className="w-full rounded-full"
                                    onClick={handleRetry}
                                >
                                    {error.action || 'Try Again'}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}