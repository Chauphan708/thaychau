import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCheck, Award, BookOpen, Heart, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

// Mock student records according to Circular 27/2020/TT-BGDĐT
const mockStudentsDatabase = [
  {
    code: "HS001",
    name: "Nguyen Van An",
    displayName: "Nguyễn Văn An",
    grade: "Lớp 3A",
    academicStatus: "Hoàn thành tốt",
    conductStatus: "Tốt",
    subjects: [
      { name: "Toán", status: "Hoàn thành tốt", note: "Tính toán nhanh, giải toán có lời văn xuất sắc" },
      { name: "Tiếng Việt", status: "Hoàn thành tốt", note: "Đọc diễn cảm tốt, chữ viết rõ ràng đẹp" },
      { name: "Tiếng Anh", status: "Hoàn thành tốt", note: "Hát tiếng Anh tự tin, phát âm chuẩn" },
      { name: "Tự nhiên & Xã hội", status: "Hoàn thành", note: "Hăng hái phát biểu ý kiến" },
    ],
    qualities: "Chăm chỉ, lễ phép với thầy cô, hòa đồng giúp đỡ bạn bè.",
    competencies: "Tự chủ và tự học tốt, giao tiếp hợp tác tích cực.",
    teacherNotes: "Em An có tinh thần học tập rất tích cực, đạt thành tích cao trong tuần.",
  },
  {
    code: "HS002",
    name: "Tran Thi Bao",
    displayName: "Trần Thị Bảo",
    grade: "Lớp 3A",
    academicStatus: "Hoàn thành",
    conductStatus: "Tốt",
    subjects: [
      { name: "Toán", status: "Hoàn thành", note: "Cần cẩn thận hơn khi làm phép trừ có nhớ" },
      { name: "Tiếng Việt", status: "Hoàn thành tốt", note: "Viết văn giàu cảm xúc" },
      { name: "Tiếng Anh", status: "Hoàn thành", note: "Thuộc từ vựng tốt" },
    ],
    qualities: "Ngoan ngoãn, trung thực, giữ gìn vệ sinh chung tốt.",
    competencies: "Giải quyết vấn đề nhanh nhẹn.",
    teacherNotes: "Gia đình tiếp tục đồng hành cùng em ôn tập thêm môn Toán tại nhà.",
  },
];

export default function StudentLookupSection() {
  const [searchCode, setSearchCode] = useState("");
  const [result, setResult] = useState<typeof mockStudentsDatabase[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    if (!query) return;

    const found = mockStudentsDatabase.find(
      (s) => s.code.toLowerCase() === query || s.name.toLowerCase().includes(query) || s.displayName.toLowerCase().includes(query)
    );

    setResult(found || null);
    setSearched(true);
  };

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-16">
      <div className="text-center mb-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          <UserCheck className="inline w-7 h-7 mr-2" style={{ color: "var(--color-primary)" }} />
          Tra Cứu Kết Quả Học Tập Học Sinh
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Nhập Mã học sinh (VD: <strong>HS001</strong>) hoặc Tên học sinh để xem nhận xét (Thông tư 27)
        </p>
      </div>

      {/* Lookup Form */}
      <div
        className="max-w-xl mx-auto rounded-2xl p-6 mb-8"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <form onSubmit={handleLookup} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập mã HS001 hoặc Tên học sinh..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
            }}
          >
            Tra cứu
          </button>
        </form>

        <div className="flex justify-center gap-4 mt-3 text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
          <span>Mã gợi ý thử nghiệm: <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold">HS001</code> (An) hoặc <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold">HS002</code> (Bảo)</span>
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {searched && result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8"
            style={{
              background: "var(--color-card)",
              border: "2px solid var(--color-primary)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  Mã HS: {result.code}
                </span>
                <h3 className="text-2xl font-bold mt-1" style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
                  {result.displayName}
                </h3>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{result.grade}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block" style={{ color: "var(--color-text-secondary)" }}>Mức đạt được</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  {result.academicStatus}
                </span>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="mb-6">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                <BookOpen className="w-4 h-4 text-blue-600" /> Đánh giá Môn học & Hoạt động giáo dục
              </h4>
              <div className="space-y-2">
                {result.subjects.map((sub) => (
                  <div key={sub.name} className="p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2" style={{ background: "var(--color-bg-secondary)" }}>
                    <div>
                      <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{sub.name}</span>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{sub.note}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 self-start md:self-center shrink-0">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualities & Competencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: "var(--color-bg-secondary)" }}>
                <h4 className="text-xs font-bold mb-1 flex items-center gap-1.5 text-pink-600">
                  <Heart className="w-4 h-4" /> Phẩm chất chủ yếu
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>{result.qualities}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "var(--color-bg-secondary)" }}>
                <h4 className="text-xs font-bold mb-1 flex items-center gap-1.5 text-purple-600">
                  <Award className="w-4 h-4" /> Năng lực cốt lõi
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>{result.competencies}</p>
              </div>
            </div>

            {/* Teacher Notes */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <strong>Lời nhắn GV chủ nhiệm:</strong> {result.teacherNotes}
            </div>
          </motion.div>
        )}

        {searched && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 max-w-md mx-auto rounded-xl"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
          >
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              Không tìm thấy học sinh với mã hoặc tên "{searchCode}".
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Vui lòng kiểm tra lại Mã học sinh do giáo viên cung cấp.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
}
