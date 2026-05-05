import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, User, Award, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { mockStudents } from "@/data/aiMockData";
import { useSiteData } from "@/context/SiteContext";

interface StudentsTabProps {
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export default function StudentsTab({ showToast }: StudentsTabProps) {
  const { config } = useSiteData();
  const ai = useAI();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [commentResult, setCommentResult] = useState<string | null>(null);

  const selected = mockStudents.find(s => s.id === selectedId);

  const gradeColors: Record<string, { color: string; bg: string }> = {
    "Hoàn thành tốt": { color: "var(--color-secondary)", bg: "rgba(22,163,74,0.08)" },
    "Hoàn thành": { color: "var(--color-primary)", bg: "rgba(37,99,235,0.08)" },
    "Chưa hoàn thành": { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    "Tốt": { color: "var(--color-secondary)", bg: "rgba(22,163,74,0.08)" },
    "Đạt": { color: "var(--color-primary)", bg: "rgba(37,99,235,0.08)" },
  };

  const handleAIComment = async () => {
    if (!selected) return;
    setCommentResult(null);
    const result = await ai.generate({
      fn: "comment",
      params: { studentName: selected.name, grades: selected.grades, behavior: selected.behavior, tone: config.ai.tone },
    });
    if (result) { setCommentResult(result); showToast("success", "AI đã gợi ý nhận xét!"); }
    else if (ai.error) showToast("error", ai.error);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>👨‍🎓 Dữ liệu học sinh</h2>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        {/* Left: Student List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0, marginBottom: 4 }}>{mockStudents.length} học sinh — Lớp 3A1</p>
          {mockStudents.map(s => (
            <div key={s.id} onClick={() => { setSelectedId(s.id); setCommentResult(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", background: selectedId === s.id ? "rgba(37,99,235,0.06)" : "var(--color-card)", border: selectedId === s.id ? "2px solid var(--color-primary)" : "1px solid var(--color-border)", cursor: "pointer", transition: "all var(--transition-fast)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User style={{ width: 18, height: 18, color: "#fff" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{s.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>{s.gender} — {s.className}</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "var(--color-text-secondary)", flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Right: Student Detail */}
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User style={{ width: 28, height: 28, color: "#fff" }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{selected.name}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>{selected.gender} — Lớp {selected.className}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>PH: {selected.parentName} — {selected.parentPhone}</p>
                </div>
              </div>
            </Card>

            {/* Grades */}
            <Card title="Kết quả học tập" titleIcon={<BookOpen style={{ width: 16, height: 16, color: "var(--color-primary)" }} />}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
                {Object.entries(selected.grades).map(([subject, grade]) => {
                  const gc = gradeColors[grade] ?? { color: "var(--color-text)", bg: "var(--color-bg-secondary)" };
                  return (
                    <div key={subject} style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", background: gc.bg }}>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>{subject}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: gc.color }}>{grade}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Behavior & Notes */}
            <Card title="Phẩm chất & Ghi chú" titleIcon={<Award style={{ width: 16, height: 16, color: "var(--color-accent)" }} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--color-bg-secondary)" }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Biểu hiện</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text)", lineHeight: 1.5 }}>{selected.behavior}</p>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--color-bg-secondary)" }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Ghi chú</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text)", lineHeight: 1.5 }}>{selected.notes}</p>
                </div>
              </div>
            </Card>

            {/* AI Comment */}
            <button onClick={handleAIComment} disabled={ai.loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: ai.loading ? 0.7 : 1 }}>
              <Sparkles style={{ width: 18, height: 18 }} />
              {ai.loading ? "Đang tạo nhận xét..." : "AI Gợi ý nhận xét (TT27)"}
            </button>

            {commentResult && (
              <Card highlighted>
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>🤖 Gợi ý nhận xét từ AI</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{commentResult}</p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, borderRadius: "var(--radius-lg)", border: "2px dashed var(--color-border)" }}>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>← Chọn học sinh để xem chi tiết</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
