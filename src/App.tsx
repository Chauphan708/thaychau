import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/shared/BackToTop";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import ResourcesPage from "@/pages/ResourcesPage";
import ParentsPage from "@/pages/ParentsPage";
import GalleryPage from "@/pages/GalleryPage";
import AdminPage from "@/pages/AdminPage";
import CustomPage from "@/pages/CustomPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SiteProvider } from "@/context/SiteContext";

/** Wrapper — chạy hooks cần useLocation (chỉ dùng bên trong BrowserRouter) */
function AppShell() {
  const { pathname } = useLocation();
  useScrollToTop();
  usePageMeta(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ho-so" element={<ProfilePage />} />
          <Route path="/hoc-lieu" element={<ResourcesPage />} />
          <Route path="/phu-huynh" element={<ParentsPage />} />
          <Route path="/thu-vien" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/page/:slug" element={<CustomPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  );
}
