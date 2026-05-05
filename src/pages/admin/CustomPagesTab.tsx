// src/pages/admin/CustomPagesTab.tsx — CRUD Trang con (URL/Embed/HTML)
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { CustomPageRow } from "@/services/cmsStore";
import { saveCustomPage, deleteCustomPage } from "@/services/cmsStore";
import { Plus, Pencil, Trash2, Globe, ExternalLink, Code, FileCode, GripVertical, Eye, EyeOff } from "lucide-react";

const contentTypeLabels: Record<string, { icon: React.ReactNode; label: string }> = {
  url: { icon: <ExternalLink style={{ width: 14, height: 14 }} />, label: "Link URL" },
  embed: { icon: <Code style={{ width: 14, height: 14 }} />, label: "Embed" },
  html: { icon: <FileCode style={{ width: 14, height: 14 }} />, label: "HTML" },
};

export default function CustomPagesTab() {
  const { customPages, setCustomPages } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Build parent options for dropdown
  const parentOptions = [
    { value: "", label: "— Không (top-level) —" },
    ...customPages.filter((p) => !p.parent_slug).map((p) => ({ value: p.slug, label: `${p.icon} ${p.title}` })),
  ];

  const formFields: FormField[] = [
    { key: "title", label: "Tiêu đề", type: "text", required: true, placeholder: "Tên trang" },
    { key: "slug", label: "Slug (URL)", type: "text", required: true, placeholder: "ten-trang" },
    { key: "parent_slug", label: "Trang cha", type: "select", options: parentOptions },
    { key: "content_type", label: "Loại nội dung", type: "select", required: true, options: [
      { value: "url", label: "🔗 Link URL (mở tab mới)" },
      { value: "embed", label: "📦 Embed (nhúng iframe)" },
      { value: "html", label: "📝 HTML (nhập mã)" },
    ]},
    { key: "content", label: "Nội dung", type: "textarea", required: true, placeholder: "URL / Mã embed / HTML..." },
    { key: "icon", label: "Icon (emoji)", type: "text", placeholder: "📄" },
    { key: "menu_order", label: "Thứ tự menu", type: "number", min: 0 },
    { key: "visible", label: "Hiển thị trên menu", type: "toggle" },
  ];

  const openAdd = useCallback(() => {
    setEditId(null);
    setFormValues({ title: "", slug: "", parent_slug: "", content_type: "url", content: "", icon: "📄", menu_order: customPages.length, visible: true });
    setModalOpen(true);
  }, [customPages.length]);

  const openEdit = useCallback((page: CustomPageRow) => {
    setEditId(page.id);
    setFormValues({ ...page, parent_slug: page.parent_slug ?? "" });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    const payload = {
      ...formValues,
      parent_slug: (formValues.parent_slug as string) || null,
      id: editId ?? undefined,
    } as Parameters<typeof saveCustomPage>[0];

    const result = await saveCustomPage(payload);
    if (result) {
      if (editId) {
        setCustomPages(customPages.map((p) => (p.id === editId ? result : p)));
      } else {
        setCustomPages([...customPages, result]);
      }
    } else {
      // Fallback: update local state without Supabase
      const localPage: CustomPageRow = {
        id: editId ?? `local_${Date.now()}`,
        title: formValues.title as string,
        slug: formValues.slug as string,
        parent_slug: (formValues.parent_slug as string) || null,
        content_type: formValues.content_type as "url" | "embed" | "html",
        content: formValues.content as string,
        menu_order: formValues.menu_order as number,
        visible: formValues.visible as boolean,
        icon: formValues.icon as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (editId) {
        setCustomPages(customPages.map((p) => (p.id === editId ? localPage : p)));
      } else {
        setCustomPages([...customPages, localPage]);
      }
    }
    setModalOpen(false);
  }, [editId, formValues, customPages, setCustomPages]);

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      await deleteCustomPage(deleteId);
      setCustomPages(customPages.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, customPages, setCustomPages]);

  // Group pages: top-level + children
  const topLevel = customPages.filter((p) => !p.parent_slug).sort((a, b) => a.menu_order - b.menu_order);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
          Tạo trang con bằng cách gắn URL, nhúng iframe, hoặc nhập HTML. Hỗ trợ phân cấp menu cha-con.
        </p>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          <Plus style={{ width: 16, height: 16 }} /> Tạo trang
        </button>
      </div>

      {customPages.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)" }}>
          <Globe style={{ width: 40, height: 40, opacity: 0.3, marginBottom: 8 }} />
          <div style={{ fontSize: 14 }}>Chưa có trang con nào</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Bấm "Tạo trang" để bắt đầu</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topLevel.map((page) => {
            const children = customPages.filter((p) => p.parent_slug === page.slug).sort((a, b) => a.menu_order - b.menu_order);
            return (
              <div key={page.id}>
                <PageRow page={page} onEdit={openEdit} onDelete={(p) => setDeleteId(p.id)} />
                {children.length > 0 && (
                  <div style={{ marginLeft: 28, borderLeft: "2px solid var(--color-border)", paddingLeft: 12, display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                    {children.map((child) => (
                      <PageRow key={child.id} page={child} onEdit={openEdit} onDelete={(p) => setDeleteId(p.id)} isChild />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* Orphaned pages (parent_slug set but parent doesn't exist) */}
          {customPages.filter((p) => p.parent_slug && !topLevel.some((t) => t.slug === p.parent_slug)).map((page) => (
            <PageRow key={page.id} page={page} onEdit={openEdit} onDelete={(p) => setDeleteId(p.id)} />
          ))}
        </div>
      )}

      <FormModal open={modalOpen} title={editId ? "Sửa trang con" : "Tạo trang con mới"} fields={formFields} values={formValues} onChange={(k, v) => setFormValues({ ...formValues, [k]: v })} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      <ConfirmDialog open={!!deleteId} title="Xoá trang con" message="Xoá trang này khỏi website? Các trang con (nếu có) sẽ mất liên kết." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}

function PageRow({ page, onEdit, onDelete, isChild }: { page: CustomPageRow; onEdit: (p: CustomPageRow) => void; onDelete: (p: CustomPageRow) => void; isChild?: boolean }) {
  const ct = contentTypeLabels[page.content_type] ?? contentTypeLabels.url;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", borderRadius: "var(--radius-sm)",
      border: "1px solid var(--color-border)", background: "var(--color-card)",
      fontSize: 13,
    }}>
      <span style={{ fontSize: isChild ? 14 : 18 }}>{page.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {page.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", display: "flex", gap: 8, marginTop: 2 }}>
          <span>/page/{page.slug}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{ct.icon} {ct.label}</span>
        </div>
      </div>
      <span title={page.visible ? "Đang hiển thị" : "Đã ẩn"} style={{ color: page.visible ? "var(--color-secondary)" : "var(--color-text-secondary)" }}>
        {page.visible ? <Eye style={{ width: 16, height: 16 }} /> : <EyeOff style={{ width: 16, height: 16 }} />}
      </span>
      <button onClick={() => onEdit(page)} style={actionBtn}><Pencil style={{ width: 13, height: 13 }} /></button>
      <button onClick={() => onDelete(page)} style={{ ...actionBtn, color: "#ef4444" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: 5, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
  background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", display: "flex", alignItems: "center",
};
