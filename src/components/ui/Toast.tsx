import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

export interface ToastItem {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  title?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: { icon: "var(--color-secondary)", border: "rgba(22,163,74,0.3)", bg: "rgba(22,163,74,0.08)" },
  error: { icon: "#ef4444", border: "rgba(239,68,68,0.3)", bg: "rgba(239,68,68,0.08)" },
  info: { icon: "var(--color-primary)", border: "rgba(37,99,235,0.3)", bg: "rgba(37,99,235,0.08)" },
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = iconMap[t.type];
          const colors = colorMap[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="alert"
              aria-live="assertive"
              style={{
                minWidth: 300,
                maxWidth: 420,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: 16,
                borderRadius: "var(--radius-md)",
                background: "var(--color-card)",
                border: `1px solid ${colors.border}`,
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Icon style={{ width: 20, height: 20, color: colors.icon, marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>
                    {t.title}
                  </h5>
                )}
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--color-text-secondary)",
                  flexShrink: 0,
                }}
                aria-label="Đóng thông báo"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
