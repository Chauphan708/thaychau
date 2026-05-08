// src/data/goldenFaces.ts — GV thêm/bớt học sinh xuất sắc ở đây
export interface GoldenFace {
  name: string;
  className: string;
  achievement: string;
  image?: string; // URL ảnh, để trống nếu chưa có
}

export const goldenFaces: GoldenFace[] = [
  {
    name: "Nguyễn Minh Anh",
    className: "5A2",
    achievement: "Học sinh giỏi xuất sắc — Đạt giải Nhất Toán cấp quận",
    image: "/images/sample/student1.png",
  },
  {
    name: "Trần Gia Bảo",
    className: "5A2",
    achievement: "Viết chữ đẹp nhất lớp — Giải Nhì cấp trường",
    image: "/images/sample/student2.png",
  },
  {
    name: "Lê Thị Hồng Nhung",
    className: "5A2",
    achievement: "Cháu ngoan Bác Hồ — Lớp trưởng gương mẫu",
    image: "/images/sample/student1.png",
  },
  {
    name: "Phạm Đức Huy",
    className: "5A2",
    achievement: "Tiến bộ vượt bậc — Từ TB lên Giỏi môn Toán",
    image: "/images/sample/student2.png",
  },
];
