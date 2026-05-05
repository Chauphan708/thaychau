// src/services/geminiAI.ts — Gemini AI Service (mock-first, real API ready)

import { sanitizeAIPrompt, decodeApiKey, encodeApiKey, checkAIRateLimit } from "@/lib/security";

// ============================================================
// Types
// ============================================================

export interface LessonPlanInput {
  subject: string;
  grade: number;
  title: string;
  periods: number;
  layout: "1col" | "2col" | "3col";
  extraNotes?: string;
}

export interface EmailDraftInput {
  studentName: string;
  parentName: string;
  context: string;
  tone: "friendly" | "formal";
}

export interface StudentCommentInput {
  studentName: string;
  grades: Record<string, string>;
  behavior: string;
  tone: "friendly" | "formal";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ============================================================
// API Key Management
// ============================================================

const STORAGE_KEY = "gemini_api_key";

export function getGeminiApiKey(): string | null {
  try {
    const encoded = localStorage.getItem(STORAGE_KEY);
    return encoded ? decodeApiKey(encoded) : null;
  } catch {
    return null;
  }
}

export function saveGeminiApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, encodeApiKey(key));
}

export function clearGeminiApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isGeminiConfigured(): boolean {
  return !!getGeminiApiKey();
}

// ============================================================
// Core API Call
// ============================================================

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error("Chưa cấu hình Gemini API Key. Vui lòng nhập key trong Cấu hình AI.");

  if (!checkAIRateLimit()) throw new Error("Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi 1 phút.");

  const safePrompt = sanitizeAIPrompt(prompt);

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: safePrompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ============================================================
// AI Functions
// ============================================================

const SYSTEM_TEACHER_VN = `Bạn là trợ lý AI cho giáo viên tiểu học Việt Nam. 
Hãy trả lời bằng tiếng Việt, tuân chuẩn giáo dục VN (Thông tư 27/2020, Công văn 2345/BGDĐT).
Giọng văn chuyên nghiệp nhưng gần gũi.`;

export async function generateLessonPlan(params: LessonPlanInput): Promise<string> {
  const layoutGuide =
    params.layout === "1col"
      ? "Trình bày 1 cột liên tục."
      : params.layout === "2col"
        ? "Trình bày 2 cột: Cột trái — Hoạt động của GV, Cột phải — Hoạt động của HS."
        : "Trình bày 3 cột: Nội dung — Hoạt động GV — Hoạt động HS.";

  const prompt = `Soạn kế hoạch bài dạy (giáo án) theo Công văn 2345/BGDĐT:
- Môn: ${params.subject}
- Lớp: ${params.grade}
- Tên bài: ${params.title}
- Số tiết: ${params.periods}
- ${layoutGuide}
${params.extraNotes ? `- Ghi chú thêm: ${params.extraNotes}` : ""}

Bao gồm: I. Yêu cầu cần đạt, II. Đồ dùng dạy học, III. Các hoạt động dạy học chủ yếu (Khởi động, Khám phá, Luyện tập, Vận dụng), IV. Điều chỉnh sau bài dạy.`;

  return callGemini(prompt, SYSTEM_TEACHER_VN);
}

export async function summarizeDocument(text: string): Promise<string> {
  const prompt = `Tóm tắt nội dung văn bản/công văn sau dưới 200 từ, nêu rõ các điểm chính cần lưu ý cho giáo viên:\n\n${text}`;
  return callGemini(prompt, SYSTEM_TEACHER_VN);
}

export async function draftEmail(params: EmailDraftInput): Promise<string> {
  const prompt = `Soạn email gửi cho phụ huynh:
- Học sinh: ${params.studentName}
- Phụ huynh: ${params.parentName}
- Nội dung/hoàn cảnh: ${params.context}
- Giọng văn: ${params.tone === "friendly" ? "gần gũi, thân thiện" : "trang trọng, lịch sự"}

Yêu cầu: Có lời chào, nội dung chính, lời kết.`;

  return callGemini(prompt, SYSTEM_TEACHER_VN);
}

export async function suggestComment(params: StudentCommentInput): Promise<string> {
  const gradesStr = Object.entries(params.grades)
    .map(([subject, grade]) => `${subject}: ${grade}`)
    .join(", ");

  const prompt = `Viết nhận xét cho học sinh tiểu học theo Thông tư 27/2020/TT-BGDĐT:
- Tên: ${params.studentName}
- Kết quả học tập: ${gradesStr}
- Hạnh kiểm/Biểu hiện: ${params.behavior}
- Giọng văn: ${params.tone === "friendly" ? "ấm áp, động viên" : "trang trọng, khách quan"}

Nhận xét gồm: Phẩm chất, Năng lực, Các môn học, Khen/Nhắc nhở.`;

  return callGemini(prompt, SYSTEM_TEACHER_VN);
}

export async function chatWithAI(messages: ChatMessage[], context?: string): Promise<string> {
  const contextNote = context ? `\nBối cảnh hiện tại: ${context}` : "";
  const lastMessage = messages[messages.length - 1]?.content ?? "";

  const prompt = `${contextNote}\n\nCâu hỏi/Yêu cầu của giáo viên: ${lastMessage}`;
  return callGemini(prompt, SYSTEM_TEACHER_VN);
}

// ============================================================
// Test connection
// ============================================================

export async function testGeminiConnection(): Promise<{ ok: boolean; model?: string; error?: string }> {
  try {
    await callGemini("Xin chào! Trả lời ngắn gọn 1 câu bạn là ai.");
    return { ok: true, model: "Gemini 2.5 Flash", error: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Lỗi không xác định" };
  }
}
