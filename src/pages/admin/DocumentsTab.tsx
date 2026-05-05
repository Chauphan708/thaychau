import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Upload, Eye, Tag } from "lucide-react";
import Card from "@/components/ui/Card";
import TabGroup from "@/components/ui/TabGroup";
import { useAI } from "@/hooks/useAI";
import { mockDocuments } from "@/data/aiMockData";

interface DocumentsTabProps {
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export default function DocumentsTab({ showToast }: DocumentsTabProps) {
  const ai = useAI();
  const [subTab, setSubTab] = useState("incoming");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const filtered = mockDocuments.filter(d => d.category === subTab);

  const statusConfig = {
    unread: { label: "Chưa đọc", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    read: { label: "Đã đọc", color: "var(--color-secondary)", bg: "rgba(22,163,74,0.08)" },
    processing: { label: "Đang xử lý", color: "var(--color-accent)", bg: "rgba(245,158,11,0.08)" },
  };

  const handleSummarize = async (text: string) => {
    const result = await ai.generate({ fn: "summarize", params: { text } });
    if (result) { setSummaryResult(result); showToast("success", "AI đã tóm tắt xong!"); }
    else if (ai.error) showToast("error", ai.error);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>📄 Văn bản & Báo cáo</h2>

      <TabGroup
        tabs={[
          { id: "incoming", label: "Công văn đến", icon: <FileText style={{ width: 14, height: 14 }} /> },
          { id: "report", label: "Báo cáo", icon: <FileText style={{ width: 14, height: 14 }} /> },
          { id: "template", label: "Biểu mẫu", icon: <FileText style={{ width: 14, height: 14 }} /> },
        ]}
        activeTab={subTab}
        onChange={setSubTab}
        variant="pill"
      />

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: selectedDoc ? "1fr 1fr" : "1fr", gap: 20 }}>
        {/* Document List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && <p style={{ color: "var(--color-text-secondary)", fontSize: 13, textAlign: "center", padding: 40 }}>Chưa có văn bản nào.</p>}
          {filtered.map(doc => {
            const st = statusConfig[doc.status];
            return (
              <Card key={doc.id} style={{ cursor: "pointer", transition: "all var(--transition-fast)" }} highlighted={selectedDoc === doc.id}>
                <div onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.4 }}>{doc.title}</h4>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: st.bg, color: st.color, flexShrink: 0, marginLeft: 8 }}>{st.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
                    <span>{doc.from}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                  {doc.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                      {doc.tags.map(tag => (
                        <span key={tag} style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}>
                          <Tag style={{ width: 10, height: 10 }} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Upload */}
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: "var(--radius-md)", border: "2px dashed var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}>
            <Upload style={{ width: 18, height: 18 }} /> Tải văn bản lên
          </button>
        </div>

        {/* Detail Panel */}
        {selectedDoc && (() => {
          const doc = mockDocuments.find(d => d.id === selectedDoc);
          if (!doc) return null;
          return (
            <Card title={doc.title} titleIcon={<Eye style={{ width: 16, height: 16, color: "var(--color-primary)" }} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  <p style={{ margin: 0 }}><strong>Từ:</strong> {doc.from}</p>
                  <p style={{ margin: "4px 0 0" }}><strong>Ngày:</strong> {doc.date}</p>
                </div>

                {doc.summary && (
                  <div style={{ padding: 14, borderRadius: "var(--radius-sm)", background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginBottom: 6 }}>📝 Tóm tắt</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text)", lineHeight: 1.6 }}>{doc.summary}</p>
                  </div>
                )}

                {summaryResult && (
                  <div style={{ padding: 14, borderRadius: "var(--radius-sm)", background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#8b5cf6", marginBottom: 6 }}>🤖 AI Phân tích</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{summaryResult}</p>
                  </div>
                )}

                <button onClick={() => handleSummarize(doc.title + " " + (doc.summary || ""))} disabled={ai.loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: "var(--radius-sm)", border: "none", background: "linear-gradient(135deg, var(--color-primary), #7c3aed)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: ai.loading ? 0.7 : 1 }}>
                  <Sparkles style={{ width: 16, height: 16 }} />
                  {ai.loading ? "Đang phân tích..." : "AI Phân tích chi tiết"}
                </button>
              </div>
            </Card>
          );
        })()}
      </div>
    </motion.div>
  );
}
