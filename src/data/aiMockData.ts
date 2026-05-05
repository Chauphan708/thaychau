// src/data/aiMockData.ts — Mock data cho AI modules (demo & fallback)

export interface MockStudent {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  className: string;
  avatar?: string;
  grades: Record<string, string>;
  behavior: string;
  notes: string;
  parentName: string;
  parentPhone: string;
}

export interface MockDocument {
  id: string;
  title: string;
  from: string;
  date: string;
  category: "incoming" | "report" | "template";
  status: "unread" | "read" | "processing";
  summary?: string;
  tags: string[];
}

export interface MockEmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  studentId?: string;
  status: "draft" | "sent";
  createdAt: string;
}

export interface MockLessonPlan {
  id: string;
  subject: string;
  grade: number;
  title: string;
  periods: number;
  content: string;
  layout: "1col" | "2col" | "3col";
  createdAt: string;
  driveFileId?: string;
}

// === MOCK STUDENTS (5 em) ===
export const mockStudents: MockStudent[] = [
  {
    id: "hs-001",
    name: "Nguyễn Minh Anh",
    gender: "Nữ",
    className: "3A1",
    grades: { "Toán": "Hoàn thành tốt", "Tiếng Việt": "Hoàn thành tốt", "TN&XH": "Hoàn thành tốt", "Đạo đức": "Tốt" },
    behavior: "Ngoan, chăm chỉ, hay giơ tay phát biểu.",
    notes: "Lớp trưởng, tích cực tham gia hoạt động ngoại khóa.",
    parentName: "Nguyễn Văn Hùng",
    parentPhone: "0912 345 001",
  },
  {
    id: "hs-002",
    name: "Trần Quốc Bảo",
    gender: "Nam",
    className: "3A1",
    grades: { "Toán": "Hoàn thành", "Tiếng Việt": "Chưa hoàn thành", "TN&XH": "Hoàn thành", "Đạo đức": "Đạt" },
    behavior: "Hay nói chuyện riêng, nhưng nhiệt tình giúp bạn.",
    notes: "Cần bồi dưỡng thêm Tiếng Việt, đọc còn chậm.",
    parentName: "Trần Thị Mai",
    parentPhone: "0912 345 002",
  },
  {
    id: "hs-003",
    name: "Lê Phương Linh",
    gender: "Nữ",
    className: "3A1",
    grades: { "Toán": "Hoàn thành tốt", "Tiếng Việt": "Hoàn thành tốt", "TN&XH": "Hoàn thành tốt", "Đạo đức": "Tốt" },
    behavior: "Xuất sắc, tự giác, giúp đỡ bạn bè.",
    notes: "Đạt giải 3 Violympic cấp huyện.",
    parentName: "Lê Văn Tâm",
    parentPhone: "0912 345 003",
  },
  {
    id: "hs-004",
    name: "Phạm Đức Huy",
    gender: "Nam",
    className: "3A1",
    grades: { "Toán": "Hoàn thành", "Tiếng Việt": "Hoàn thành", "TN&XH": "Hoàn thành", "Đạo đức": "Đạt" },
    behavior: "Trầm tính, ít tham gia hoạt động nhóm.",
    notes: "Hoàn cảnh khó khăn, ba mẹ đi làm xa. Ở với ông bà.",
    parentName: "Phạm Thị Lan (bà ngoại)",
    parentPhone: "0912 345 004",
  },
  {
    id: "hs-005",
    name: "Võ Thanh Tâm",
    gender: "Nam",
    className: "3A1",
    grades: { "Toán": "Hoàn thành tốt", "Tiếng Việt": "Hoàn thành", "TN&XH": "Hoàn thành tốt", "Đạo đức": "Tốt" },
    behavior: "Năng động, thích thể thao, đôi khi nghịch.",
    notes: "Đội trưởng đội bóng đá mini. Cần nhắc nhở nề nếp.",
    parentName: "Võ Minh Tuấn",
    parentPhone: "0912 345 005",
  },
];

