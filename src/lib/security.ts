// src/lib/security.ts — Các hàm bảo mật cho website

import DOMPurify from "dompurify";

/** Sanitize HTML content — chống XSS injection */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p"],
    ALLOWED_ATTR: [],
  });
}

/** Rate limiter đơn giản — giới hạn số lần thực hiện hành động */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 3,
  windowMs: number = 60_000,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxAttempts) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}

/** Kiểm tra honeypot — nếu field ẩn có giá trị → spam bot */
export function isHoneypotTriggered(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Safe external link attributes */
export const safeExternalLinkProps = {
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
};

// ============================================================
// AI & File Security Utils
// ============================================================

/** Validate file upload — kiểm tra size + type trước khi upload */
export function validateFileUpload(
  file: File,
  options: { maxSizeMB: number; allowedExtensions: string[] },
): { valid: boolean; error?: string } {
  const maxBytes = options.maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File quá lớn. Tối đa ${options.maxSizeMB}MB, file hiện tại ${(file.size / 1024 / 1024).toFixed(1)}MB.` };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!options.allowedExtensions.includes(ext)) {
    return { valid: false, error: `Định dạng không hỗ trợ (.${ext}). Chỉ chấp nhận: ${options.allowedExtensions.join(", ")}` };
  }

  return { valid: true };
}

/** Mã hóa API key cho localStorage (base64 — obfuscation, không phải encryption thực sự) */
export function encodeApiKey(key: string): string {
  try {
    return btoa(key);
  } catch {
    return key;
  }
}

/** Giải mã API key từ localStorage */
export function decodeApiKey(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded;
  }
}

/** Validate format Gemini API key */
export function isValidGeminiKey(key: string): boolean {
  // Gemini keys thường bắt đầu bằng AIza và dài ~39 ký tự
  return /^AIza[A-Za-z0-9_-]{30,}$/.test(key.trim());
}

/** Sanitize AI prompt — chống prompt injection cơ bản */
export function sanitizeAIPrompt(input: string): string {
  return input
    .replace(/```/g, "")           // remove code fences
    .replace(/\\/g, "")            // remove backslashes
    .trim()
    .slice(0, 10_000);             // limit length
}

/** Rate limit cho AI calls — 10 requests per minute */
export function checkAIRateLimit(): boolean {
  return checkRateLimit("ai-calls", 10, 60_000);
}
