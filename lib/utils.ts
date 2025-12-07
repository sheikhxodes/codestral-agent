import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }
export function formatDuration(ms: number): string { return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`; }
export function truncate(str: string, length: number): string { return str.length <= length ? str : str.slice(0, length) + '...'; }