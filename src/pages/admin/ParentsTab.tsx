// src/pages/admin/ParentsTab.tsx — CRUD Góc Phụ huynh (TKB + Thông báo PH)
import { useState, useCallback } from "react";
import { useSiteData } from "@/context/SiteContext";
import FormModal from "@/components/admin/FormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import type { FormField } from "@/components/admin/FormModal";
import type { ParentNotice } from "@/data/weeklySchedule";
import { Plus, Trash2 } from "lucide-react";

// ============================================================
// Thời khoá biểu — Editable Table
// ============================================================

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const dayLabels: Record<string, string> = { monday: "Thứ 2", tuesday: "Thứ 3", wednesday: "Thứ 4", thursday: "Thứ 5", friday: "Thứ 6" };

function ScheduleEditor() {
  const { weeklySchedule, setWeeklySchedule } = useSiteData();

  const updateCell = (rowIdx: number, key: string, value: string) => {
    const updated = weeklySchedule.map((row, i) =>
      i === rowIdx ? { ...row, [key]: value } : row,
    );
    setWeeklySchedule(updated);
  };

  const addRow = () => {
    setWeeklySchedule([...weeklySchedule, { time: "", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "" }]);
  };

  const deleteRow = (idx: number) => {
    setWeeklySchedule(weeklySchedule.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ background: "var(--color-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>📅 Thời khoá biểu</h3>
        <button onClick={addRow} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
          <Plus style={{ width: 14, height: 14 }} /> Thêm tiết
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)" }}>
              <th style={thStyle}>Thời gian</th>
              {days.map((d) => <th key={d} style={thStyle}>{dayLabels[d]}</th>)}
              <th style={{ ...thStyle, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((row, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--color-border)" }}>
                <td style={tdStyle}>
                  <input value={row.time} onChange={(e) => updateCell(i, "time", e.target.value)} style={cellInput} placeholder="7:00 – 7:35" />
                </td>
                {days.map((d) => (
                  <td key={d} style={tdStyle}>
                    <input value={row[d]} onChange={(e) => updateCell(i, d, e.target.value)} style={cellInput} />
                  </td>
                ))}
                <td style={tdStyle}>
                  <button onClick={() => deleteRow(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Thông báo Phụ huynh — CRUD
// ============================================================

const noticeFields: FormField[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "content", label: "Nội dung", type: "textarea", required: true },
  { key: "date", label: "Ngày", type: "date", required: true },
  { key: "important", label: "Quan trọng", type: "toggle" },
];

function NoticesEditor() {
  const { parentNotices, setParentNotices } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = useCallback(() => {
    setEditId(null);
    setFormValues({ id: `pn${Date.now()}`, title: "", content: "", date: new Date().toISOString().slice(0, 10), important: false });
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item: ParentNotice) => {
    setEditId(item.id);
    setFormValues({ ...item });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const updated = formValues as unknown as ParentNotice;
    if (editId) {
      setParentNotices(parentNotices.map((n) => (n.id === editId ? updated : n)));
    } else {
      setParentNotices([updated, ...parentNotices]);
    }
    setModalOpen(false);
  }, [editId, formValues, parentNotices, setParentNotices]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      setParentNotices(parentNotices.filter((n) => n.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, parentNotices, setParentNotices]);

  return (
    <>
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>📣 Thông báo cho Phụ huynh</h3>
      <DataTable
        columns={[
          { key: "important", label: "!", width: 30, render: (r) => (r as unknown as ParentNotice).important ? "🔴" : "" },
          { key: "title", label: "Tiêu đề", render: (r) => (
            <div>
              <div style={{ fontWeight: 600 }}>{(r as unknown as ParentNotice).title}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{(r as unknown as ParentNotice).content.slice(0, 80)}</div>
            </div>
          )},
          { key: "date", label: "Ngày", width: 100 },
        ]}
        data={parentNotices as unknown as Record<string, unknown>[]}
        getKey={(r) => (r as unknown as ParentNotice).id}
        searchKeys={["title", "content"]}
        onAdd={openAdd}
        onEdit={(r) => openEdit(r as unknown as ParentNotice)}
        onDelete={(r) => setDeleteId((r as unknown as ParentNotice).id)}
        addLabel="Thêm Thông báo"
      />

      <FormModal open={modalOpen} title={editId ? "Sửa Thông báo PH" : "Thêm Thông báo PH"} fields={noticeFields} values={formValues} onChange={(k, v) => setFormValues({ ...formValues, [k]: v })} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      <ConfirmDialog open={!!deleteId} title="Xoá Thông báo" message="Xoá thông báo này?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function ParentsTab() {
  return (
    <div>
      <ScheduleEditor />
      <NoticesEditor />
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "8px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--color-text-secondary)", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "4px 6px" };
const cellInput: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 12, outline: "none", fontFamily: "inherit" };
