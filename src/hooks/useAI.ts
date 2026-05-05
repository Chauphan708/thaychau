import { useState, useCallback } from "react";
import type { LessonPlanInput, EmailDraftInput, StudentCommentInput, ChatMessage } from "@/services/geminiAI";
import {
  isGeminiConfigured,
  generateLessonPlan,
  summarizeDocument,
  draftEmail,
  suggestComment,
  chatWithAI,
  testGeminiConnection,
} from "@/services/geminiAI";

type AIFunction =
  | { fn: "lessonPlan"; params: LessonPlanInput }
  | { fn: "summarize"; params: { text: string } }
  | { fn: "email"; params: EmailDraftInput }
  | { fn: "comment"; params: StudentCommentInput }
  | { fn: "chat"; params: { messages: ChatMessage[]; context?: string } }
  | { fn: "test"; params?: undefined };

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const configured = isGeminiConfigured();

  const generate = useCallback(async (action: AIFunction): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let output: string;

      switch (action.fn) {
        case "lessonPlan":
          output = await generateLessonPlan(action.params);
          break;
        case "summarize":
          output = await summarizeDocument(action.params.text);
          break;
        case "email":
          output = await draftEmail(action.params);
          break;
        case "comment":
          output = await suggestComment(action.params);
          break;
        case "chat":
          output = await chatWithAI(action.params.messages, action.params.context);
          break;
        case "test": {
          const res = await testGeminiConnection();
          output = res.ok ? `✅ Kết nối thành công — ${res.model}` : `❌ ${res.error}`;
          break;
        }
        default:
          throw new Error("Unknown AI function");
      }

      setResult(output);
      return output;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { loading, error, result, configured, generate, reset };
}
