import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './alert';

const getCameraErrorMessage = (error: string) => {
    // Handle known error types
    if (error.includes("not recognized in our database")) {
        return "Oops! I don't know about this item yet. Try scanning something else!";
    }
    if (error.includes("Error processing image")) {
        return "I couldn't quite see that. Could you try again?";
    }
    if (error.includes("camera")) {
        return "We need camera access to help identify items. Please enable it in your settings!";
    }

    if (error.includes("You have already discovered")) {
        return "You've already discovered that item!"
    }
    // Default friendly message
    return "Something went wrong. Let's try that again!";
};

interface CameraErrorProps {
    error: string | null;
    onDismiss?: () => void;
}

export function CameraError({ error, onDismiss }: CameraErrorProps) {
    if (!error) return null;

    return (
        <div
            className="absolute top-20 left-4 right-4 z-10"
    onClick={onDismiss}
    >
    <Alert
        className="bg-white/90 backdrop-blur border-0 shadow-lg animate-in fade-in slide-in-from-top duration-300"
    variant="destructive"
    >
    <AlertTriangle className="h-5 w-5 text-orange-500" />
    <AlertDescription className="text-blue-900 pl-2">
        {getCameraErrorMessage(error)}
        </AlertDescription>
        </Alert>
        </div>
);
}