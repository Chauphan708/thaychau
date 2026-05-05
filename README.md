# 🏫 Teacher Portfolio CMS (v2)

Hệ thống Website Hồ sơ Giáo viên chuyên nghiệp tích hợp Admin CMS lấy cảm hứng từ WordPress và Google Sites.

## ✨ Tính năng nổi bật
*   **👤 Hồ sơ chuyên nghiệp:** Bio, triết lý giáo dục, kỹ năng, chứng chỉ và cột mốc sự nghiệp.
*   **📚 Kho học liệu:** Quản lý tài liệu (PDF, PPT, Video) với bộ lọc môn học và khối lớp.
*   **🌟 Gương mặt vàng:** Vinh danh học sinh tiêu biểu.
*   **📢 Bảng tin & Phụ huynh:** Cập nhật thông báo và thời khóa biểu trực tuyến.
*   **🌐 Trang con tùy biến:** Tạo không giới hạn các trang con bằng URL, Embed hoặc HTML.
*   **🎨 Tùy biến giao diện:** Thay đổi màu sắc chủ đạo, chế độ Dark Mode ngay trong Admin.
*   **💾 Lưu trữ Supabase:** Dữ liệu được đồng bộ trực tuyến, bảo mật và ổn định.

## 🚀 Hướng dẫn cài đặt

### 1. Chuẩn bị Database (Supabase)
Dự án sử dụng Supabase để lưu trữ dữ liệu. Bạn cần:
1. Tạo một dự án mới trên [Supabase](https://supabase.com).
2. Mở **SQL Editor** trong Supabase Dashboard.
3. Copy và chạy nội dung tệp `cms_schema.sql` trong thư mục gốc của dự án này để tạo các bảng cần thiết.

### 2. Cấu hình Biến môi trường
1. Tạo tệp `.env` dựa trên tệp `.env.example`.
2. Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` từ mục **Project Settings > API** trong Supabase.

### 3. Cài đặt và Chạy cục bộ
```bash
# Cài đặt thư viện
npm install

# Chạy ở chế độ phát triển
npm run dev
```

### 4. Đăng nhập Admin
Truy cập đường dẫn `/admin` trên trình duyệt.
*   **Mã PIN mặc định:** `thaychau`

## 🌍 Triển khai Online (Deploy)
Dự án đã được cấu hình sẵn cho **Vercel**. Bạn có thể deploy nhanh bằng cách:
1. Đẩy mã nguồn lên GitHub.
2. Kết nối GitHub với Vercel Dashboard.
3. Thêm các biến môi trường (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) vào phần Settings trên Vercel.

---
*Phát triển bởi Antigravity AI Coding Assistant.*
