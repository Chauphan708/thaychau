// src/pages/admin/DashboardTab.tsx — Dashboard tổng quan với stats + quick actions
import { motion } from "framer-motion";
import {
  BookOpen, Star, Bell, ImageIcon, CalendarDays, Globe,
  Plus, ArrowUpRight, Database,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { useSiteData } from "@/context/SiteContext";

export default function DashboardTab() {
  const {
    resources, goldenFaces, announcements, gallery,
    parentNotices, customPages, weeklySchedule,
    config, isLoading,
  } = useSiteData();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "var(--color-text-secondary)" }}>
        Đang tải dữ liệu từ Supabase...
      </div>
    );
  }

  // Count active pages
  const activePageCount = Object.values(config.pages).filter(Boolean).length + customPages.filter((p) => p.visible).length;

  // Storage estimate
  const storageKB = Math.round(JSON.stringify({ resources, goldenFaces, announcements, gallery, parentNotices, weeklySchedule, config }).length / 1024);

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Học liệu" value={resources.length} icon={BookOpen} color="#2563eb" />
        <StatCard label="Gương mặt vàng" value={goldenFaces.length} icon={Star} color="#f59e0b" />
        <StatCard label="Thông báo" value={announcements.length + parentNotices.length} icon={Bell} color="#ef4444" />
        <StatCard label="Ảnh thư viện" value={gallery.length} icon={ImageIcon} color="#8b5cf6" />
        <StatCard label="Trang hiển thị" value={activePageCount} icon={Globe} color="#16a34a" />
        <StatCard label="Dung lượng" value={`${storageKB} KB`} icon={Database} color="#64748b" subtitle="Ước tính dữ liệu JSON" />
      </div>

      {/* Quick Actions */}
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
        ⚡ Thao tác nhanh
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Thêm Học liệu", icon: BookOpen, color: "#2563eb" },
          { label: "Thêm Thông báo", icon: Bell, color: "#ef4444" },
          { label: "Thêm Ảnh", icon: ImageIcon, color: "#8b5cf6" },
          { label: "Vinh danh HS", icon: Star, color: "#f59e0b" },
          { label: "Tạo Trang con", icon: Globe, color: "#16a34a" },
          { label: "Cập nhật TKB", icon: CalendarDays, color: "#0891b2" },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)", background: "var(--color-card)",
              cursor: "pointer", textAlign: "left", width: "100%",
              transition: "border-color 150ms ease",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "var(--radius-sm)",
              background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <action.icon style={{ width: 18, height: 18, color: action.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{action.label}</div>
            </div>
            <Plus style={{ width: 16, height: 16, color: "var(--color-text-secondary)" }} />
          </motion.button>
        ))}
      </div>

      {/* System Info */}
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
        ℹ️ Thông tin hệ thống
      </h3>
      <div style={{
        background: "var(--color-card)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)", padding: 20,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", fontSize: 13 }}>
          {[
            ["Giáo viên", config.teacherName],
            ["Trường", config.school],
            ["Màu chủ đạo", config.primaryColor],
            ["Dark Mode", config.enableDarkMode ? "Bật" : "Tắt"],
            ["Đếm ngược", config.countdown.enabled ? config.countdown.label : "Tắt"],
            ["Lưu trữ", "Supabase + localStorage"],
          ].map(([label, value]) => (
            <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--color-border)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, fontWeight: 600, color: "var(--color-primary)",
              textDecoration: "none",
            }}>
            Xem website <ArrowUpRight style={{ width: 12, height: 12 }} />
          </a>
        </div>
      </div>
    </div>
  );
}
