import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Eye, EyeOff, CheckCircle, XCircle, HardDrive, Unlink, Brain, Mic, BookOpen, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { isValidGeminiKey, decodeApiKey } from "@/lib/security";
import { testGeminiConnection, saveGeminiApiKey as saveKey, clearGeminiApiKey } from "@/services/geminiAI";
import { getGoogleClientId, setGoogleClientId, getGoogleApiKey, setGoogleApiKey } from "@/services/googleDrive";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { useSiteData } from "@/context/SiteContext";
import type { SiteConfig } from "@/data/siteConfig";

interface AISettingsTabProps {
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export default function AISettingsTab({ showToast }: AISettingsTabProps) {
  const { config, setConfig } = useSiteData();
  const drive = useGoogleDrive();

  // === Gemini Key ===
  const [geminiKey, setGeminiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [testing, setTesting] = useState(false);

  // === Google Cloud IDs ===
  const [clientId, setClientIdState] = useState(getGoogleClientId() ?? "");
  const [apiKey, setApiKeyState] = useState(getGoogleApiKey() ?? "");

  // === AI Preferences ===
  const ai = config.ai;

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) {
      setGeminiKey(decodeApiKey(saved));
      setGeminiStatus("unknown");
    }
  }, []);

  const handleSaveGeminiKey = () => {
    if (!geminiKey.trim()) {
      clearGeminiApiKey();
      setGeminiStatus("unknown");
      showToast("info", "Đã xóa Gemini API Key.");
      return;
    }
    if (!isValidGeminiKey(geminiKey)) {
      showToast("error", "API Key không hợp lệ. Key phải bắt đầu bằng 'AIza...'");
      return;
    }
    saveKey(geminiKey.trim());
    showToast("success", "Đã lưu Gemini API Key!");
  };

  const handleTestGemini = async () => {
    setTesting(true);
    const result = await testGeminiConnection();
    setGeminiStatus(result.ok ? "ok" : "error");
    showToast(result.ok ? "success" : "error", result.ok ? `✅ Kết nối thành công — ${result.model}` : `❌ ${result.error}`);
    setTesting(false);
  };

  const handleSaveGoogleIds = () => {
    if (clientId.trim()) setGoogleClientId(clientId.trim());
    if (apiKey.trim()) setGoogleApiKey(apiKey.trim());
    showToast("success", "Đã lưu Google Cloud IDs!");
  };

  const handleConnectDrive = async () => {
    const ok = await drive.connect();
    if (ok) showToast("success", "Đã kết nối Google Drive!");
    else if (drive.error) showToast("error", drive.error);
  };

  const updateAI = (key: string, value: unknown) => {
    setConfig({ ...config, ai: { ...config.ai, [key]: value } } as SiteConfig);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
        🤖 Cấu hình AI & Kết nối
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Gemini API Key */}
        <Card title="Gemini API Key" titleIcon={<Key style={{ width: 18, height: 18, color: "var(--color-primary)" }} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type={showKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  style={{
                    width: "100%",
                    padding: "10px 44px 10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text)",
                    fontSize: 14,
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}
                  aria-label="Toggle key visibility"
                >
                  {showKey ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              <button onClick={handleSaveGeminiKey} style={{ padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Lưu
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handleTestGemini}
                disabled={testing || !geminiKey}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  opacity: testing || !geminiKey ? 0.5 : 1,
                }}
              >
                <RefreshCw style={{ width: 14, height: 14, animation: testing ? "spin 1s linear infinite" : "none" }} />
                {testing ? "Đang kiểm tra..." : "Test kết nối"}
              </button>
              {geminiStatus === "ok" && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-secondary)" }}><CheckCircle style={{ width: 14, height: 14 }} /> Đã kết nối</span>}
              {geminiStatus === "error" && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#ef4444" }}><XCircle style={{ width: 14, height: 14 }} /> Lỗi kết nối</span>}
            </div>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }}>
              💡 Lấy key tại <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>aistudio.google.com</a> — Key được lưu cục bộ trên trình duyệt, không gửi đi đâu.
            </p>
          </div>
        </Card>

        {/* Google Drive */}
        <Card title="Google Drive" titleIcon={<HardDrive style={{ width: 18, height: 18, color: "#0f9d58" }} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {drive.connected ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "var(--radius-sm)", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-secondary)", fontWeight: 600 }}>
                  <CheckCircle style={{ width: 16, height: 16 }} /> Đã kết nối Google Drive
                </span>
                <button onClick={drive.disconnect} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                  <Unlink style={{ width: 14, height: 14 }} /> Ngắt
                </button>
              </div>
            ) : (
              <button onClick={handleConnectDrive} disabled={drive.loading || !clientId} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px", borderRadius: "var(--radius-sm)", border: "2px dashed var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 14, fontWeight: 600, cursor: clientId ? "pointer" : "not-allowed", opacity: clientId ? 1 : 0.5 }}>
                <HardDrive style={{ width: 20, height: 20, color: "#0f9d58" }} />
                {drive.loading ? "Đang kết nối..." : "Kết nối Google Drive"}
              </button>
            )}
            {drive.error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>❌ {drive.error}</p>}

            {/* Google Cloud IDs */}
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>Client ID (OAuth 2.0)</label>
                <input type="text" value={clientId} onChange={(e) => setClientIdState(e.target.value)} placeholder="xxx.apps.googleusercontent.com" style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 4 }}>API Key (Picker)</label>
                <input type="text" value={apiKey} onChange={(e) => setApiKeyState(e.target.value)} placeholder="AIza..." style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
              </div>
              <button onClick={handleSaveGoogleIds} style={{ alignSelf: "flex-start", padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "none", background: "#0f9d58", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                Lưu Google IDs
              </button>
              <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }}>
                📖 Hướng dẫn: Tạo project tại <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>Google Cloud Console</a> → Bật Google Drive API + Picker API → Tạo OAuth Client ID.
              </p>
            </div>
          </div>
        </Card>

        {/* AI Preferences */}
        <Card title="Cá nhân hóa AI" titleIcon={<Brain style={{ width: 18, height: 18, color: "#8b5cf6" }} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Tone */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>
                <Mic style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                Giọng văn AI
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["friendly", "formal"] as const).map((tone) => (
                  <button key={tone} onClick={() => updateAI("tone", tone)} style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-sm)", border: ai.tone === tone ? "2px solid var(--color-primary)" : "1px solid var(--color-border)", background: ai.tone === tone ? "rgba(37,99,235,0.06)" : "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, fontWeight: ai.tone === tone ? 700 : 400, cursor: "pointer" }}>
                    {tone === "friendly" ? "😊 Gần gũi" : "📜 Trang trọng"}
                  </button>
                ))}
              </div>
            </div>

            {/* Student level */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>Trình độ học sinh</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["basic", "advanced", "mixed"] as const).map((level) => (
                  <button key={level} onClick={() => updateAI("studentLevel", level)} style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-sm)", border: ai.studentLevel === level ? "2px solid var(--color-primary)" : "1px solid var(--color-border)", background: ai.studentLevel === level ? "rgba(37,99,235,0.06)" : "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, fontWeight: ai.studentLevel === level ? 700 : 400, cursor: "pointer" }}>
                    {level === "basic" ? "📗 Cơ bản" : level === "advanced" ? "📕 Nâng cao" : "📘 Hỗn hợp"}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { key: "autoCV2345", label: "Tự động áp dụng cấu trúc Công văn 2345", icon: <BookOpen style={{ width: 14, height: 14, color: "var(--color-primary)" }} /> },
                { key: "rememberComments", label: "Ghi nhớ nhận xét cũ để gợi ý chính xác hơn", icon: <Brain style={{ width: 14, height: 14, color: "#8b5cf6" }} /> },
              ].map(({ key, label, icon }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", cursor: "pointer" }}>
                  <input type="checkbox" checked={(ai as Record<string, unknown>)[key] as boolean} onChange={(e) => updateAI(key, e.target.checked)} style={{ width: 16, height: 16 }} />
                  {icon}
                  <span style={{ fontSize: 13, color: "var(--color-text)" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
