// src/pages/admin/AppearanceTab.tsx — Giao diện (Màu sắc, Dark Mode, Module hiển thị)
import { useSiteData } from "@/context/SiteContext";
import ColorPalette from "@/components/admin/ColorPalette";
import { Palette, LayoutTemplate, Moon } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function AppearanceTab() {
  const { config, setConfig } = useSiteData();

  const handleColorChange = (color: string) => {
    setConfig({ ...config, primaryColor: color });
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setConfig({ ...config, enableDarkMode: checked });
  };

  const handleTogglePage = (pageKey: keyof SiteConfig["pages"], checked: boolean) => {
    setConfig({
      ...config,
      pages: {
        ...config.pages,
        [pageKey]: checked,
      }
    });
  };

  const pageLabels: Record<keyof SiteConfig["pages"], string> = {
    home: "Trang chủ",
    profile: "Hồ sơ cá nhân",
    resources: "Kho học liệu",
    parents: "Góc phụ huynh",
    gallery: "Thư viện ảnh",
    tools: "Công cụ",
    blog: "Blog",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Palette style={{ width: 20, height: 20, color: "var(--color-primary)" }} />
          <h2 style={{ margin: 0, fontSize: 18, color: "var(--color-text)", fontWeight: 600 }}>Màu sắc chủ đạo</h2>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          Chọn màu sắc chính cho các nút bấm, icon và thành phần nổi bật trên website của bạn.
        </p>
        <ColorPalette value={config.primaryColor} onChange={handleColorChange} />
      </div>

      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Moon style={{ width: 20, height: 20, color: "var(--color-primary)" }} />
          <h2 style={{ margin: 0, fontSize: 18, color: "var(--color-text)", fontWeight: 600 }}>Giao diện tối (Dark Mode)</h2>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={config.enableDarkMode}
            onChange={(e) => handleToggleDarkMode(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "var(--color-primary)" }}
          />
          <span style={{ fontSize: 15, color: "var(--color-text)" }}>Cho phép người dùng chuyển đổi giao diện sáng/tối</span>
        </label>
      </div>

      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <LayoutTemplate style={{ width: 20, height: 20, color: "var(--color-primary)" }} />
          <h2 style={{ margin: 0, fontSize: 18, color: "var(--color-text)", fontWeight: 600 }}>Cấu trúc trang (Bật/tắt Module)</h2>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          Tuỳ chỉnh các module hiển thị trên thanh điều hướng chính của website.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {(Object.keys(config.pages) as Array<keyof SiteConfig["pages"]>).map((pageKey) => (
            <label key={pageKey} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)" }}>
              <input
                type="checkbox"
                checked={config.pages[pageKey]}
                onChange={(e) => handleTogglePage(pageKey, e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--color-primary)" }}
                disabled={pageKey === "home"} // Home is always enabled
              />
              <span style={{ fontSize: 15, color: "var(--color-text)" }}>
                {pageLabels[pageKey] || pageKey}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
