import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Save, Layout, Columns2, Columns3, Download } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { useSiteData } from "@/context/SiteContext";
import { mockLessonPlan } from "@/data/aiMockData";

interface LessonPlanTabProps {
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export default function LessonPlanTab({ showToast }: LessonPlanTabProps) {
  const { config } = useSiteData();
  const ai = useAI();

  const [subject, setSubject] = useState("Toán");
  const [grade, setGrade] = useState(3);
  const [title, setTitle] = useState("");
  const [periods, setPeriods] = useState(1);
  const [layout, setLayout] = useState<"1col" | "2col" | "3col">("2col");
  const [extraNotes, setExtraNotes] = useState("");
  const [content, setContent] = useState(mockLessonPlan.content);
  const [savedPlans, setSavedPlans] = useState<Array<{ id: string; title: string; subject: string; date: string }>>([
    { id: "1", title: mockLessonPlan.title, subject: mockLessonPlan.subject, date: mockLessonPlan.createdAt },
  ]);

  const handleGenerate = async () => {
    if (!title.trim()) { showToast("error", "Vui lòng nhập tên bài dạy."); return; }
    const result = await ai.generate({
      fn: "lessonPlan",
      params: { subject, grade, title, periods, layout, extraNotes },
    });
    if (result) { setContent(result); showToast("success", "AI đã tạo giáo án thành công!"); }
    else if (ai.error) showToast("error", ai.error);
  };

  const handleSave = () => {
    const newPlan = { id: Date.now().toString(), title: title || "Giáo án mới", subject, date: new Date().toISOString().split("T")[0] };
    setSavedPlans(prev => [newPlan, ...prev]);
    showToast("success", "Đã lưu giáo án!");
  };

  const layouts = [
    { id: "1col" as const, label: "1 cột", icon: Layout, desc: "Liên tục" },
    { id: "2col" as const, label: "2 cột", icon: Columns2, desc: "GV — HS" },
    { id: "3col" as const, label: "3 cột", icon: Columns3, desc: "ND — GV — HS" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
        📖 Giáo án AI
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Thông tin bài dạy" titleIcon={<BookOpen style={{ width: 16, height: 16, color: "var(--color-primary)" }} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Môn học</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}>
                    {config.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Lớp</label>
                  <select value={grade} onChange={e => setGrade(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}>
                    {config.gradeLevels.map(g => <option key={g} value={g}>Lớp {g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Tên bài dạy</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Phép cộng trong phạm vi 10 000" style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Số tiết</label>
                  <input type="number" value={periods} onChange={e => setPeriods(Number(e.target.value))} min={1} max={5} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Ghi chú</label>
                  <input type="text" value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="Yêu cầu đặc biệt..." style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Layout selection */}
          <Card title="Format trình bày">
            <div style={{ display: "flex", gap: 8 }}>
              {layouts.map(l => (
                <button key={l.id} onClick={() => setLayout(l.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: "var(--radius-sm)", border: layout === l.id ? "2px solid var(--color-primary)" : "1px solid var(--color-border)", background: layout === l.id ? "rgba(37,99,235,0.06)" : "var(--color-bg-secondary)", cursor: "pointer" }}>
                  <l.icon style={{ width: 20, height: 20, color: layout === l.id ? "var(--color-primary)" : "var(--color-text-secondary)" }} />
                  <span style={{ fontSize: 12, fontWeight: layout === l.id ? 700 : 400, color: "var(--color-text)" }}>{l.label}</span>
                  <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{l.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Generate button */}
          <button onClick={handleGenerate} disabled={ai.loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: ai.loading ? "wait" : "pointer", opacity: ai.loading ? 0.7 : 1 }}>
            {ai.loading ? <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} /> Đang tạo...</> : <><Sparkles style={{ width: 18, height: 18 }} /> AI Tạo giáo án</>}
          </button>

          {/* Saved plans */}
          <Card title="Giáo án đã lưu" padding="sm">
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflow: "auto" }}>
              {savedPlans.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--color-bg-secondary)", fontSize: 12 }}>
                  <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{p.subject} — {p.title}</span>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: 10 }}>{p.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card title="Nội dung giáo án" titleAction={
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-secondary)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                <Save style={{ width: 12, height: 12 }} /> Lưu
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text)", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                <Download style={{ width: 12, height: 12 }} /> Xuất
              </button>
            </div>
          }>
            <textarea value={content} onChange={e => setContent(e.target.value)} style={{ width: "100%", minHeight: 500, padding: 16, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, fontFamily: "var(--font-body)", lineHeight: 1.7, resize: "vertical", outline: "none" }} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
