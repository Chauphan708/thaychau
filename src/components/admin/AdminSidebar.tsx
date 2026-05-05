// src/components/admin/AdminSidebar.tsx — Sidebar navigation kiểu WordPress
import { motion } from "framer-motion";
import {
  Settings, Palette, LayoutDashboard, BookOpen, FileText, Mail,
  Users, Brain, User, Star, Bell, ImageIcon, CalendarDays, Globe,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminTab =
  | "dashboard" | "settings" | "appearance"
  | "profile" | "resources" | "golden-faces"
  | "announcements" | "gallery" | "parents" | "custom-pages"
  | "lesson-plan" | "documents" | "communication" | "students" | "ai-settings";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const adminNavigation: NavGroup[] = [
  {
    group: "Quản trị",
    items: [
      { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
      { id: "settings", label: "Cài đặt chung", icon: Settings },
      { id: "appearance", label: "Giao diện", icon: Palette },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { id: "profile", label: "Hồ sơ cá nhân", icon: User },
      { id: "resources", label: "Kho Học liệu", icon: BookOpen },
      { id: "golden-faces", label: "Gương mặt vàng", icon: Star },
      { id: "announcements", label: "Bảng tin", icon: Bell },
      { id: "gallery", label: "Thư viện ảnh", icon: ImageIcon },
      { id: "parents", label: "Góc Phụ huynh", icon: CalendarDays },
      { id: "custom-pages", label: "Trang con", icon: Globe },
    ],
  },
  {
    group: "AI Trợ lý",
    items: [
      { id: "lesson-plan", label: "Giáo án AI", icon: FileText },
      { id: "documents", label: "Văn bản", icon: FileText },
      { id: "communication", label: "Giao tiếp", icon: Mail },
      { id: "students", label: "Học sinh", icon: Users },
      { id: "ai-settings", label: "Cấu hình AI", icon: Brain },
    ],
  },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: AdminSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 250 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "var(--color-card)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "16px 14px" : "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "var(--radius-sm)", flexShrink: 0,
          background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap" }}>
            Admin Panel
          </span>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: "12px 8px" }}>
        {adminNavigation.map((group) => (
          <div key={group.group} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <p style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2,
                color: "var(--color-text-secondary)", padding: "0 12px", marginBottom: 6, margin: "0 0 6px",
              }}>
                {group.group}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: collapsed ? "10px 0" : "9px 12px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
                      background: isActive ? "var(--color-primary)" : "transparent",
                      color: isActive ? "#fff" : "var(--color-text-secondary)",
                      fontWeight: isActive ? 600 : 400, fontSize: 13,
                      transition: "all 150ms ease", width: "100%",
                    }}
                  >
                    <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                    {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "12px", borderTop: "1px solid var(--color-border)",
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--color-text-secondary)",
        }}
      >
        {collapsed ? <ChevronRight style={{ width: 18, height: 18 }} /> : <ChevronLeft style={{ width: 18, height: 18 }} />}
      </button>
    </motion.aside>
  );
}
