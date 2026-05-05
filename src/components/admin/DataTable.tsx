// src/components/admin/DataTable.tsx — Bảng dữ liệu có search + thao tác
import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: number | string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getKey: (item: T) => string;
  searchKeys?: string[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  addLabel?: string;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, getKey, searchKeys, onAdd, onEdit, onDelete, addLabel = "Thêm mới", emptyMessage = "Chưa có dữ liệu",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = search && searchKeys
    ? data.filter((item) => searchKeys.some((k) => String(item[k] ?? "").toLowerCase().includes(search.toLowerCase())))
    : data;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {searchKeys && (
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--color-text-secondary)" }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}
            />
          </div>
        )}
        {onAdd && (
          <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-sm)", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            <Plus style={{ width: 16, height: 16 }} /> {addLabel}
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>{emptyMessage}</div>
      ) : (
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-bg-secondary)" }}>
                {columns.map((col) => (
                  <th key={col.key} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--color-text-secondary)", textAlign: "left", width: col.width }}>
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--color-text-secondary)", textAlign: "right", width: 100 }}>Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={getKey(item)} style={{ borderTop: "1px solid var(--color-border)", transition: "background 100ms" }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: "10px 14px", fontSize: 13, color: "var(--color-text)" }}>
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                        {onEdit && (
                          <button onClick={() => onEdit(item)} title="Sửa" style={actionBtn}>
                            <Pencil style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)} title="Xoá" style={{ ...actionBtn, color: "#ef4444" }}>
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
        {filtered.length}/{data.length} mục
      </div>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: "6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
  background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", display: "flex", alignItems: "center",
};
