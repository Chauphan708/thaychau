import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <div className="container mx-auto max-w-md px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="text-8xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Không tìm thấy trang
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline transition-transform hover:scale-105 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #7c3aed)" }}
            >
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold no-underline border-2 transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "transparent" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
