import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award, BookOpen, Briefcase, ChevronDown, ChevronUp,
  GraduationCap, Heart, Sparkles, Target, User,
} from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import AnimatedSection from "@/components/shared/AnimatedSection";

// ===== HERO / BIO SECTION =====
function ProfileHero() {
  const { config: siteConfig, bio: profileBio } = useSiteData();
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(37,99,235,0.07) 0%, rgba(124,58,237,0.06) 40%, rgba(22,163,74,0.05) 100%)",
          }}
        />
        <div
          className="absolute top-10 right-20 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="absolute bottom-0 left-10 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "#7c3aed" }}
        />
      </div>

      <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="shrink-0"
        >
          <div
            className="w-44 h-44 md:w-56 md:h-56 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), #7c3aed, var(--color-secondary))",
              padding: "4px",
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: "var(--color-card)" }}
            >
              {siteConfig.avatar ? (
                <img
                  src={siteConfig.avatar}
                  alt={siteConfig.teacherName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-24 h-24" style={{ color: "var(--color-primary)", opacity: 0.6 }} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <div className="text-center md:text-left flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(37,99,235,0.1)",
              color: "var(--color-primary)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Giáo viên Tiểu học
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            {siteConfig.teacherName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm mb-5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {siteConfig.school} — {siteConfig.district}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base leading-relaxed whitespace-pre-line"
            style={{ color: "var(--color-text)" }}
          >
            {profileBio}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== FUN FACTS (Stats) =====
function FunFactsSection() {
  const { funFacts } = useSiteData();
  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 -mt-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {funFacts.map((fact, i) => (
          <motion.div
            key={fact.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5 text-center transition-all hover:scale-105"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="text-3xl mb-2">{fact.icon}</div>
            <div
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-heading)",
                background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {fact.value}
            </div>
            <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {fact.label}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ===== PHILOSOPHY SECTION =====
function PhilosophySection() {
  const { philosophies } = useSiteData();
  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-8">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Heart className="inline w-6 h-6 mr-2" style={{ color: "#ef4444" }} />
          Triết Lý Giáo Dục
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Những giá trị tôi theo đuổi trong sự nghiệp giảng dạy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {philosophies.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.1}>
            <div
              className="rounded-xl p-6 h-full transition-all hover:shadow-lg group"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  style={{ background: "var(--color-bg-secondary)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3
                    className="font-semibold text-base mb-1.5"
                    style={{ color: "var(--color-text)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ===== TIMELINE SECTION =====
function TimelineSection() {
  const { milestones } = useSiteData();
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? milestones : milestones.slice(0, 4);

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-8">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Briefcase className="inline w-6 h-6 mr-2" style={{ color: "var(--color-primary)" }} />
          Hành Trình Sự Nghiệp
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Những cột mốc quan trọng trong nghề giáo
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{ background: "var(--color-border)" }}
        />

        <div className="flex flex-col gap-8">
          {visibleItems.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-4 md:gap-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div
                  className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 border-4"
                  style={{
                    borderColor: "var(--color-primary)",
                    background: "var(--color-card)",
                  }}
                />

                {/* Content card */}
                <div
                  className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] rounded-xl p-5 transition-all hover:shadow-lg ${
                    isLeft ? "md:mr-auto md:pr-6" : "md:ml-auto md:pl-6"
                  }`}
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2"
                    style={{
                      background: "rgba(37,99,235,0.1)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {item.year}
                  </span>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expand / Collapse */}
        {milestones.length > 4 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium cursor-pointer border-none transition-all hover:scale-105"
              style={{
                background: "var(--color-bg-secondary)",
                color: "var(--color-primary)",
              }}
            >
              {expanded ? (
                <>
                  Thu gọn <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Xem thêm ({milestones.length - 4}) <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

// ===== SKILLS SECTION =====
function SkillsSection() {
  const { skills } = useSiteData();
  const categories = [
    { key: "pedagogy" as const, label: "Sư phạm", icon: BookOpen, color: "var(--color-primary)" },
    { key: "tech" as const, label: "Công nghệ", icon: Target, color: "#8b5cf6" },
    { key: "soft" as const, label: "Kỹ năng mềm", icon: Heart, color: "var(--color-secondary)" },
  ];

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-8">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Target className="inline w-6 h-6 mr-2" style={{ color: "#8b5cf6" }} />
          Năng Lực & Kỹ Năng
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Những lĩnh vực tôi tự tin nhất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, catIdx) => {
          const catSkills = skills.filter((s) => s.category === cat.key);
          return (
            <AnimatedSection key={cat.key} delay={catIdx * 0.15}>
              <div
                className="rounded-xl p-6 h-full"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${cat.color}15` }}
                  >
                    <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                    {cat.label}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {catSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                          {skill.name}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {skill.level}/5
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: "var(--color-bg-secondary)" }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ===== CERTIFICATES SECTION =====
function CertificatesSection() {
  const { certificates } = useSiteData();
  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-8">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Award className="inline w-6 h-6 mr-2" style={{ color: "var(--color-accent)" }} />
          Chứng Chỉ & Thành Tích
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Những ghi nhận trong sự nghiệp
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {certificates.map((cert, i) => (
          <AnimatedSection key={cert.title} delay={i * 0.08}>
            <div
              className="rounded-xl p-5 h-full transition-all hover:shadow-lg hover:scale-[1.02] group"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                }}
              >
                <Award className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>
                {cert.title}
              </h3>
              <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
                {cert.issuer}
              </p>
              <span
                className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {cert.year}
              </span>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ===== CTA (Call to Action) =====
function CTASection() {
  const { config: siteConfig } = useSiteData();
  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div
        className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 bg-white translate-y-1/2 -translate-x-1/4" />

        <GraduationCap className="w-12 h-12 text-white/80 mx-auto mb-4" />
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Hãy cùng kết nối!
        </h2>
        <p className="text-white/80 text-sm max-w-lg mx-auto mb-6">
          Nếu bạn là phụ huynh, đồng nghiệp, hoặc bất kỳ ai quan tâm đến giáo dục — tôi luôn sẵn sàng trao đổi và hợp tác.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={siteConfig.zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold no-underline transition-transform hover:scale-105 bg-white"
            style={{ color: "var(--color-primary)" }}
          >
            💬 Chat Zalo
          </a>
          <a
            href={siteConfig.facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold no-underline transition-transform hover:scale-105 border-2 border-white/40 text-white"
          >
            📘 Facebook
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ===== MAIN PAGE =====
export default function ProfilePage() {
  return (
    <main>
      <ProfileHero />
      <FunFactsSection />
      <PhilosophySection />
      <TimelineSection />
      <SkillsSection />
      <CertificatesSection />
      <CTASection />
    </main>
  );
}