// === MOCK DOCUMENTS ===
export const mockDocuments: MockDocument[] = [
  {
    id: "cv-001",
    title: "Công văn 1234/SGDDT — Hướng dẫn dạy học giữa học kỳ II",
    from: "Sở GD&ĐT Cần Thơ",
    date: "2026-04-15",
    category: "incoming",
    status: "unread",
    summary: "Hướng dẫn tổ chức kiểm tra đánh giá giữa HKII. Lưu ý: Đề kiểm tra phải bám sát chuẩn KT-KN, ma trận đề theo TT22.",
    tags: ["kiểm tra", "giữa kỳ", "quan trọng"],
  },
  {
    id: "cv-002",
    title: "Thông báo tổ chức Ngày hội đọc sách 23/4",
    from: "Ban Giám hiệu",
    date: "2026-04-10",
    category: "incoming",
    status: "read",
    summary: "Tổ chức ngày hội đọc sách nhân Ngày Sách VN. Mỗi lớp chuẩn bị 1 tiết mục biểu diễn + góc trưng bày sách.",
    tags: ["sự kiện", "đọc sách"],
  },
  {
    id: "cv-003",
    title: "Báo cáo chủ nhiệm tháng 4/2026",
    from: "GV tự soạn",
    date: "2026-04-20",
    category: "report",
    status: "processing",
    tags: ["báo cáo", "chủ nhiệm"],
  },
  {
    id: "cv-004",
    title: "Biểu mẫu đánh giá học sinh theo Thông tư 27",
    from: "Phòng GD&ĐT",
    date: "2026-03-01",
    category: "template",
    status: "read",
    summary: "Biểu mẫu nhận xét định kỳ theo TT27/2020. Gồm: Phẩm chất, Năng lực, Kết quả học tập.",
    tags: ["biểu mẫu", "TT27"],
  },
];

// === MOCK EMAIL DRAFTS ===
export const mockEmailDrafts: MockEmailDraft[] = [
  {
    id: "email-001",
    to: "Nguyễn Văn Hùng (PH Minh Anh)",
    subject: "Kết quả học tập giữa HKII — Nguyễn Minh Anh",
    body: "Kính gửi anh Hùng,\n\nTôi xin thông báo kết quả học tập giữa HKII của em Minh Anh. Em tiếp tục duy trì kết quả tốt ở tất cả các môn. Đặc biệt, em rất tích cực phát biểu và hỗ trợ các bạn.\n\nTrân trọng.",
    studentId: "hs-001",
    status: "draft",
    createdAt: "2026-04-25",
  },
  {
    id: "email-002",
    to: "Trần Thị Mai (PH Quốc Bảo)",
    subject: "Trao đổi về tình hình học tập — Trần Quốc Bảo",
    body: "Kính gửi chị Mai,\n\nTôi muốn trao đổi về tình hình học tập của em Bảo. Em đang gặp khó khăn ở môn Tiếng Việt, đặc biệt là kỹ năng đọc. Tôi đề xuất buổi phụ đạo thêm và kính mong gia đình hỗ trợ em luyện đọc ở nhà.\n\nTrân trọng.",
    studentId: "hs-002",
    status: "draft",
    createdAt: "2026-04-25",
  },
];

// === MOCK LESSON PLAN ===
export const mockLessonPlan: MockLessonPlan = {
  id: "lp-001",
  subject: "Toán",
  grade: 3,
  title: "Phép cộng trong phạm vi 10 000",
  periods: 1,
  layout: "2col",
  createdAt: "2026-04-20",
  content: `# KẾ HOẠCH BÀI DẠY
**Môn: Toán — Lớp 3**
**Bài: Phép cộng trong phạm vi 10 000**
**Số tiết: 1 — Theo Công văn 2345/BGDĐT**

---

## I. YÊU CẦU CẦN ĐẠT
- Thực hiện được phép cộng (có nhớ) trong phạm vi 10 000.
- Vận dụng giải các bài toán thực tế liên quan đến phép cộng.
- Phát triển năng lực tư duy, lập luận toán học.

## II. ĐỒ DÙNG DẠY HỌC
- GV: Bảng phụ, phiếu học tập, máy chiếu.
- HS: SGK, vở bài tập, bảng con.

## III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU

### 1. Khởi động (5 phút)
| Hoạt động GV | Hoạt động HS |
|---|---|
| Tổ chức trò chơi "Ai nhanh hơn" | Tham gia trò chơi, tính nhẩm |
| Nêu các phép tính cộng đơn giản | Giơ bảng con, trả lời |

### 2. Khám phá (12 phút)
| Hoạt động GV | Hoạt động HS |
|---|---|
| Đặt vấn đề: bài toán thực tế | Đọc đề, phân tích |
| Hướng dẫn đặt tính, thực hiện phép cộng có nhớ | Quan sát, thực hiện theo |
| Chốt kiến thức: cách nhớ sang hàng liền trước | Ghi nhớ |

### 3. Luyện tập (15 phút)
| Hoạt động GV | Hoạt động HS |
|---|---|
| Phát phiếu bài tập | Làm bài cá nhân |
| Cho HS trao đổi cặp đôi | Kiểm tra chéo, sửa bài |
| Chữa bài, nhận xét | Sửa bài, hoàn thiện |

### 4. Vận dụng (8 phút)
| Hoạt động GV | Hoạt động HS |
|---|---|
| Đưa bài toán thực tế (đi chợ, đếm đồ) | Giải bài toán, trình bày |
| Liên hệ thực tiễn | Chia sẻ cách giải |

## IV. ĐIỀU CHỈNH SAU BÀI DẠY
_Ghi nhận sau khi dạy..._`,
};
