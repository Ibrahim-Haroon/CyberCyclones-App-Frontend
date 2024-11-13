export interface Discovery {
    username: string;
    item: string;
    points: number;
    timestamp: string;
}

export interface Stats {
    itemsDiscovered: number;
    activeGuardians: number;
}