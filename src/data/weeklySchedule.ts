// src/data/weeklySchedule.ts — GV cập nhật lịch tuần ở đây

export interface ScheduleSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

export const weeklySchedule: ScheduleSlot[] = [
  {
    time: "7:00 – 7:35",
    monday: "Chào cờ",
    tuesday: "Toán",
    wednesday: "Toán",
    thursday: "Toán",
    friday: "Toán",
  },
  {
    time: "7:40 – 8:15",
    monday: "Toán",
    tuesday: "Tiếng Việt",
    wednesday: "Tiếng Việt",
    thursday: "Tiếng Việt",
    friday: "Tiếng Việt",
  },
  {
    time: "8:20 – 8:55",
    monday: "Tiếng Việt",
    tuesday: "TN&XH",
    wednesday: "Đạo đức",
    thursday: "TN&XH",
    friday: "Thủ công",
  },
  {
    time: "9:15 – 9:50",
    monday: "Tiếng Việt",
    tuesday: "Thể dục",
    wednesday: "Mỹ thuật",
    thursday: "Âm nhạc",
    friday: "Tiếng Anh",
  },
  {
    time: "9:55 – 10:30",
    monday: "Sinh hoạt lớp",
    tuesday: "Tin học",
    wednesday: "Thể dục",
    thursday: "Tiếng Anh",
    friday: "SHL cuối tuần",
  },
];

// Thông báo dành cho phụ huynh
export interface ParentNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export const parentNotices: ParentNotice[] = [
  {
    id: "pn1",
    title: "Họp phụ huynh cuối năm học",
    content: "Kính mời quý phụ huynh tham dự buổi họp phụ huynh cuối năm học vào Thứ Bảy, ngày 15/05/2026 lúc 8:00 sáng tại phòng học lớp 3A1.",
    date: "2026-04-25",
    important: true,
  },
  {
    id: "pn2",
    title: "Lịch kiểm tra cuối kỳ 2",
    content: "Kiểm tra cuối kỳ 2 sẽ diễn ra từ ngày 12/05 đến 15/05/2026. Xin phụ huynh nhắc nhở con em ôn tập kỹ các môn Toán, Tiếng Việt, TN&XH.",
    date: "2026-04-22",
    important: true,
  },
  {
    id: "pn3",
    title: "Nộp sách vở cuối năm",
    content: "Học sinh nộp lại sách mượn thư viện trước ngày 20/05/2026. Phụ huynh kiểm tra và nhắc nhở con em.",
    date: "2026-04-20",
    important: false,
  },
  {
    id: "pn4",
    title: "Hoạt động ngoại khóa tháng 5",
    content: "Lớp sẽ tổ chức tham quan Bảo tàng TP. Cần Thơ vào ngày 08/05/2026. Phí tham gia: 50.000đ/em. Đăng ký với cô giáo trước 05/05.",
    date: "2026-04-18",
    important: false,
  },
];
