import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Users, ImageIcon, ExternalLink, Clock,
  Star, AlertCircle, Info, Calendar,
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
  const [isPaused, setIsPaused] = useState(false);

  if (goldenFaces.length === 0) return null;

  // Duplicate items if too few to make the circle look good
  const displayItems = goldenFaces.length < 5 
    ? [...goldenFaces, ...goldenFaces, ...goldenFaces].slice(0, 6) 
    : goldenFaces;
    
  const count = displayItems.length;
  const radius = Math.max(200, count * 40); // Dynamic radius based on item count

  return (
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mt-24 mb-24 overflow-visible">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
          ⭐ Gương Mặt Vàng
        </h2>
        <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>Tuyên dương học sinh xuất sắc của lớp</p>
      </div>

      <div 
        className="relative h-[450px] w-full flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative w-[220px] h-[300px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={isPaused ? {} : { rotateY: [0, -360] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayItems.map((item, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform: `rotateY(${i * (360 / count)}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <div 
                className="h-full w-full rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                style={{ 
                  background: "var(--color-card)", 
                  border: "2px solid rgba(245,158,11,0.3)",
                  boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)"
                }}
              >
                <div
                  className="w-24 h-24 rounded-full p-1 mb-4 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #7c3aed)" }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/50 bg-gray-100">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                         <Star className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                  {item.name}
                </h3>
                <p className="text-sm font-bold mb-3 px-3 py-0.5 rounded-full bg-amber-50 text-amber-600 inline-block">
                  Lớp {item.className}
                </p>
                <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.achievement}
                </p>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 opacity-20">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Reflection/Shadow base */}
        <div 
          className="absolute bottom-0 w-[400px] h-[40px] bg-black/5 blur-3xl rounded-[100%]"
          style={{ transform: "rotateX(90deg) translateZ(-150px)" }}
        />
      </div>

      {/* Control Hint */}
      <div className="text-center mt-8">
        <p className="text-xs opacity-40 italic" style={{ color: "var(--color-text)" }}>
          * Di chuột vào để dừng xem chi tiết
        </p>
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
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mt-20 mb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
        📢 Bản Tin Nhanh
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.slice(0, 3).map((item, i) => {
          const tag = tagConfig[item.tag];
          const IconComponent = tag.icon;
          const isNew = (Date.now() - new Date(item.date).getTime()) < 3 * 24 * 60 * 60 * 1000;
          return (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl p-6 transition-all hover:shadow-xl cursor-pointer"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-2 mb-4">
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
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--color-text)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{item.summary}</p>
                <p className="text-xs mt-4 opacity-60 font-medium" style={{ color: "var(--color-text-secondary)" }}>{item.date}</p>
              </motion.div>
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
    <AnimatedSection className="container mx-auto max-w-7xl px-4 mt-20 mb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
        🚀 Truy Cập Nhanh
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
