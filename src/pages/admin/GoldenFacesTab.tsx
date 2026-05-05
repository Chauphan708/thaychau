// src/pages/admin/GoldenFacesTab.tsx — CRUD Gương mặt vàng
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { GoldenFace } from "@/data/goldenFaces";
import { Plus, Pencil, Trash2, Star, UserCircle } from "lucide-react";

const formFields: FormField[] = [
  { key: "name", label: "Tên học sinh", type: "text", required: true, placeholder: "Nguyễn Văn A" },
  { key: "className", label: "Lớp", type: "text", required: true, placeholder: "5A2" },
  { key: "achievement", label: "Thành tích", type: "textarea", required: true, placeholder: "Học sinh giỏi xuất sắc — Giải Nhất Toán cấp quận" },
  { key: "image", label: "URL ảnh (tuỳ chọn)", type: "url", placeholder: "https://..." },
];

export default function GoldenFacesTab() {
  const { goldenFaces, setGoldenFaces } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openAdd = useCallback(() => {
    setEditIndex(null);
    setFormValues({ name: "", className: "", achievement: "", image: "" });
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((index: number) => {
    setEditIndex(index);
    setFormValues({ ...goldenFaces[index] } as Record<string, unknown>);
    setModalOpen(true);
  }, [goldenFaces]);

  const handleSave = useCallback(() => {
    const face = formValues as unknown as GoldenFace;
    if (editIndex !== null) {
      setGoldenFaces(goldenFaces.map((f, i) => (i === editIndex ? face : f)));
    } else {
      setGoldenFaces([...goldenFaces, face]);
    }
    setModalOpen(false);
  }, [editIndex, formValues, goldenFaces, setGoldenFaces]);

  const handleDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setGoldenFaces(goldenFaces.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  }, [deleteIndex, goldenFaces, setGoldenFaces]);

  return (
    <>
      {/* Add button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          <Plus style={{ width: 16, height: 16 }} /> Thêm học sinh
        </button>
      </div>

      {/* Cards Grid */}
      {goldenFaces.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)" }}>
          <Star style={{ width: 40, height: 40, marginBottom: 8, opacity: 0.3 }} />
          <div style={{ fontSize: 14 }}>Chưa có học sinh nào được vinh danh</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {goldenFaces.map((face, i) => (
            <div key={i} style={{ background: "var(--color-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {face.image ? (
                    <img src={face.image} alt={face.name} style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserCircle style={{ width: 28, height: 28, color: "#fff" }} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text)" }}>{face.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Lớp {face.className}</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  ⭐ {face.achievement}
                </p>
              </div>
              <div style={{ display: "flex", borderTop: "1px solid var(--color-border)" }}>
                <button onClick={() => openEdit(i)} style={{ flex: 1, padding: "10px", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Pencil style={{ width: 13, height: 13 }} /> Sửa
                </button>
                <div style={{ width: 1, background: "var(--color-border)" }} />
                <button onClick={() => setDeleteIndex(i)} style={{ flex: 1, padding: "10px", border: "none", background: "transparent", cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Trash2 style={{ width: 13, height: 13 }} /> Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editIndex !== null ? "Chỉnh sửa Gương mặt vàng" : "Vinh danh Học sinh mới"}
        fields={formFields}
        values={formValues}
        onChange={(k, v) => setFormValues({ ...formValues, [k]: v })}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Xoá Gương mặt vàng"
        message="Bạn có chắc muốn xoá học sinh này khỏi bảng vinh danh?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </>
  );
}
