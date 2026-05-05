import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  titleAction?: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
  highlighted?: boolean;
}

const paddingMap = { sm: 16, md: 24, lg: 32 };

export default function Card({ children, title, titleIcon, titleAction, padding = "md", className, style, highlighted }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-card)",
        border: highlighted ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${paddingMap[padding] * 0.75}px ${paddingMap[padding]}px`,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text)",
              fontFamily: "var(--font-heading)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {titleIcon}
            {title}
          </h3>
          {titleAction}
        </div>
      )}
      <div style={{ padding: paddingMap[padding] }}>{children}</div>
    </div>
  );
}
