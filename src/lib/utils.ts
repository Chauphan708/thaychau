import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**  Obfuscate email — chống bot crawl */
export function obfuscateEmail(email: string): string {
  return email.replace("@", " [at] ").replace(/\./g, " [dot] ");
}

/** Decode obfuscated email back to real mailto */
export function decodeEmail(obfuscated: string): string {
  return obfuscated.replace(" [at] ", "@").replace(/ \[dot\] /g, ".");
}

/** Tính số ngày còn lại đến targetDate */
export function daysUntil(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Input sanitization — chống XSS */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 1000);
}
