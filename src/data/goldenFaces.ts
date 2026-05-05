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
  },
  {
    name: "Trần Gia Bảo",
    className: "5A2",
    achievement: "Viết chữ đẹp nhất lớp — Giải Nhì cấp trường",
  },
  {
    name: "Lê Thị Hồng Nhung",
    className: "5A2",
    achievement: "Cháu ngoan Bác Hồ — Lớp trưởng gương mẫu",
  },
  {
    name: "Phạm Đức Huy",
    className: "5A2",
    achievement: "Tiến bộ vượt bậc — Từ TB lên Giỏi môn Toán",
  },
];
