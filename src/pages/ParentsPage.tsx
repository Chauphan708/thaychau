import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Bell, BellRing, Send, CheckCircle, AlertTriangle,
  MessageSquare, Clock, ChevronDown, ChevronUp,
} from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { sanitizeInput } from "@/lib/utils";
import { checkRateLimit, isHoneypotTriggered, isValidEmail } from "@/lib/security";
import AnimatedSection from "@/components/shared/AnimatedSection";

// ===== WEEKLY SCHEDULE TABLE =====
function ScheduleSection() {
  const { config: siteConfig, weeklySchedule } = useSiteData();
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Calendar className="inline w-6 h-6 mr-2" style={{ color: "var(--color-primary)" }} />
          Thời Khóa Biểu
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Lịch học tuần của lớp {siteConfig.teacherName}
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden overflow-x-auto"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left font-semibold text-xs"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                <Clock className="inline w-3.5 h-3.5 mr-1" />
                Tiết
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center font-semibold text-xs"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((slot, i) => (
              <tr
                key={slot.time}
                style={{
                  background: i % 2 === 0 ? "var(--color-card)" : "var(--color-bg-secondary)",
                }}
              >
                <td
                  className="px-4 py-3 font-medium text-xs whitespace-nowrap"
                  style={{ color: "var(--color-text)", borderRight: "1px solid var(--color-border)" }}
                >
                  {slot.time}
                </td>
                {dayKeys.map((key) => (
                  <td
                    key={key}
                    className="px-4 py-3 text-center text-xs"
                    style={{
                      color: "var(--color-text)",
                      borderRight: "1px solid var(--color-border)",
                    }}
                  >
                    {slot[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedSection>
  );
}

// ===== NOTICES SECTION =====
function NoticesSection() {
  const { parentNotices } = useSiteData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <Bell className="inline w-6 h-6 mr-2" style={{ color: "var(--color-accent)" }} />
          Thông Báo Cho Phụ Huynh
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Cập nhật mới nhất từ giáo viên chủ nhiệm
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {parentNotices.map((notice, i) => {
          const isExpanded = expandedId === notice.id;
          const isNew = (Date.now() - new Date(notice.date).getTime()) < 5 * 24 * 60 * 60 * 1000;

          return (
            <AnimatedSection key={notice.id} delay={i * 0.08}>
              <div
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  background: "var(--color-card)",
                  border: notice.important
                    ? "2px solid rgba(245,158,11,0.4)"
                    : "1px solid var(--color-border)",
                }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 cursor-pointer border-none text-left transition-all"
                  style={{ background: "transparent" }}
                >
                  {notice.important ? (
                    <BellRing className="w-5 h-5 shrink-0" style={{ color: "var(--color-accent)" }} />
                  ) : (
                    <Bell className="w-5 h-5 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                        {notice.title}
                      </h3>
                      {notice.important && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.15)", color: "var(--color-accent)" }}
                        >
                          Quan trọng
                        </span>
                      )}
                      {isNew && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {notice.date}
                    </p>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                  )}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-4"
                  >
                    <div
                      className="pl-8 text-sm leading-relaxed"
                      style={{ color: "var(--color-text)" }}
                    >
                      {notice.content}
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ===== FEEDBACK FORM =====
type FormStatus = "idle" | "sending" | "success" | "error" | "rate-limited";

function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden field
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security checks
    if (isHoneypotTriggered(honeypot)) {
      setStatus("success"); // fake success for bots
      return;
    }

    if (!checkRateLimit("feedback-form", 3, 60_000)) {
      setStatus("rate-limited");
      return;
    }

    if (email && !isValidEmail(email)) {
      setStatus("error");
      return;
    }

    // Sanitize inputs
    const safeData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    };

    if (!safeData.name.trim() || !safeData.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // Simulate sending (replace with EmailJS/Formspree integration)
    setTimeout(() => {
      console.log("Feedback submitted:", safeData);
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <MessageSquare className="inline w-6 h-6 mr-2" style={{ color: "var(--color-secondary)" }} />
          Ý Kiến Đóng Góp
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Phụ huynh có thể gửi ý kiến, câu hỏi hoặc góp ý tại đây
        </p>
      </div>

      <div
        className="max-w-xl mx-auto rounded-xl p-6 md:p-8"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--color-secondary)" }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
              Gửi thành công!
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Cảm ơn ý kiến đóng góp của quý phụ huynh. Tôi sẽ phản hồi sớm nhất có thể.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
              style={{ background: "var(--color-bg-secondary)", color: "var(--color-primary)" }}
            >
              Gửi ý kiến khác
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Honeypot — hidden from users, visible to bots */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              aria-hidden="true"
            />

            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Họ tên phụ huynh <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Nguyễn Thị B"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Email <span className="text-xs font-normal" style={{ color: "var(--color-text-secondary)" }}>(không bắt buộc)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Nội dung <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={1000}
                rows={4}
                placeholder="Xin vui lòng nhập ý kiến đóng góp..."
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all resize-y"
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
              <p className="text-[10px] text-right mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {message.length}/1000
              </p>
            </div>

            {status === "rate-limited" && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs"
                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau 1 phút.
              </div>
            )}

            {status === "error" && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs"
                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Vui lòng kiểm tra lại thông tin. Họ tên và nội dung là bắt buộc.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
              }}
            >
              {status === "sending" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi ý kiến
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </AnimatedSection>
  );
}

// ===== MAIN PAGE =====
export default function ParentsPage() {
  return (
    <main>
      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            👪 Góc Phụ Huynh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nơi cập nhật lịch học, thông báo và gửi ý kiến đóng góp đến giáo viên chủ nhiệm.
          </motion.p>
        </div>
      </section>

      <ScheduleSection />
      <NoticesSection />
      <FeedbackForm />
    </main>
  );
}
