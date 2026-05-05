// src/components/admin/AdminTopBar.tsx — Top bar: breadcrumb + actions
import { Save, RotateCcw, Download, Upload, ExternalLink } from "lucide-react";

interface AdminTopBarProps {
  title: string;
  onSave?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  saving?: boolean;
}

export default function AdminTopBar({ title, onSave, onReset, onExport, onImport, saving }: AdminTopBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-card)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
          {title}
        </h1>
      </div>

      {/* Right: action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onExport && (
          <button onClick={onExport} title="Xuất dữ liệu JSON" style={btnSecondary}>
            <Download style={iconSm} /> <span style={labelStyle}>Xuất</span>
          </button>
        )}
        {onImport && (
          <button onClick={onImport} title="Nhập dữ liệu JSON" style={btnSecondary}>
            <Upload style={iconSm} /> <span style={labelStyle}>Nhập</span>
          </button>
        )}
        {onReset && (
          <button onClick={onReset} title="Khôi phục mặc định" style={{ ...btnSecondary, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
            <RotateCcw style={iconSm} /> <span style={labelStyle}>Reset</span>
          </button>
        )}
        {onSave && (
          <button onClick={onSave} disabled={saving} style={btnPrimary}>
            <Save style={iconSm} /> {saving ? "Đang lưu..." : "Lưu"}
          </button>
        )}
        <a href="/" target="_blank" rel="noopener noreferrer" title="Xem website" style={{ ...btnSecondary, textDecoration: "none" }}>
          <ExternalLink style={iconSm} />
        </a>
      </div>
    </div>
  );
}

const iconSm: React.CSSProperties = { width: 14, height: 14 };
const labelStyle: React.CSSProperties = { fontSize: 12 };

const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "7px 14px", borderRadius: "var(--radius-sm)",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  transition: "all 150ms ease", whiteSpace: "nowrap",
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "var(--color-primary)", color: "#fff", border: "none",
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: "transparent", color: "var(--color-text-secondary)",
  border: "1px solid var(--color-border)",
};
