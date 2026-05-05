// src/data/gallery.ts — GV thêm ảnh hoạt động ở đây

export interface GalleryImage {
  id: string;
  src: string; // URL ảnh (Google Drive, Imgur, etc.)
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
}

export const galleryCategories = [
  "Tất cả",
  "Hoạt động lớp",
  "Ngoại khóa",
  "Sản phẩm HS",
  "Thi đua",
  "Ngày lễ",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

// Dùng placeholder images từ picsum.photos — GV sẽ thay bằng ảnh thật
export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://picsum.photos/seed/class1/600/400",
    title: "Giờ học Toán vui nhộn",
    category: "Hoạt động lớp",
    date: "2026-04-15",
  },
  {
    id: "g2",
    src: "https://picsum.photos/seed/outdoor1/600/450",
    title: "Tham quan Bảo tàng Cần Thơ",
    category: "Ngoại khóa",
    date: "2026-04-10",
  },
  {
    id: "g3",
    src: "https://picsum.photos/seed/craft1/400/500",
    title: "Sản phẩm thủ công — Lọ hoa giấy",
    category: "Sản phẩm HS",
    date: "2026-04-05",
  },
  {
    id: "g4",
    src: "https://picsum.photos/seed/contest1/600/400",
    title: "Hội thi Tiếng hát học đường",
    category: "Thi đua",
    date: "2026-03-28",
  },
  {
    id: "g5",
    src: "https://picsum.photos/seed/class2/500/400",
    title: "Hoạt động nhóm — TN&XH",
    category: "Hoạt động lớp",
    date: "2026-03-20",
  },
  {
    id: "g6",
    src: "https://picsum.photos/seed/holiday1/600/400",
    title: "Kỷ niệm ngày 8/3",
    category: "Ngày lễ",
    date: "2026-03-08",
  },
  {
    id: "g7",
    src: "https://picsum.photos/seed/art1/400/600",
    title: "Tranh vẽ — Ngôi trường em yêu",
    category: "Sản phẩm HS",
    date: "2026-03-01",
  },
  {
    id: "g8",
    src: "https://picsum.photos/seed/sport1/600/400",
    title: "Hội khỏe Phù Đổng",
    category: "Thi đua",
    date: "2026-02-25",
  },
  {
    id: "g9",
    src: "https://picsum.photos/seed/tet1/600/450",
    title: "Chương trình Tết yêu thương",
    category: "Ngày lễ",
    date: "2026-01-25",
  },
  {
    id: "g10",
    src: "https://picsum.photos/seed/class3/500/400",
    title: "Tiết đọc sách thư viện",
    category: "Hoạt động lớp",
    date: "2026-01-15",
  },
  {
    id: "g11",
    src: "https://picsum.photos/seed/outdoor2/600/400",
    title: "Trải nghiệm làm vườn",
    category: "Ngoại khóa",
    date: "2026-01-10",
  },
  {
    id: "g12",
    src: "https://picsum.photos/seed/craft2/400/500",
    title: "Thiệp chúc mừng ngày Nhà giáo",
    category: "Sản phẩm HS",
    date: "2025-11-20",
  },
];
