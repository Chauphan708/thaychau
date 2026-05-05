// src/components/admin/EmptyState.tsx — Trạng thái trống khi chưa có dữ liệu
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "Chưa có dữ liệu",
  description = "Bấm nút bên dưới để thêm mục đầu tiên.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "var(--radius-full)",
          background: "var(--color-bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Inbox style={{ width: 28, height: 28, color: "var(--color-text-secondary)" }} />
      </div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>{title}</h3>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--color-text-secondary)", maxWidth: 300 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 20,
            padding: "10px 24px",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-primary)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            border: "none",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
