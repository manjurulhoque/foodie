import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function extractMessage(response: any): string {
    if (!response.success && response.errors && response.errors.length > 0) {
        return response.errors[0].message;
    }
    return response.message;
}

export function extractErrors(response: any): string[] {
    if (!response.success && response.errors && response.errors.length > 0) {
        return response.errors.map((error: any) => error.message);
    }
    return [];
}