// src/pages/CustomPage.tsx — Render trang con (URL redirect / Embed iframe / HTML)
import { useParams, Navigate } from "react-router-dom";
import { useSiteData } from "@/context/SiteContext";
import DOMPurify from "dompurify";

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { customPages, isLoading } = useSiteData();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--color-text-secondary)" }}>
        Đang tải...
      </div>
    );
  }

  const page = customPages.find((p) => p.slug === slug && p.visible);

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  // URL type → redirect in new tab (this page shows a redirect notice)
  if (page.content_type === "url") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{page.icon}</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{page.title}</h1>
        <p style={{ margin: "0 0 24px", color: "var(--color-text-secondary)", fontSize: 14 }}>Bạn sắp được chuyển đến trang bên ngoài.</p>
        <a
          href={page.content}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px", borderRadius: "var(--radius-md)",
            background: "var(--color-primary)", color: "#fff",
            fontWeight: 600, fontSize: 14, textDecoration: "none",
          }}
        >
          Mở trang ↗
        </a>
      </div>
    );
  }

  // Embed type → iframe
  if (page.content_type === "embed") {
    // Extract src from iframe tag or use content directly as URL
    let embedSrc = page.content.trim();
    const srcMatch = embedSrc.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      embedSrc = srcMatch[1];
    }

    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-card)" }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{page.icon} {page.title}</h1>
        </div>
        <iframe
          src={embedSrc}
          title={page.title}
          style={{ flex: 1, border: "none", width: "100%", minHeight: "75vh" }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    );
  }

  // HTML type → sanitized HTML rendering
  if (page.content_type === "html") {
    const cleanHtml = DOMPurify.sanitize(page.content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "src", "loading", "sandbox"],
    });

    return (
      <div style={{ minHeight: "60vh" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-card)" }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{page.icon} {page.title}</h1>
        </div>
        <div
          className="container mx-auto"
          style={{ padding: "24px 16px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text)" }}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>
    );
  }

  return null;
}
