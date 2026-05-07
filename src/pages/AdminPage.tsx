// src/pages/AdminPage.tsx — Admin Shell: Sidebar + TopBar + Tab content
import React, { useState, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import type { AdminTab } from "@/components/admin/AdminSidebar";
import { useSiteData } from "@/context/SiteContext";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/Toast";
import { exportAllData, importAllData } from "@/services/cmsStore";

// Lazy-load all tabs
const DashboardTab = React.lazy(() => import("@/pages/admin/DashboardTab"));
const LessonPlanTab = React.lazy(() => import("@/pages/admin/LessonPlanTab"));
const DocumentsTab = React.lazy(() => import("@/pages/admin/DocumentsTab"));
const CommunicationTab = React.lazy(() => import("@/pages/admin/CommunicationTab"));
const StudentsTab = React.lazy(() => import("@/pages/admin/StudentsTab"));
const AISettingsTab = React.lazy(() => import("@/pages/admin/AISettingsTab"));
const SettingsTab = React.lazy(() => import("@/pages/admin/SettingsTab"));
const AppearanceTab = React.lazy(() => import("@/pages/admin/AppearanceTab"));
const ProfileTab = React.lazy(() => import("@/pages/admin/ProfileTab"));
const ResourcesTab = React.lazy(() => import("@/pages/admin/ResourcesTab"));
const GoldenFacesTab = React.lazy(() => import("@/pages/admin/GoldenFacesTab"));
const AnnouncementsTab = React.lazy(() => import("@/pages/admin/AnnouncementsTab"));
const GalleryTab = React.lazy(() => import("@/pages/admin/GalleryTab"));
const ParentsTab = React.lazy(() => import("@/pages/admin/ParentsTab"));
const CustomPagesTab = React.lazy(() => import("@/pages/admin/CustomPagesTab"));

// Tab title mapping
const tabTitles: Record<AdminTab, string> = {
  dashboard: "📊 Tổng quan",
  settings: "⚙️ Cài đặt chung",
  appearance: "🎨 Giao diện",
  profile: "👤 Hồ sơ cá nhân",
  resources: "📚 Kho Học liệu",
  "golden-faces": "🌟 Gương mặt vàng",
  announcements: "📢 Bảng tin",
  gallery: "🖼️ Thư viện ảnh",
  parents: "👨‍👩‍👧 Góc Phụ huynh",
  "custom-pages": "🌐 Trang con",
  "lesson-plan": "📝 Giáo án AI",
  documents: "📄 Văn bản",
  communication: "💬 Giao tiếp",
  students: "👦 Học sinh",
  "ai-settings": "🤖 Cấu hình AI",
};

function LoadingFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "var(--color-text-secondary)", fontSize: 13 }}>
      <span style={{ width: 20, height: 20, border: "2px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite", marginRight: 8 }} />
      Đang tải...
    </div>
  );
}


export default function AdminPage() {
  const { resetData } = useSiteData();
  const { toasts, removeToast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPin = import.meta.env.VITE_ADMIN_PIN;
    if (pin === adminPin) {
      setIsAuthenticated(true);
    } else {
      showToast("error", "Mã PIN không đúng!", "Lỗi đăng nhập");
    }
  };

  const handleExport = useCallback(async () => {
    try {
      const json = await exportAllData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `teacher-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("success", "Đã xuất dữ liệu thành công!", "Xuất dữ liệu");
    } catch {
      showToast("error", "Xuất dữ liệu thất bại.", "Lỗi");
    }
  }, [showToast]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = await importAllData(text);
      if (ok) {
        showToast("success", "Đã nhập dữ liệu thành công! Đang tải lại...", "Nhập dữ liệu");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast("error", "File JSON không hợp lệ.", "Lỗi");
      }
    };
    input.click();
  }, [showToast]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%", maxWidth: 400,
            background: "var(--color-card)", borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)", padding: 32,
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock style={{ width: 24, height: 24, color: "#fff" }} />
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>Khu vực Quản trị</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center" }}>Nhập mã PIN để tiếp tục</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              placeholder="Nhập mã PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
                color: "var(--color-text)", fontSize: 18, textAlign: "center",
                letterSpacing: 6, outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
                color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
              }}
            >
              Đăng nhập
            </button>
          </form>
        </motion.div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // Admin layout
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopBar
          title={tabTitles[activeTab] ?? "Admin"}
          onExport={handleExport}
          onImport={handleImport}
          onReset={resetData}
        />

        <main style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key={activeTab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }}>
                  {activeTab === "dashboard" && <DashboardTab onNavigate={(t) => setActiveTab(t as AdminTab)} />}
                  {activeTab === "settings" && <SettingsTab />}
                  {activeTab === "appearance" && <AppearanceTab />}
                  {activeTab === "profile" && <ProfileTab />}
                  {activeTab === "resources" && <ResourcesTab />}
                  {activeTab === "golden-faces" && <GoldenFacesTab />}
                  {activeTab === "announcements" && <AnnouncementsTab />}
                  {activeTab === "gallery" && <GalleryTab />}
                  {activeTab === "parents" && <ParentsTab />}
                  {activeTab === "custom-pages" && <CustomPagesTab />}
                  {activeTab === "lesson-plan" && <LessonPlanTab showToast={showToast} />}
                  {activeTab === "documents" && <DocumentsTab showToast={showToast} />}
                  {activeTab === "communication" && <CommunicationTab showToast={showToast} />}
                  {activeTab === "students" && <StudentsTab showToast={showToast} />}
                  {activeTab === "ai-settings" && <AISettingsTab showToast={showToast} />}
                </motion.div>
              </Suspense>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
