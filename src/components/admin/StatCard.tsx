// src/components/admin/StatCard.tsx — Thẻ thống kê cho Dashboard
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string; // hex color
  subtitle?: string;
}

export default function StatCard({ label, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 24, height: 24, color }} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--color-text)", fontFamily: "var(--font-heading)", lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginTop: 2 }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2, opacity: 0.7 }}>
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
}
