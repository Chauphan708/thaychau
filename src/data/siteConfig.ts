// src/data/siteConfig.ts — GV chỉ cần sửa file NÀY để tuỳ chỉnh website
export const siteConfig = {
  // === THÔNG TIN CÁ NHÂN ===
  teacherName: "Nguyễn Văn A",
  school: "Trường Tiểu học Trung An 1",
  district: "Thốt Nốt, TP. Cần Thơ",
  avatar: "", // Để trống → dùng avatar mặc định
  quote: "\"Giáo dục không phải là đổ đầy một cái bình, mà là thắp sáng một ngọn lửa.\"",
  quoteAuthor: "W.B. Yeats",
  email: "teacher@cantho.edu.vn",
  phone: "0912 345 678",
  zaloLink: "https://zalo.me/0912345678",
  facebookLink: "https://facebook.com",

  // === GIAO DIỆN ===
  primaryColor: "#2563eb",
  enableDarkMode: true,

  // === BẬT/TẮT TRANG ===
  pages: {
    home: true,
    profile: true,
    resources: true,
    parents: true,
    gallery: true,
    tools: false,
    blog: false,
  },

  // === TÍCH HỢP HỆ THỐNG ===
  integrations: {
    openlms: { enabled: true, url: "https://openlms.vercel.app", label: "OpenLMS — Thi & Kiểm tra" },
    elearning: { enabled: false, url: "", label: "E-Learning" },
    googleDrive: { enabled: false, rootFolderId: "" },
  },

  // === AI TRỢ LÝ ===
  ai: {
    enabled: true,
    tone: "friendly" as "friendly" | "formal",
    studentLevel: "basic" as "basic" | "advanced" | "mixed",
    methods: ["gamification", "group-work"] as string[],
    autoCV2345: true,
    rememberComments: true,
  },

  // === KHO HỌC LIỆU ===
  gradeLevels: [1, 2, 3, 4, 5] as number[],
  subjects: ["Toán", "Tiếng Việt", "TN&XH", "Đạo đức", "Khác"],

  // === ĐẾM NGƯỢC ===
  countdown: {
    enabled: true,
    label: "Còn bao lâu nữa đến hè?",
    targetDate: "2026-05-31",
  },
};

export type SiteConfig = typeof siteConfig;
