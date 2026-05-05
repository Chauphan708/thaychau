import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Hook — Cuộn lên đầu trang mỗi khi chuyển route */
export function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
}
