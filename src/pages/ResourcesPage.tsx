import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, FileText, Presentation, Video, FileIcon,
  ExternalLink, Download, Star, X,
} from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import type { ResourceItem } from "@/data/resources";
import { safeExternalLinkProps } from "@/lib/security";
import AnimatedSection from "@/components/shared/AnimatedSection";

const typeConfig: Record<ResourceItem["type"], { icon: typeof FileText; color: string; label: string }> = {
  pdf: { icon: FileText, color: "#ef4444", label: "PDF" },
  ppt: { icon: Presentation, color: "#f59e0b", label: "PowerPoint" },
  video: { icon: Video, color: "#8b5cf6", label: "Video" },
  doc: { icon: FileIcon, color: "#3b82f6", label: "Tài liệu" },
  link: { icon: ExternalLink, color: "#16a34a", label: "Liên kết" },
};

// Expanded category filters
const categories = [
  { id: "all", label: "Tất cả học liệu" },
  { id: "bai-giang", label: "Bài giảng điện tử" },
  { id: "de-thi", label: "Đề thi & Kiểm tra" },
  { id: "phieu-bai-tap", label: "Phiếu bài tập" },
  { id: "giao-an", label: "Giáo án & KHBD" },
];

// ===== FILTER BAR =====
function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedGrade: number | null;
  setSelectedGrade: (v: number | null) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}) {
  const { config: siteConfig } = useSiteData();
  const hasFilters = searchQuery || selectedSubject !== "Tất cả" || selectedGrade !== null || selectedType !== "Tất cả" || selectedCategory !== "all";

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4" style={{ marginTop: "40px", marginBottom: "40px" }}>
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" style={{ marginBottom: "28px" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-none"
            style={{
              background: selectedCategory === cat.id ? "var(--color-primary)" : "var(--color-card)",
              color: selectedCategory === cat.id ? "#fff" : "var(--color-text)",
              boxShadow: selectedCategory === cat.id ? "0 4px 12px rgba(37,99,235,0.25)" : "var(--shadow-sm)",
              border: "1px solid var(--color-border)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative" style={{ marginBottom: "24px" }}>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--color-text-secondary)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài liệu, tên bài dạy, từ khóa..."
          className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all shadow-sm"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          maxLength={100}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Subject filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
          {["Tất cả", ...siteConfig.subjects].map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all"
              style={{
                background: selectedSubject === subject ? "var(--color-primary)" : "var(--color-bg-secondary)",
                color: selectedSubject === subject ? "#fff" : "var(--color-text-secondary)",
              }}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>Khối:</span>
          {siteConfig.gradeLevels.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(selectedGrade === g ? null : g)}
              className="w-7 h-7 rounded-full text-xs font-semibold cursor-pointer border-none transition-all"
              style={{
                background: selectedGrade === g ? "var(--color-primary)" : "var(--color-card)",
                color: selectedGrade === g ? "#fff" : "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubject("Tất cả");
              setSelectedGrade(null);
              setSelectedType("Tất cả");
              setSelectedCategory("all");
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all flex items-center gap-1 ml-auto"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          >
            <X className="w-3 h-3" /> Xóa bộ lọc
          </button>
        )}
      </div>
    </AnimatedSection>
  );
}

// ===== RESOURCE CARD =====
function ResourceCard({ item, index }: { item: ResourceItem; index: number }) {
  const config = typeConfig[item.type];
  const IconComponent = config?.icon || FileIcon;
  const isNew = (Date.now() - new Date(item.date).getTime()) < 14 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
    >
      <a
        href={item.driveUrl}
        {...safeExternalLinkProps}
        className="block rounded-xl p-5 h-full no-underline transition-all hover:shadow-lg hover:scale-[1.01] group"
        style={{
          background: "var(--color-card)",
          border: item.featured
            ? "2px solid var(--color-accent)"
            : "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: `${config?.color || "#3b82f6"}15` }}
          >
            <IconComponent className="w-5 h-5" style={{ color: config?.color || "#3b82f6" }} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${config?.color || "#3b82f6"}15`, color: config?.color || "#3b82f6" }}
              >
                {config?.label || item.type}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Lớp {item.grade}
              </span>
              {item.featured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
                  style={{ background: "rgba(245,158,11,0.15)", color: "var(--color-accent)" }}
                >
                  <Star className="w-2.5 h-2.5" /> Nổi bật
                </span>
              )}
              {isNew && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                  Mới
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="font-semibold text-sm mb-1.5 line-clamp-2"
              style={{ color: "var(--color-text)" }}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className="text-xs line-clamp-2 mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                {item.subject} • {item.date}
              </span>
              <Download
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

// ===== MAIN PAGE =====
export default function ResourcesPage() {
  const { resources } = useSiteData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = useMemo(() => {
    return resources.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = selectedSubject === "Tất cả" || item.subject === selectedSubject;
      const matchGrade = selectedGrade === null || item.grade === selectedGrade;
      const matchType = selectedType === "Tất cả" || item.type === selectedType;

      let matchCategory = true;
      if (selectedCategory === "bai-giang") matchCategory = item.type === "ppt" || item.type === "video";
      else if (selectedCategory === "de-thi") matchCategory = item.title.toLowerCase().includes("đề") || item.title.toLowerCase().includes("kiểm tra");
      else if (selectedCategory === "phieu-bai-tap") matchCategory = item.title.toLowerCase().includes("phiếu") || item.title.toLowerCase().includes("bài tập");
      else if (selectedCategory === "giao-an") matchCategory = item.type === "doc" || item.type === "pdf";

      return matchSearch && matchSubject && matchGrade && matchType && matchCategory;
    });
  }, [searchQuery, selectedSubject, selectedGrade, selectedType, selectedCategory, resources]);

  // Sort: featured first, then by date desc
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filtered]);

  return (
    <main>
      {/* Header */}
      <section className="pt-12 pb-8">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            📚 Kho Học Liệu Thông Minh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Tìm kiếm bài giảng, đề thi, phiếu bài tập theo môn học và khối lớp dễ dàng.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Results count */}
      <div className="container mx-auto max-w-5xl px-4" style={{ marginTop: "24px", marginBottom: "24px" }}>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          Hiển thị <strong>{sorted.length}</strong> / {resources.length} tài liệu
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto max-w-5xl px-4 mb-16">
        <AnimatePresence mode="popLayout">
          {sorted.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sorted.map((item, i) => (
                <ResourceCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "var(--color-text-secondary)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Không tìm thấy tài liệu nào phù hợp.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
