-- SQL Migration: Tạo bảng CMS cho Teacher Portfolio
-- Chạy trong Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Bảng site_data: key-value store dùng JSONB
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng custom_pages: Trang con tự do
CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_slug TEXT,
  content_type TEXT NOT NULL DEFAULT 'url',
  content TEXT NOT NULL DEFAULT '',
  menu_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  icon TEXT DEFAULT '📄',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS: Cho phép đọc public, ghi không giới hạn (auth bằng PIN ở client)
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

-- Đọc: Tất cả mọi người
CREATE POLICY "site_data_public_read" ON site_data FOR SELECT USING (true);
CREATE POLICY "custom_pages_public_read" ON custom_pages FOR SELECT USING (true);

-- Ghi: Cho phép tất cả (vì auth bằng PIN ở client-side)
CREATE POLICY "site_data_public_write" ON site_data FOR INSERT WITH CHECK (true);
CREATE POLICY "site_data_public_update" ON site_data FOR UPDATE USING (true);
CREATE POLICY "site_data_public_delete" ON site_data FOR DELETE USING (true);

CREATE POLICY "custom_pages_public_write" ON custom_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "custom_pages_public_update" ON custom_pages FOR UPDATE USING (true);
CREATE POLICY "custom_pages_public_delete" ON custom_pages FOR DELETE USING (true);

-- 4. Index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_parent ON custom_pages(parent_slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_order ON custom_pages(menu_order);
