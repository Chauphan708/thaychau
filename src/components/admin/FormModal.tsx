// src/components/admin/FormModal.tsx — Modal form thêm/sửa dữ liệu
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface FormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "date" | "toggle" | "emoji" | "url" | "email" | "tel";
  placeholder?: string;
  options?: { value: string; label: string }[]; // for select
  required?: boolean;
  min?: number;
  max?: number;
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FormField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
}

export default function FormModal({ open, title, fields, values, onChange, onSave, onCancel, saveLabel = "Lưu" }: FormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--color-card)", borderRadius: "var(--radius-lg)", maxWidth: 560, width: "100%", maxHeight: "85vh", overflow: "auto", border: "1px solid var(--color-border)" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{title}</h3>
              <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Fields */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map((f) => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {f.label}{f.required && <span style={{ color: "#ef4444" }}> *</span>}
                  </label>

                  {f.type === "textarea" ? (
                    <textarea
                      value={(values[f.key] as string) ?? ""}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ ...inputStyle, height: 80, resize: "vertical" }}
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={(values[f.key] as string) ?? ""}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">— Chọn —</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : f.type === "toggle" ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!values[f.key]}
                        onChange={(e) => onChange(f.key, e.target.checked)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 13, color: "var(--color-text)" }}>{values[f.key] ? "Bật" : "Tắt"}</span>
                    </label>
                  ) : f.type === "number" ? (
                    <input
                      type="number"
                      value={(values[f.key] as number) ?? 0}
                      onChange={(e) => onChange(f.key, Number(e.target.value))}
                      min={f.min}
                      max={f.max}
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type={f.type === "url" ? "url" : f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.type === "date" ? "date" : "text"}
                      value={(values[f.key] as string) ?? ""}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}>
              <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Huỷ</button>
              <button onClick={onSave} style={{ padding: "8px 24px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{saveLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
  color: "var(--color-text)", fontSize: 13, outline: "none",
  fontFamily: "inherit",
};
