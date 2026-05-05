import { useState, useCallback, useRef } from "react";
import type { ToastItem } from "@/components/ui/Toast";

let nextId = 1;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastItem["type"], message: string, title?: string, durationMs = 5000) => {
      const id = nextId++;
      const toast: ToastItem = { id, type, message, title };
      setToasts((prev) => [...prev, toast]);
      const timer = setTimeout(() => removeToast(id), durationMs);
      timersRef.current.set(id, timer);
      return id;
    },
    [removeToast],
  );

  const success = useCallback(
    (message: string, title?: string) => showToast("success", message, title),
    [showToast],
  );

  const error = useCallback(
    (message: string, title?: string) => showToast("error", message, title),
    [showToast],
  );

  const info = useCallback(
    (message: string, title?: string) => showToast("info", message, title),
    [showToast],
  );

  return { toasts, removeToast, showToast, success, error, info };
}
