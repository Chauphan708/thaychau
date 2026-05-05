// src/pages/admin/ProfileTab.tsx — CRUD hồ sơ cá nhân (6 sections)
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import { Pencil, Trash2, Plus } from "lucide-react";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { TeachingPhilosophy, MilestoneItem, CertificateItem, SkillItem, FunFact } from "@/data/profileData";

export default function ProfileTab() {
  const siteData = useSiteData();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Bio */}
      <Card title="📝 Giới thiệu bản thân">
        <textarea
          value={siteData.bio}
          onChange={(e) => siteData.setBio(e.target.value)}
          style={{ ...inputStyle, height: 120, resize: "vertical" }}
          placeholder="Viết vài dòng giới thiệu về bản thân..."
        />
      </Card>

      {/* Fun Facts */}
      <ListSection<FunFact>
        title="🎲 Số liệu vui"
        items={siteData.funFacts}
        setItems={siteData.setFunFacts}
        fields={[
          { key: "icon", label: "Emoji", type: "text", placeholder: "📅" },
          { key: "label", label: "Nhãn", type: "text", placeholder: "Năm kinh nghiệm", required: true },
          { key: "value", label: "Giá trị", type: "text", placeholder: "10+", required: true },
        ]}
        renderItem={(item) => (
          <span>{item.icon} <b>{item.value}</b> — {item.label}</span>
        )}
        createDefault={() => ({ icon: "✨", label: "", value: "" })}
      />

      {/* Philosophies */}
      <ListSection<TeachingPhilosophy>
        title="💡 Triết lý giáo dục"
        items={siteData.philosophies}
        setItems={siteData.setPhilosophies}
        fields={[
          { key: "icon", label: "Emoji", type: "text", placeholder: "🎯" },
          { key: "title", label: "Tiêu đề", type: "text", required: true },
          { key: "description", label: "Mô tả", type: "textarea" },
        ]}
        renderItem={(item) => (
          <span>{item.icon} <b>{item.title}</b> — {item.description.slice(0, 60)}...</span>
        )}
        createDefault={() => ({ icon: "💡", title: "", description: "" })}
      />

      {/* Milestones */}
      <ListSection<MilestoneItem>
        title="🏆 Cột mốc sự nghiệp"
        items={siteData.milestones}
        setItems={siteData.setMilestones}
        fields={[
          { key: "year", label: "Năm", type: "text", required: true, placeholder: "2020" },
          { key: "title", label: "Tiêu đề", type: "text", required: true },
          { key: "description", label: "Mô tả", type: "textarea" },
        ]}
        renderItem={(item) => (
          <span><b>[{item.year}]</b> {item.title}</span>
        )}
        createDefault={() => ({ year: new Date().getFullYear().toString(), title: "", description: "" })}
      />

      {/* Skills */}
      <ListSection<SkillItem>
        title="🎯 Kỹ năng"
        items={siteData.skills}
        setItems={siteData.setSkills}
        fields={[
          { key: "name", label: "Tên kỹ năng", type: "text", required: true },
          { key: "level", label: "Mức độ (1-5)", type: "number", min: 1, max: 5 },
          { key: "category", label: "Phân loại", type: "select", options: [
            { value: "pedagogy", label: "Sư phạm" },
            { value: "tech", label: "Công nghệ" },
            { value: "soft", label: "Kỹ năng mềm" },
          ]},
        ]}
        renderItem={(item) => (
          <span><b>{item.name}</b> — {"⭐".repeat(item.level)} ({item.category})</span>
        )}
        createDefault={() => ({ name: "", level: 3, category: "pedagogy" as const })}
      />

      {/* Certificates */}
      <ListSection<CertificateItem>
        title="📜 Chứng chỉ & Thành tích"
        items={siteData.certificates}
        setItems={siteData.setCertificates}
        fields={[
          { key: "title", label: "Tên chứng chỉ", type: "text", required: true },
          { key: "issuer", label: "Đơn vị cấp", type: "text", required: true },
          { key: "year", label: "Năm", type: "text", placeholder: "2020" },
        ]}
        renderItem={(item) => (
          <span><b>{item.title}</b> — {item.issuer} ({item.year})</span>
        )}
        createDefault={() => ({ title: "", issuer: "", year: new Date().getFullYear().toString() })}
      />
    </div>
  );
}

// ============================================================
// Generic ListSection — CRUD cho danh sách bất kỳ
// ============================================================

interface ListSectionProps<T> {
  title: string;
  items: T[];
  setItems: (items: T[]) => void;
  fields: FormField[];
  renderItem: (item: T) => React.ReactNode;
  createDefault: () => T;
}

function ListSection<T extends any>({ title, items, setItems, fields, renderItem, createDefault }: ListSectionProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openAdd = useCallback(() => {
    setEditIndex(null);
    setFormValues(createDefault() as Record<string, unknown>);
    setModalOpen(true);
  }, [createDefault]);

  const openEdit = useCallback((index: number) => {
    setEditIndex(index);
    setFormValues({ ...items[index] } as Record<string, unknown>);
    setModalOpen(true);
  }, [items]);

  const handleSave = useCallback(() => {
    const newItems = [...items];
    if (editIndex !== null) {
      newItems[editIndex] = formValues as T;
    } else {
      newItems.push(formValues as T);
    }
    setItems(newItems);
    setModalOpen(false);
  }, [items, editIndex, formValues, setItems]);

  const handleDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setItems(items.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  }, [items, deleteIndex, setItems]);

  const moveItem = useCallback((from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
  }, [items, setItems]);

  return (
    <>
      <Card title={title} onAdd={openAdd}>
        {items.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>Chưa có mục nào</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", fontSize: 13, color: "var(--color-text)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button onClick={() => moveItem(i, i - 1)} disabled={i === 0} style={gripBtn} title="Lên">▲</button>
                  <button onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1} style={gripBtn} title="Xuống">▼</button>
                </div>
                <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {renderItem(item)}
                </div>
                <button onClick={() => openEdit(i)} title="Sửa" style={actionBtn}><Pencil style={{ width: 13, height: 13 }} /></button>
                <button onClick={() => setDeleteIndex(i)} title="Xoá" style={{ ...actionBtn, color: "#ef4444" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <FormModal
        open={modalOpen}
        title={editIndex !== null ? "Chỉnh sửa" : "Thêm mới"}
        fields={fields}
        values={formValues}
        onChange={(k, v) => setFormValues({ ...formValues, [k]: v })}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </>
  );
}

// ---- Shared UI ----

function Card({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div style={{ background: "var(--color-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>{title}</h3>
        {onAdd && (
          <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
            <Plus style={{ width: 14, height: 14 }} /> Thêm
          </button>
        )}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
  color: "var(--color-text)", fontSize: 13, outline: "none", fontFamily: "inherit",
};

const actionBtn: React.CSSProperties = {
  padding: 5, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
  background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", display: "flex", alignItems: "center",
};

const gripBtn: React.CSSProperties = {
  padding: 0, border: "none", background: "transparent", cursor: "pointer",
  fontSize: 8, lineHeight: 1, color: "var(--color-text-secondary)",
};
