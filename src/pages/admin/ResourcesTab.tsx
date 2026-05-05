// src/pages/admin/ResourcesTab.tsx — CRUD Kho Học liệu
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { ResourceItem } from "@/data/resources";
import { FileText, FileSpreadsheet, Video, Link as LinkIcon, File } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText style={{ width: 14, height: 14, color: "#ef4444" }} />,
  ppt: <FileSpreadsheet style={{ width: 14, height: 14, color: "#f59e0b" }} />,
  video: <Video style={{ width: 14, height: 14, color: "#8b5cf6" }} />,
  doc: <File style={{ width: 14, height: 14, color: "#2563eb" }} />,
  link: <LinkIcon style={{ width: 14, height: 14, color: "#16a34a" }} />,
};

const formFields: FormField[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subject", label: "Môn", type: "select", options: [
    { value: "Toán", label: "Toán" }, { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "TN&XH", label: "TN&XH" }, { value: "Đạo đức", label: "Đạo đức" }, { value: "Khác", label: "Khác" },
  ], required: true },
  { key: "grade", label: "Lớp", type: "number", min: 1, max: 5 },
  { key: "type", label: "Loại file", type: "select", options: [
    { value: "pdf", label: "PDF" }, { value: "ppt", label: "PowerPoint" },
    { value: "video", label: "Video" }, { value: "doc", label: "Word" }, { value: "link", label: "Link" },
  ], required: true },
  { key: "description", label: "Mô tả", type: "textarea" },
  { key: "driveUrl", label: "URL (Google Drive / Link)", type: "url", required: true },
  { key: "date", label: "Ngày", type: "date" },
  { key: "featured", label: "Nổi bật", type: "toggle" },
];

export default function ResourcesTab() {
  const { resources, setResources } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = useCallback(() => {
    setEditId(null);
    setFormValues({ id: `r${Date.now()}`, title: "", subject: "Toán", grade: 3, type: "pdf", description: "", driveUrl: "", date: new Date().toISOString().slice(0, 10), featured: false });
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item: ResourceItem) => {
    setEditId(item.id);
    setFormValues({ ...item });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const updated = formValues as unknown as ResourceItem;
    if (editId) {
      setResources(resources.map((r) => (r.id === editId ? updated : r)));
    } else {
      setResources([...resources, updated]);
    }
    setModalOpen(false);
  }, [editId, formValues, resources, setResources]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      setResources(resources.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, resources, setResources]);

  return (
    <>
      <DataTable
        columns={[
          { key: "type", label: "Loại", width: 50, render: (r) => typeIcons[(r as ResourceItem).type] ?? null },
          { key: "title", label: "Tiêu đề", render: (r) => (
            <div>
              <div style={{ fontWeight: 600 }}>{(r as ResourceItem).title}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
                {(r as ResourceItem).description.slice(0, 80)}
              </div>
            </div>
          )},
          { key: "subject", label: "Môn", width: 90, render: (r) => (
            <span style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-primary)", color: "#fff", fontSize: 11, fontWeight: 600 }}>
              {(r as ResourceItem).subject}
            </span>
          )},
          { key: "grade", label: "Lớp", width: 50 },
          { key: "date", label: "Ngày", width: 100 },
          { key: "featured", label: "⭐", width: 40, render: (r) => (r as ResourceItem).featured ? "⭐" : "" },
        ]}
        data={resources as unknown as Record<string, unknown>[]}
        getKey={(r) => (r as unknown as ResourceItem).id}
        searchKeys={["title", "subject", "description"]}
        onAdd={openAdd}
        onEdit={(r) => openEdit(r as unknown as ResourceItem)}
        onDelete={(r) => setDeleteId((r as unknown as ResourceItem).id)}
        addLabel="Thêm Học liệu"
      />

      <FormModal
        open={modalOpen}
        title={editId ? "Chỉnh sửa Học liệu" : "Thêm Học liệu mới"}
        fields={formFields}
        values={formValues}
        onChange={(k, v) => setFormValues({ ...formValues, [k]: v })}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá Học liệu"
        message="Bạn có chắc muốn xoá tài liệu này? Thao tác không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
