import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and twMerge to properly handle Tailwind class conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}