// src/data/profileData.ts — GV chỉ cần sửa file NÀY để cập nhật Hồ sơ

export interface TeachingPhilosophy {
  title: string;
  description: string;
  icon: string; // emoji
}

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface CertificateItem {
  title: string;
  issuer: string;
  year: string;
}

export interface SkillItem {
  name: string;
  level: number; // 1–5
  category: "pedagogy" | "tech" | "soft";
}

export interface FunFact {
  label: string;
  value: string;
  icon: string; // emoji
}

// === TRIẾT LÝ GIÁO DỤC ===
export const philosophies: TeachingPhilosophy[] = [
  {
    title: "Lấy học sinh làm trung tâm",
    description:
      "Mỗi bài học được thiết kế để học sinh chủ động khám phá, trải nghiệm và tự rút ra kiến thức.",
    icon: "🎯",
  },
  {
    title: "Học mà chơi, chơi mà học",
    description:
      "Tích hợp trò chơi, hoạt động nhóm và công nghệ vào bài giảng để tạo niềm vui trong học tập.",
    icon: "🎮",
  },
  {
    title: "Không bỏ rơi ai",
    description:
      "Quan tâm đến từng em, đặc biệt các em gặp khó khăn, để mỗi em đều cảm thấy được yêu thương và tiến bộ.",
    icon: "💛",
  },
  {
    title: "Ứng dụng công nghệ",
    description:
      "Sử dụng các nền tảng trực tuyến (OpenLMS, Azota, Quizziz…) để nâng cao chất lượng kiểm tra, đánh giá.",
    icon: "💻",
  },
];

// === CỘT MỐC SỰ NGHIỆP ===
export const milestones: MilestoneItem[] = [
  {
    year: "2015",
    title: "Tốt nghiệp Đại học Sư phạm",
    description: "Cử nhân Giáo dục Tiểu học — ĐH Cần Thơ",
  },
  {
    year: "2015",
    title: "Bắt đầu sự nghiệp giảng dạy",
    description: "Giáo viên chủ nhiệm lớp 1 — Trường TH Trung An 1",
  },
  {
    year: "2018",
    title: "Giáo viên giỏi cấp huyện",
    description: "Đạt danh hiệu Giáo viên giỏi Hội thi cấp huyện Thốt Nốt",
  },
  {
    year: "2020",
    title: "Sáng kiến kinh nghiệm cấp tỉnh",
    description: "\"Ứng dụng CNTT trong dạy Toán lớp 3\" — xếp loại A",
  },
  {
    year: "2023",
    title: "Phát triển hệ thống OpenLMS",
    description: "Xây dựng nền tảng kiểm tra trực tuyến cho trường",
  },
  {
    year: "2025",
    title: "Chiến sĩ thi đua cơ sở",
    description: "Nhiều năm liền đạt danh hiệu Chiến sĩ thi đua",
  },
];

// === CHỨNG CHỈ & THÀNH TÍCH ===
export const certificates: CertificateItem[] = [
  { title: "Giáo viên giỏi cấp huyện", issuer: "Phòng GD&ĐT Thốt Nốt", year: "2018" },
  { title: "Sáng kiến kinh nghiệm cấp tỉnh (Loại A)", issuer: "Sở GD&ĐT Cần Thơ", year: "2020" },
  { title: "Chứng chỉ Tin học ứng dụng", issuer: "ĐH Cần Thơ", year: "2019" },
  { title: "Chứng chỉ Tiếng Anh B1", issuer: "ĐH Cần Thơ", year: "2017" },
  { title: "Chiến sĩ thi đua cơ sở (nhiều năm)", issuer: "UBND quận Thốt Nốt", year: "2021–2025" },
];

// === KỸ NĂNG ===
export const skills: SkillItem[] = [
  { name: "Phương pháp dạy học tích cực", level: 5, category: "pedagogy" },
  { name: "Thiết kế bài giảng E-Learning", level: 4, category: "pedagogy" },
  { name: "Tổ chức hoạt động trải nghiệm", level: 5, category: "pedagogy" },
  { name: "Giáo dục hòa nhập", level: 4, category: "pedagogy" },
  { name: "Microsoft Office", level: 5, category: "tech" },
  { name: "Công nghệ giáo dục (LMS, Azota)", level: 5, category: "tech" },
  { name: "Thiết kế đồ họa (Canva)", level: 4, category: "tech" },
  { name: "Lập trình Web cơ bản", level: 3, category: "tech" },
  { name: "Giao tiếp phụ huynh", level: 5, category: "soft" },
  { name: "Quản lý lớp học", level: 5, category: "soft" },
  { name: "Làm việc nhóm", level: 5, category: "soft" },
];

// === SỐ LIỆU VUI ===
export const funFacts: FunFact[] = [
  { label: "Năm kinh nghiệm", value: "10+", icon: "📅" },
  { label: "Học sinh đã dạy", value: "500+", icon: "👦" },
  { label: "Bài giảng E-Learning", value: "200+", icon: "📚" },
  { label: "Cốc cà phê/năm", value: "365", icon: "☕" },
];

// === GIỚI THIỆU NGẮN ===
export const profileBio = `Xin chào! Tôi là một giáo viên tiểu học đam mê giáo dục và công nghệ. Với hơn 10 năm kinh nghiệm giảng dạy, tôi luôn tìm cách kết hợp phương pháp sư phạm truyền thống với công nghệ hiện đại để mang lại trải nghiệm học tập tốt nhất cho các em học sinh.

Tôi tin rằng mỗi đứa trẻ đều có tiềm năng riêng. Nhiệm vụ của người thầy không chỉ là truyền đạt kiến thức, mà còn là khơi dậy niềm đam mê học hỏi và giúp các em phát triển toàn diện.`;
