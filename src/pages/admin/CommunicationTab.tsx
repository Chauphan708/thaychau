import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Send, Edit, User } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { mockEmailDrafts, mockStudents } from "@/data/aiMockData";
import { useSiteData } from "@/context/SiteContext";

interface CommunicationTabProps {
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export default function CommunicationTab({ showToast }: CommunicationTabProps) {
  const { config } = useSiteData();
  const ai = useAI();
  const [drafts, setDrafts] = useState(mockEmailDrafts);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  // New email form
  const [studentId, setStudentId] = useState("");
  const [context, setContext] = useState("");

  const handleDraftEmail = async () => {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) { showToast("error", "Vui lòng chọn học sinh."); return; }
    if (!context.trim()) { showToast("error", "Vui lòng nhập nội dung/hoàn cảnh."); return; }

    const result = await ai.generate({
      fn: "email",
      params: {
        studentName: student.name,
        parentName: student.parentName,
        context,
        tone: config.ai.tone,
      },
    });

    if (result) {
      const newDraft = {
        id: `email-${Date.now()}`,
        to: `${student.parentName} (PH ${student.name})`,
        subject: `Trao đổi về em ${student.name}`,
        body: result,
        studentId: student.id,
        status: "draft" as const,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setDrafts(prev => [newDraft, ...prev]);
      showToast("success", "AI đã soạn email thành công!");
      setContext("");
    } else if (ai.error) showToast("error", ai.error);
  };

  const selectedEmail = drafts.find(d => d.id === selectedDraft);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>✉️ Giao tiếp phụ huynh</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: New Email + Drafts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI compose */}
          <Card title="AI Soạn email" titleIcon={<Sparkles style={{ width: 16, height: 16, color: "#8b5cf6" }} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Học sinh</label>
                <select value={studentId} onChange={e => setStudentId(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}>
                  <option value="">— Chọn học sinh —</option>
                  {mockStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.className})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Nội dung cần trao đổi</label>
                <textarea value={context} onChange={e => setContext(e.target.value)} placeholder="VD: Em hay đi trễ, cần PH nhắc nhở..." rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none", resize: "vertical" }} />
              </div>
              <button onClick={handleDraftEmail} disabled={ai.loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: "var(--radius-sm)", border: "none", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: ai.loading ? 0.7 : 1 }}>
                <Sparkles style={{ width: 16, height: 16 }} />
                {ai.loading ? "Đang soạn..." : "AI Soạn email"}
              </button>
            </div>
          </Card>

          {/* Draft list */}
          <Card title="Email nháp" titleIcon={<Mail style={{ width: 16, height: 16, color: "var(--color-primary)" }} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflow: "auto" }}>
              {drafts.map(d => (
                <div key={d.id} onClick={() => { setSelectedDraft(d.id); setEditBody(d.body); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: selectedDraft === d.id ? "rgba(37,99,235,0.06)" : "var(--color-bg-secondary)", border: selectedDraft === d.id ? "1px solid var(--color-primary)" : "1px solid transparent", cursor: "pointer" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.subject}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--color-text-secondary)" }}>{d.to}</p>
                  </div>
                  <span style={{ fontSize: 10, color: d.status === "sent" ? "var(--color-secondary)" : "var(--color-accent)", fontWeight: 600, flexShrink: 0 }}>{d.status === "sent" ? "Đã gửi" : "Nháp"}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Email Preview/Edit */}
        <div>
          {selectedEmail ? (
            <Card title={selectedEmail.subject} titleIcon={<Edit style={{ width: 16, height: 16, color: "var(--color-primary)" }} />} titleAction={
              <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-secondary)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                <Send style={{ width: 12, height: 12 }} /> Gửi
              </button>
            }>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", background: "var(--color-bg-secondary)", fontSize: 12, color: "var(--color-text-secondary)" }}>
                  <p style={{ margin: 0 }}><User style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} /><strong>Đến:</strong> {selectedEmail.to}</p>
                </div>
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} style={{ width: "100%", minHeight: 350, padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none" }} />
              </div>
            </Card>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, borderRadius: "var(--radius-lg)", border: "2px dashed var(--color-border)" }}>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>← Chọn email để xem/chỉnh sửa</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
