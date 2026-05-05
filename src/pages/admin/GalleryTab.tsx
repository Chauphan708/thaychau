// src/pages/admin/GalleryTab.tsx — CRUD Thư viện ảnh
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { GalleryImage } from "@/data/gallery";
import { galleryCategories } from "@/data/gallery";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

const formFields: FormField[] = [
  { key: "src", label: "URL ảnh", type: "url", required: true, placeholder: "https://picsum.photos/..." },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "category", label: "Danh mục", type: "select", required: true, options: galleryCategories.filter((c) => c !== "Tất cả").map((c) => ({ value: c, label: c })) },
  { key: "date", label: "Ngày", type: "date" },
];

export default function GalleryTab() {
  const { gallery, setGallery } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("Tất cả");

  const filtered = filterCat === "Tất cả" ? gallery : gallery.filter((g) => g.category === filterCat);

  const openAdd = useCallback(() => {
    setEditId(null);
    setFormValues({ id: `g${Date.now()}`, src: "", title: "", category: "Hoạt động lớp", date: new Date().toISOString().slice(0, 10) });
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item: GalleryImage) => {
    setEditId(item.id);
    setFormValues({ ...item });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const updated = formValues as unknown as GalleryImage;
    if (editId) {
      setGallery(gallery.map((g) => (g.id === editId ? updated : g)));
    } else {
      setGallery([updated, ...gallery]);
    }
    setModalOpen(false);
  }, [editId, formValues, gallery, setGallery]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      setGallery(gallery.filter((g) => g.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, gallery, setGallery]);

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {galleryCategories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{
              padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: filterCat === cat ? 600 : 400,
              background: filterCat === cat ? "var(--color-primary)" : "var(--color-bg-secondary)",
              color: filterCat === cat ? "#fff" : "var(--color-text-secondary)",
              border: "1px solid " + (filterCat === cat ? "var(--color-primary)" : "var(--color-border)"),
              cursor: "pointer",
            }}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          <Plus style={{ width: 16, height: 16 }} /> Thêm ảnh
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)" }}>
          <ImageIcon style={{ width: 40, height: 40, opacity: 0.3, marginBottom: 8 }} />
          <div>Chưa có ảnh nào</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {filtered.map((img) => (
            <div key={img.id} style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden", background: "var(--color-card)" }}>
              <div style={{ position: "relative", paddingBottom: "70%", background: "var(--color-bg-secondary)" }}>
                <img src={img.src} alt={img.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.title}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginTop: 2 }}>{img.category} · {img.date}</div>
              </div>
              <div style={{ display: "flex", borderTop: "1px solid var(--color-border)" }}>
                <button onClick={() => openEdit(img)} style={{ flex: 1, padding: 6, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <Pencil style={{ width: 11, height: 11 }} /> Sửa
                </button>
                <button onClick={() => setDeleteId(img.id)} style={{ flex: 1, padding: 6, border: "none", background: "transparent", cursor: "pointer", color: "#ef4444", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <Trash2 style={{ width: 11, height: 11 }} /> Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>{filtered.length}/{gallery.length} ảnh</div>

      <FormModal open={modalOpen} title={editId ? "Sửa ảnh" : "Thêm ảnh mới"} fields={formFields} values={formValues} onChange={(k, v) => setFormValues({ ...formValues, [k]: v })} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      <ConfirmDialog open={!!deleteId} title="Xoá ảnh" message="Xoá ảnh này khỏi thư viện?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}
