export interface CameraPermissionState {
    state: 'granted' | 'denied' | 'prompt';
    errorMessage?: string;
}

export interface ScanResult {
    id: string;
    itemName: string;
    category: string;
    pointsAwarded: number;
    environmentalImpact: string;
    decompositionTime: number;
    threatLevel: number;
}

export interface CameraErrorData {
    title: string;
    message: string;
    action?: string;
}