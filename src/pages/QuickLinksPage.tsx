import { useSiteData } from "@/context/SiteContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function QuickLinksPage() {
  const { customPages, isLoading } = useSiteData();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--color-text-secondary)" }}>
        Đang tải...
      </div>
    );
  }

  const visiblePages = customPages.filter((p) => p.visible);

  return (
    <main className="py-12 md:py-20" style={{ background: "var(--color-bg)", minHeight: "80vh" }}>
      <div className="container mx-auto max-w-5xl px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #7c3aed)" }}
            >
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
              Link Nhanh
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Tổng hợp các trang nội dung, liên kết ngoài và tiện ích khác của giáo viên.
            </p>
          </div>
        </AnimatedSection>

        {visiblePages.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--color-text-secondary)" }}>
            Chưa có trang con nào. Giáo viên có thể thêm trong phần quản trị.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visiblePages.map((page, i) => {
              const isUrlType = page.content_type === "url";
              const Wrapper = isUrlType ? "a" : Link;
              const extraProps = isUrlType
                ? { href: page.content, target: "_blank", rel: "noopener noreferrer" }
                : { to: `/page/${page.slug}` };

              return (
                <AnimatedSection key={page.slug} delay={i * 0.1}>
                  <Wrapper
                    {...(extraProps as any)}
                    className="flex flex-col h-full rounded-2xl p-6 no-underline transition-all hover:-translate-y-1 hover:shadow-xl group"
                    style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                        style={{ background: "var(--color-bg-secondary)" }}
                      >
                        {page.icon}
                      </div>
                      {isUrlType && <ExternalLink className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />}
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
                      {page.title}
                    </h3>
                    <div className="mt-auto pt-4">
                      <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                        Truy cập ngay →
                      </span>
                    </div>
                  </Wrapper>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
