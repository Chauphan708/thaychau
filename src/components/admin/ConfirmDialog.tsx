// src/components/admin/ConfirmDialog.tsx — Dialog xác nhận xoá
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title = "Xác nhận xoá", message = "Bạn có chắc muốn xoá mục này?", confirmLabel = "Xoá", onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--color-card)", borderRadius: "var(--radius-lg)", padding: 24, maxWidth: 400, width: "100%", border: "1px solid var(--color-border)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle style={{ width: 20, height: 20, color: "#ef4444" }} />
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>{title}</h3>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{message}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Huỷ</button>
              <button onClick={onConfirm} style={{ padding: "8px 20px", borderRadius: "var(--radius-sm)", border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
