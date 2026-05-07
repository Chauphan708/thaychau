// src/pages/admin/SettingsTab.tsx — Cài đặt chung (CRUD cho siteConfig)
import { useSiteData } from "@/context/SiteContext";
import { User, Quote, Link, Timer, Puzzle, Save } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function SettingsTab() {
  const { config, setConfig } = useSiteData();

  const update = (key: keyof SiteConfig, value: unknown) => {
    setConfig({ ...config, [key]: value } as SiteConfig);
  };

  const updateIntegration = (key: string, field: string, value: unknown) => {
    const integrations = { ...config.integrations } as Record<string, Record<string, unknown>>;
    integrations[key] = { ...integrations[key], [field]: value };
    update("integrations", integrations);
  };

  const updateCountdown = (field: string, value: unknown) => {
    update("countdown", { ...config.countdown, [field]: value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Thông tin cá nhân */}
      <Section icon={<User style={iconSm} />} title="Thông tin cá nhân">
        <Grid>
          <Field label="Tên giáo viên" value={config.teacherName} onChange={(v) => update("teacherName", v)} />
          <Field label="Trường học" value={config.school} onChange={(v) => update("school", v)} />
          <Field label="Xã/Phường" value={config.district} onChange={(v) => update("district", v)} />
          <Field label="Email" value={config.email} onChange={(v) => update("email", v)} type="email" />
          <Field label="Số điện thoại" value={config.phone} onChange={(v) => update("phone", v)} type="tel" />
          <Field label="Zalo" value={config.zaloLink} onChange={(v) => update("zaloLink", v)} placeholder="https://zalo.me/..." />
          <Field label="Facebook" value={config.facebookLink} onChange={(v) => update("facebookLink", v)} placeholder="https://facebook.com/..." />
          <Field label="Avatar URL" value={config.avatar} onChange={(v) => update("avatar", v)} placeholder="URL ảnh đại diện" />
        </Grid>
      </Section>

      {/* Châm ngôn */}
      <Section icon={<Quote style={iconSm} />} title="Châm ngôn">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Label>Nội dung</Label>
            <textarea value={config.quote} onChange={(e) => update("quote", e.target.value)} style={{ ...inputStyle, height: 64, resize: "vertical" }} />
          </div>
          <Field label="Tác giả" value={config.quoteAuthor} onChange={(v) => update("quoteAuthor", v)} />
        </div>
      </Section>

      {/* Đếm ngược */}
      <Section icon={<Timer style={iconSm} />} title="Đếm ngược">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ToggleField label="Bật đếm ngược" checked={config.countdown.enabled} onChange={(v) => updateCountdown("enabled", v)} />
          {config.countdown.enabled && (
            <Grid>
              <Field label="Nhãn" value={config.countdown.label} onChange={(v) => updateCountdown("label", v)} />
              <div>
                <Label>Ngày đích</Label>
                <input type="date" value={config.countdown.targetDate} onChange={(e) => updateCountdown("targetDate", e.target.value)} style={inputStyle} />
              </div>
            </Grid>
          )}
        </div>
      </Section>

      {/* Tích hợp */}
      <Section icon={<Link style={iconSm} />} title="Tích hợp hệ thống">
        {(["openlms", "elearning", "googleDrive"] as const).map((key) => {
          const item = config.integrations[key] as Record<string, unknown>;
          return (
            <div key={key} style={{ padding: 16, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", marginBottom: 12 }}>
              <ToggleField label={String(item.label ?? key)} checked={!!item.enabled} onChange={(v) => updateIntegration(key, "enabled", v)} />
              {!!item.enabled && "url" in item && (
                <div style={{ marginTop: 8 }}>
                  <Field label="URL" value={String(item.url ?? "")} onChange={(v) => updateIntegration(key, "url", v)} placeholder="https://..." />
                </div>
              )}
              {!!item.enabled && "rootFolderId" in item && (
                <div style={{ marginTop: 8 }}>
                  <Field label="Root Folder ID" value={String(item.rootFolderId ?? "")} onChange={(v) => updateIntegration(key, "rootFolderId", v)} />
                </div>
              )}
            </div>
          );
        })}
      </Section>

      {/* Môn học + Khối lớp */}
      <Section icon={<Puzzle style={iconSm} />} title="Môn học & Khối lớp">
        <div style={{ marginBottom: 12 }}>
          <Label>Môn học (cách nhau bằng dấu phẩy)</Label>
          <input type="text" value={config.subjects.join(", ")} onChange={(e) => update("subjects", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} style={inputStyle} />
        </div>
        <div>
          <Label>Khối lớp</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((g) => (
              <label key={g} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 13, color: "var(--color-text)" }}>
                <input type="checkbox" checked={config.gradeLevels.includes(g)} onChange={(e) => {
                  const levels = e.target.checked ? [...config.gradeLevels, g].sort() : config.gradeLevels.filter((l) => l !== g);
                  update("gradeLevels", levels);
                }} />
                Lớp {g}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          onClick={() => alert("Hệ thống luôn tự động lưu mỗi khi thầy gõ phím. Dữ liệu đã được lưu an toàn!")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 24px", background: "var(--color-primary)",
            color: "#fff", border: "none", borderRadius: "var(--radius-md)",
            fontWeight: 600, cursor: "pointer", fontSize: 14
          }}
        >
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-card)", padding: 24, borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "var(--color-text)", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-heading)" }}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{children}</label>;
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text)" }}>{label}</span>
    </label>
  );
}

const iconSm: React.CSSProperties = { width: 18, height: 18, color: "var(--color-primary)" };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
  color: "var(--color-text)", fontSize: 13, outline: "none", fontFamily: "inherit",
};
