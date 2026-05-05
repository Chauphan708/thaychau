import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Users, ImageIcon, ExternalLink, Clock,
  ChevronLeft, ChevronRight, Star, AlertCircle, Info, Calendar,
  GraduationCap,
} from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { daysUntil } from "@/lib/utils";
import AnimatedSection from "@/components/shared/AnimatedSection";

// ===== HERO SECTION =====
function HeroSection() {
  const { config: siteConfig } = useSiteData();
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(245,158,11,0.06) 100%)",
          }}
        />
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-3xl opacity-15"
          style={{ background: "#7c3aed" }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="shrink-0"
        >
          <div
            className="w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
              padding: "4px",
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: "var(--color-card)" }}
            >
              {siteConfig.avatar ? (
                <img src={siteConfig.avatar} alt={siteConfig.teacherName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <GraduationCap className="w-20 h-20" style={{ color: "var(--color-primary)" }} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            Xin chào! Tôi là
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            {siteConfig.teacherName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {siteConfig.school} — {siteConfig.district}
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg italic my-6 pl-4 border-l-4"
            style={{ color: "var(--color-text-secondary)", borderColor: "var(--color-accent)" }}
          >
            {siteConfig.quote}
            {siteConfig.quoteAuthor && (
              <span className="block text-xs mt-1 not-italic" style={{ color: "var(--color-text-secondary)" }}>
                — {siteConfig.quoteAuthor}
              </span>
            )}
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <Link
              to="/hoc-lieu"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #7c3aed)" }}
            >
              📚 Kho học liệu
            </Link>
            <Link
              to="/phu-huynh"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold no-underline border-2 transition-transform hover:scale-105"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              👪 Góc phụ huynh
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== COUNTDOWN =====
function CountdownSection() {
  const { config: siteConfig } = useSiteData();
  if (!siteConfig.countdown.enabled) return null;
  const days = daysUntil(siteConfig.countdown.targetDate);

  return (
    <AnimatedSection className="container mx-auto max-w-7xl px-4 -mt-4 mb-10">
      <div
        className="rounded-2xl px-6 py-4 flex items-center justify-center gap-3 text-sm"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <Clock className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
        <span style={{ color: "var(--color-text)" }}>
          {siteConfig.countdown.label}{" "}
          <strong className="text-lg" style={{ color: "var(--color-accent)" }}>{days}</strong> ngày
        </span>
      </div>
    </AnimatedSection>
  );
}

// ===== GOLDEN FACES =====
function GoldenFacesSection() {
  const { goldenFaces } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (goldenFaces.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % goldenFaces.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [goldenFaces.length]);

  if (goldenFaces.length === 0) return null;

  const prev = () => setCurrentIndex((i) => (i - 1 + goldenFaces.length) % goldenFaces.length);
  const next = () => setCurrentIndex((i) => (i + 1) % goldenFaces.length);

  return (
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mb-16">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
          ⭐ Gương Mặt Vàng
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Tuyên dương học sinh xuất sắc</p>
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="golden-glow rounded-2xl p-6 text-center"
          style={{ background: "var(--color-card)", border: "2px solid rgba(245,158,11,0.3)" }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            {goldenFaces[currentIndex].image ? (
              <img src={goldenFaces[currentIndex].image} className="w-full h-full rounded-full object-cover" alt={goldenFaces[currentIndex].name} />
            ) : (
              <Star className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            {goldenFaces[currentIndex].name}
          </h3>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--color-accent)" }}>
            Lớp {goldenFaces[currentIndex].className}
          </p>
          <p className="text-sm mt-3" style={{ color: "var(--color-text-secondary)" }}>
            {goldenFaces[currentIndex].achievement}
          </p>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {goldenFaces.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all cursor-pointer border-none"
                style={{
                  background: i === currentIndex ? "var(--color-accent)" : "var(--color-border)",
                  transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Học sinh ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Nav buttons */}
        {goldenFaces.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
              style={{ background: "var(--color-card)", boxShadow: "var(--shadow-md)", color: "var(--color-text)" }}
              aria-label="Trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
              style={{ background: "var(--color-card)", boxShadow: "var(--shadow-md)", color: "var(--color-text)" }}
              aria-label="Sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </AnimatedSection>
  );
}

// ===== ANNOUNCEMENTS =====
function AnnouncementsSection() {
  const { announcements } = useSiteData();
  const tagConfig = {
    urgent: { icon: AlertCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Khẩn" },
    info: { icon: Info, color: "var(--color-primary)", bg: "rgba(37,99,235,0.1)", label: "Thông báo" },
    event: { icon: Calendar, color: "var(--color-secondary)", bg: "rgba(22,163,74,0.1)", label: "Sự kiện" },
  };

  return (
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
        📢 Bảng Tin Nhanh
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {announcements.slice(0, 3).map((item, i) => {
          const tag = tagConfig[item.tag];
          const IconComponent = tag.icon;
          const isNew = (Date.now() - new Date(item.date).getTime()) < 3 * 24 * 60 * 60 * 1000;
          return (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <div
                className="rounded-xl p-5 transition-all hover:shadow-lg cursor-default"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: tag.bg, color: tag.color }}
                  >
                    <IconComponent className="w-3 h-3" />
                    {tag.label}
                  </span>
                  {isNew && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                      Mới
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--color-text)" }}>{item.title}</h3>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{item.summary}</p>
                <p className="text-xs mt-3 opacity-60" style={{ color: "var(--color-text-secondary)" }}>{item.date}</p>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ===== QUICK LINKS =====
function QuickLinksSection() {
  const { config: siteConfig } = useSiteData();
  const links = [
    { to: "/hoc-lieu", icon: BookOpen, label: "Kho Học Liệu", desc: "Tài liệu, bài giảng, đề thi", color: "var(--color-primary)" },
    { to: "/phu-huynh", icon: Users, label: "Góc Phụ Huynh", desc: "Lịch học, thông báo, ý kiến", color: "var(--color-secondary)" },
    { to: "/thu-vien", icon: ImageIcon, label: "Thư Viện Ảnh", desc: "Hoạt động, sản phẩm học sinh", color: "#8b5cf6" },
  ];

  // Thêm OpenLMS nếu enabled
  if (siteConfig.integrations.openlms.enabled) {
    links.push({
      to: siteConfig.integrations.openlms.url,
      icon: ExternalLink,
      label: "OpenLMS",
      desc: siteConfig.integrations.openlms.label,
      color: "var(--color-accent)",
    });
  }

  return (
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
        🚀 Truy Cập Nhanh
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((item, i) => {
          const isExternal = item.to.startsWith("http");
          const Wrapper = isExternal ? "a" : Link;
          const extraProps = isExternal
            ? { href: item.to, target: "_blank", rel: "noopener noreferrer" }
            : { to: item.to };

          return (
            <AnimatedSection key={item.label} delay={i * 0.1}>
              <Wrapper
                {...(extraProps as any)}
                className="rounded-xl p-5 text-center no-underline transition-all hover:scale-105 hover:shadow-lg block"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>{item.label}</h3>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
              </Wrapper>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ===== MAIN PAGE =====
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CountdownSection />
      <GoldenFacesSection />
      <AnnouncementsSection />
      <QuickLinksSection />
    </main>
  );
}
