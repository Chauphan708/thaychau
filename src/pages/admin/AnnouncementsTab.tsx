// src/pages/admin/AnnouncementsTab.tsx — CRUD Bảng tin
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { FormField } from "@/components/admin/FormModal";
import type { Announcement } from "@/data/announcements";

const formFields: FormField[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "summary", label: "Tóm tắt", type: "textarea", required: true },
  { key: "date", label: "Ngày", type: "date", required: true },
  { key: "tag", label: "Loại", type: "select", required: true, options: [
    { value: "urgent", label: "🔴 Khẩn cấp" },
    { value: "info", label: "🔵 Thông tin" },
    { value: "event", label: "🟢 Sự kiện" },
  ]},
];

const tagColors: Record<string, { bg: string; color: string; label: string }> = {
  urgent: { bg: "#fef2f2", color: "#ef4444", label: "Khẩn cấp" },
  info: { bg: "#eff6ff", color: "#2563eb", label: "Thông tin" },
  event: { bg: "#f0fdf4", color: "#16a34a", label: "Sự kiện" },
};

export default function AnnouncementsTab() {
  const { announcements, setAnnouncements } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = useCallback(() => {
    setEditId(null);
    setFormValues({ id: `a${Date.now()}`, title: "", summary: "", date: new Date().toISOString().slice(0, 10), tag: "info" });
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item: Announcement) => {
    setEditId(item.id);
    setFormValues({ ...item });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const updated = formValues as unknown as Announcement;
    if (editId) {
      setAnnouncements(announcements.map((a) => (a.id === editId ? updated : a)));
    } else {
      setAnnouncements([updated, ...announcements]);
    }
    setModalOpen(false);
  }, [editId, formValues, announcements, setAnnouncements]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      setAnnouncements(announcements.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, announcements, setAnnouncements]);

  return (
    <>
      <DataTable
        columns={[
          { key: "tag", label: "Loại", width: 90, render: (r) => {
            const tag = tagColors[(r as unknown as Announcement).tag] ?? tagColors.info;
            return <span style={{ padding: "2px 10px", borderRadius: 99, background: tag.bg, color: tag.color, fontSize: 11, fontWeight: 600 }}>{tag.label}</span>;
          }},
          { key: "title", label: "Tiêu đề", render: (r) => (
            <div>
              <div style={{ fontWeight: 600 }}>{(r as unknown as Announcement).title}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{(r as unknown as Announcement).summary.slice(0, 80)}</div>
            </div>
          )},
          { key: "date", label: "Ngày", width: 110 },
        ]}
        data={announcements as unknown as Record<string, unknown>[]}
        getKey={(r) => (r as unknown as Announcement).id}
        searchKeys={["title", "summary"]}
        onAdd={openAdd}
        onEdit={(r) => openEdit(r as unknown as Announcement)}
        onDelete={(r) => setDeleteId((r as unknown as Announcement).id)}
        addLabel="Thêm Thông báo"
      />

      <FormModal
        open={modalOpen}
        title={editId ? "Sửa Thông báo" : "Thêm Thông báo mới"}
        fields={formFields}
        values={formValues}
        onChange={(k, v) => setFormValues({ ...formValues, [k]: v })}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <ConfirmDialog open={!!deleteId} title="Xoá Thông báo" message="Bạn có chắc muốn xoá thông báo này?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}
