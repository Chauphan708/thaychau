// src/components/admin/ColorPalette.tsx — Color palette selector component
import { Check } from "lucide-react";

interface ColorPaletteProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#dc2626", // Red
  "#ca8a04", // Yellow
  "#9333ea", // Purple
  "#db2777", // Pink
  "#0891b2", // Cyan
  "#ea580c", // Orange
  "#4f46e5", // Indigo
  "#1e293b", // Slate
];

export default function ColorPalette({ value, onChange }: ColorPaletteProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {PRESET_COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: color,
            border: value === color ? "3px solid var(--color-bg)" : "none",
            boxShadow: value === color ? `0 0 0 2px ${color}` : "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {value === color && <Check style={{ width: 20, height: 20, color: "#fff" }} />}
        </button>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }}
        />
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
          {value}
        </span>
      </div>
    </div>
  );
}
