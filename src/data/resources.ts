// src/data/resources.ts — GV thêm/bớt tài liệu ở đây

export interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  grade: number;
  type: "pdf" | "ppt" | "video" | "doc" | "link";
  description: string;
  driveUrl: string; // Google Drive link
  date: string; // YYYY-MM-DD
  featured?: boolean;
}

export const resources: ResourceItem[] = [
  {
    id: "r1",
    title: "Bài giảng Toán — Phép nhân có nhớ (Lớp 3)",
    subject: "Toán",
    grade: 3,
    type: "ppt",
    description: "Slide bài giảng phép nhân có nhớ với hình ảnh minh họa sinh động, kèm bài tập vận dụng.",
    driveUrl: "https://drive.google.com/file/d/example1/view",
    date: "2026-04-15",
    featured: true,
  },
  {
    id: "r2",
    title: "Đề kiểm tra giữa kỳ 2 — Tiếng Việt (Lớp 3)",
    subject: "Tiếng Việt",
    grade: 3,
    type: "pdf",
    description: "Đề kiểm tra giữa kỳ 2 gồm đọc hiểu, chính tả và tập làm văn. Có đáp án kèm theo.",
    driveUrl: "https://drive.google.com/file/d/example2/view",
    date: "2026-04-10",
    featured: true,
  },
  {
    id: "r3",
    title: "Video — Thí nghiệm Khoa học: Sự nảy mầm",
    subject: "TN&XH",
    grade: 3,
    type: "video",
    description: "Video hướng dẫn thí nghiệm quan sát sự nảy mầm của hạt đậu trong 7 ngày.",
    driveUrl: "https://drive.google.com/file/d/example3/view",
    date: "2026-03-20",
  },
  {
    id: "r4",
    title: "Phiếu bài tập — Bảng nhân 6, 7, 8",
    subject: "Toán",
    grade: 3,
    type: "pdf",
    description: "Phiếu bài tập rèn kỹ năng bảng nhân 6, 7, 8 với nhiều dạng bài đa dạng.",
    driveUrl: "https://drive.google.com/file/d/example4/view",
    date: "2026-03-15",
  },
  {
    id: "r5",
    title: "Giáo án — Bài Đạo đức: Biết ơn thầy cô",
    subject: "Đạo đức",
    grade: 3,
    type: "doc",
    description: "Giáo án chi tiết bài Đạo đức với hoạt động nhóm và liên hệ thực tế.",
    driveUrl: "https://drive.google.com/file/d/example5/view",
    date: "2026-03-01",
  },
  {
    id: "r6",
    title: "Slide bài giảng — Tập đọc: Hai Bà Trưng",
    subject: "Tiếng Việt",
    grade: 3,
    type: "ppt",
    description: "Bài giảng tập đọc kèm hình ảnh lịch sử và câu hỏi đọc hiểu.",
    driveUrl: "https://drive.google.com/file/d/example6/view",
    date: "2026-02-25",
  },
  {
    id: "r7",
    title: "Đề ôn tập cuối năm — Toán lớp 4",
    subject: "Toán",
    grade: 4,
    type: "pdf",
    description: "Bộ đề ôn tập cuối năm gồm 5 đề kèm đáp án chi tiết.",
    driveUrl: "https://drive.google.com/file/d/example7/view",
    date: "2026-04-20",
    featured: true,
  },
  {
    id: "r8",
    title: "Bài giảng E-Learning — TN&XH: Hệ mặt trời",
    subject: "TN&XH",
    grade: 4,
    type: "link",
    description: "Bài giảng tương tác về hệ mặt trời trên nền tảng E-Learning của trường.",
    driveUrl: "https://elearning.example.com/lesson/solar-system",
    date: "2026-02-10",
  },
  {
    id: "r9",
    title: "Phiếu bài tập — Luyện viết chữ đẹp (Lớp 1)",
    subject: "Tiếng Việt",
    grade: 1,
    type: "pdf",
    description: "Phiếu luyện viết chữ cái theo mẫu, phù hợp cho học sinh lớp 1.",
    driveUrl: "https://drive.google.com/file/d/example9/view",
    date: "2026-01-15",
  },
];
