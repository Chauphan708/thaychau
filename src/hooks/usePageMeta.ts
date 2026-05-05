import { useEffect } from "react";
import { siteConfig } from "@/data/siteConfig";

/** SEO title + meta description per page */
const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: `${siteConfig.teacherName} — Website Giáo Viên Tiểu Học`,
    description: `Website cá nhân của ${siteConfig.teacherName}, ${siteConfig.school}. Kho học liệu, góc phụ huynh, thư viện sáng tạo.`,
  },
  "/ho-so": {
    title: `Hồ sơ — ${siteConfig.teacherName}`,
    description: `Tìm hiểu về ${siteConfig.teacherName}: kinh nghiệm giảng dạy, triết lý giáo dục, kỹ năng và thành tích.`,
  },
  "/hoc-lieu": {
    title: `Kho Học Liệu — ${siteConfig.teacherName}`,
    description: `Tài liệu, bài giảng, đề thi miễn phí theo môn học và khối lớp. Lưu trữ trên Google Drive.`,
  },
  "/phu-huynh": {
    title: `Góc Phụ Huynh — ${siteConfig.teacherName}`,
    description: `Thời khóa biểu, thông báo, và kênh liên lạc giữa phụ huynh và giáo viên chủ nhiệm.`,
  },
  "/thu-vien": {
    title: `Thư Viện Sáng Tạo — ${siteConfig.teacherName}`,
    description: `Hình ảnh hoạt động, sản phẩm sáng tạo của học sinh và khoảnh khắc đáng nhớ.`,
  },
  "/admin": {
    title: `Quản trị & AI Trợ lý — ${siteConfig.teacherName}`,
    description: `Khu vực quản trị website và trợ lý AI hỗ trợ giáo viên soạn giáo án, quản lý học sinh.`,
  },
};

export function usePageMeta(pathname: string) {
  useEffect(() => {
    const meta = pageMeta[pathname] ?? {
      title: `${siteConfig.teacherName} — Website Giáo Viên`,
      description: `Website giáo viên tiểu học ${siteConfig.teacherName}`,
    };

    document.title = meta.title;

    // Update meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute("content", meta.description);
    } else {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      descTag.setAttribute("content", meta.description);
      document.head.appendChild(descTag);
    }
  }, [pathname]);
}
