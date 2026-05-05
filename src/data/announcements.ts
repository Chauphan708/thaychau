// src/data/announcements.ts — GV thêm thông báo mới ở đây
export interface Announcement {
  id: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  tag: "urgent" | "info" | "event";
}

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Ôn tập kiểm tra cuối kỳ 2",
    summary: "Phụ huynh cho các em ôn tập Toán chương 4-5, Tiếng Việt tuần 28-34.",
    date: "2026-04-28",
    tag: "urgent",
  },
  {
    id: "2",
    title: "Chuẩn bị dụng cụ học tập tuần 33",
    summary: "Các em mang thêm giấy màu, keo dán cho tiết Thủ công ngày thứ 4.",
    date: "2026-04-27",
    tag: "info",
  },
  {
    id: "3",
    title: "Hoạt động ngoại khóa tháng 5",
    summary: "Lớp sẽ tổ chức tham quan Bảo tàng Cần Thơ vào ngày 10/05.",
    date: "2026-04-25",
    tag: "event",
  },
];
