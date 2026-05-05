import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, GraduationCap, ExternalLink } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/ho-so", label: "Về giáo viên" },
  { to: "/hoc-lieu", label: "Kho học liệu" },
  { to: "/phu-huynh", label: "Góc phụ huynh" },
  { to: "/thu-vien", label: "Thư viện sáng tạo" },
];

export default function Navbar() {
  const { config, customPages } = useSiteData();
  // Attach customPages to config for menu rendering
  const configWithPages = { ...config, customPages };
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const siteConfig = configWithPages;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary), #7c3aed)" }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span
            className="font-bold text-lg hidden sm:inline"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}
          >
            {siteConfig.teacherName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks
            .filter((link) => {
              const key = link.to === "/" ? "home" : link.to.replace("/", "").replace("ho-so", "profile").replace("hoc-lieu", "resources").replace("phu-huynh", "parents").replace("thu-vien", "gallery");
              return siteConfig.pages[key as keyof typeof siteConfig.pages] !== false;
            })
            .map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline",
                    isActive
                      ? "text-white"
                      : "hover:opacity-80"
                  )}
                  style={{
                    color: isActive ? "#fff" : "var(--color-text-secondary)",
                    background: isActive ? "var(--color-primary)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

          {/* Custom Pages — dynamic menu items */}
          {(() => {
            const topPages = customPages.filter((p) => p.visible && !p.parent_slug) ?? [];
            return topPages.map((page) => {
              const isUrlType = page.content_type === "url";
              return (
                <div key={page.slug} style={{ position: "relative" }} className="group">
                  {isUrlType ? (
                    <a href={page.content} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-sm font-medium no-underline hover:opacity-80" style={{ color: "var(--color-text-secondary)" }}>
                      {page.icon} {page.title}
                    </a>
                  ) : (
                    <Link to={`/page/${page.slug}`} className="px-3 py-2 rounded-lg text-sm font-medium no-underline hover:opacity-80" style={{ color: location.pathname === `/page/${page.slug}` ? "#fff" : "var(--color-text-secondary)", background: location.pathname === `/page/${page.slug}` ? "var(--color-primary)" : "transparent" }}>
                      {page.icon} {page.title}
                    </Link>
                  )}
                </div>
              );
            });
          })()}

          {/* OpenLMS link */}
          {siteConfig.integrations.openlms.enabled && (
            <a
              href={siteConfig.integrations.openlms.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 no-underline hover:opacity-80"
              style={{ color: "var(--color-accent)" }}
            >
              OpenLMS <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {siteConfig.enableDarkMode && (
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)" }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg cursor-pointer"
            style={{ color: "var(--color-text)", background: "var(--color-bg-secondary)" }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium no-underline transition-all",
                    )}
                    style={{
                      color: isActive ? "#fff" : "var(--color-text)",
                      background: isActive ? "var(--color-primary)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Custom Pages — mobile */}
              {customPages.filter((p) => p.visible && !p.parent_slug).map((page) => {
                const isUrlType = page.content_type === "url";
                return isUrlType ? (
                  <a key={page.slug} href={page.content} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: "var(--color-text)" }}>
                    {page.icon} {page.title}
                  </a>
                ) : (
                  <Link key={page.slug} to={`/page/${page.slug}`} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: location.pathname === `/page/${page.slug}` ? "#fff" : "var(--color-text)", background: location.pathname === `/page/${page.slug}` ? "var(--color-primary)" : "transparent" }}>
                    {page.icon} {page.title}
                  </Link>
                );
              })}
              {siteConfig.integrations.openlms.enabled && (
                <a
                  href={siteConfig.integrations.openlms.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 no-underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  OpenLMS <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
