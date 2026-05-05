import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pill";
}

export default function TabGroup({ tabs, activeTab, onChange, variant = "underline" }: TabGroupProps) {
  if (variant === "pill") {
    return (
      <div style={{ display: "flex", gap: 4, background: "var(--color-bg-secondary)", padding: 4, borderRadius: "var(--radius-md)" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                background: isActive ? "var(--color-card)" : "transparent",
                color: isActive ? "var(--color-text)" : "var(--color-text-secondary)",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
                transition: "all var(--transition-fast)",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--color-border)" }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              border: "none",
              borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              background: isActive ? "var(--color-bg-secondary)" : "transparent",
              color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
              transition: "all var(--transition-fast)",
              marginBottom: -1,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
