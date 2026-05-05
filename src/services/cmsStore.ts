// src/services/cmsStore.ts — CRUD helpers cho CMS data (site_data + custom_pages)
import { supabase } from "./supabaseClient";

// ============================================================
// site_data: key-value store dùng JSONB
// ============================================================

/** Đọc 1 section từ site_data */
export async function loadSection<T>(id: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_data")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[CMS] loadSection("${id}") failed:`, error.message);
    return null;
  }
  return (data?.data as T) ?? null;
}

/** Ghi 1 section vào site_data (upsert) */
export async function saveSection<T>(id: string, payload: T): Promise<boolean> {
  const { error } = await supabase
    .from("site_data")
    .upsert({ id, data: payload, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) {
    console.error(`[CMS] saveSection("${id}") failed:`, error.message);
    return false;
  }
  return true;
}

/** Đọc tất cả sections cùng lúc */
export async function loadAllSections(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from("site_data").select("id, data");

  if (error) {
    console.error("[CMS] loadAllSections failed:", error.message);
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const row of data ?? []) {
    result[row.id] = row.data;
  }
  return result;
}

// ============================================================
// custom_pages: Trang con (URL / Embed / HTML)
// ============================================================

export interface CustomPageRow {
  id: string;
  title: string;
  slug: string;
  parent_slug: string | null;
  content_type: "url" | "embed" | "html";
  content: string;
  menu_order: number;
  visible: boolean;
  icon: string;
  created_at: string;
  updated_at: string;
}

export async function loadCustomPages(): Promise<CustomPageRow[]> {
  const { data, error } = await supabase
    .from("custom_pages")
    .select("*")
    .order("menu_order", { ascending: true });

  if (error) {
    console.error("[CMS] loadCustomPages failed:", error.message);
    return [];
  }
  return (data as CustomPageRow[]) ?? [];
}

export async function saveCustomPage(
  page: Omit<CustomPageRow, "id" | "created_at" | "updated_at"> & { id?: string },
): Promise<CustomPageRow | null> {
  const now = new Date().toISOString();

  if (page.id) {
    // Update
    const { data, error } = await supabase
      .from("custom_pages")
      .update({ ...page, updated_at: now })
      .eq("id", page.id)
      .select()
      .single();

    if (error) {
      console.error("[CMS] updateCustomPage failed:", error.message);
      return null;
    }
    return data as CustomPageRow;
  } else {
    // Insert
    const { id: _unused, ...rest } = page;
    void _unused;
    const { data, error } = await supabase
      .from("custom_pages")
      .insert({ ...rest, created_at: now, updated_at: now })
      .select()
      .single();

    if (error) {
      console.error("[CMS] insertCustomPage failed:", error.message);
      return null;
    }
    return data as CustomPageRow;
  }
}

export async function deleteCustomPage(id: string): Promise<boolean> {
  const { error } = await supabase.from("custom_pages").delete().eq("id", id);
  if (error) {
    console.error("[CMS] deleteCustomPage failed:", error.message);
    return false;
  }
  return true;
}

// ============================================================
// Export / Import JSON (backup)
// ============================================================

export async function exportAllData(): Promise<string> {
  const sections = await loadAllSections();
  const pages = await loadCustomPages();
  return JSON.stringify({ sections, customPages: pages, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importAllData(json: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(json) as {
      sections?: Record<string, unknown>;
      customPages?: CustomPageRow[];
    };

    // Import sections
    if (parsed.sections) {
      for (const [id, data] of Object.entries(parsed.sections)) {
        await saveSection(id, data);
      }
    }

    // Import custom pages (delete all, re-insert)
    if (parsed.customPages) {
      // Clear existing
      await supabase.from("custom_pages").delete().neq("id", "");
      for (const page of parsed.customPages) {
        const { id: _id, created_at: _c, updated_at: _u, ...rest } = page;
        await saveCustomPage(rest);
      }
    }

    return true;
  } catch (err) {
    console.error("[CMS] importAllData failed:", err);
    return false;
  }
}
