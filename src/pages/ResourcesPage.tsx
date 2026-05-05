import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, FileText, Presentation, Video, FileIcon,
  ExternalLink, Download, Star, X, ChevronDown,
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
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedGrade: number | null;
  setSelectedGrade: (v: number | null) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
}) {
  const { config: siteConfig } = useSiteData();
  const hasFilters = searchQuery || selectedSubject !== "Tất cả" || selectedGrade !== null || selectedType !== "Tất cả";

  return (
    <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-8">
      {/* Search */}
      <div
        className="relative mb-4"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--color-text-secondary)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài liệu..."
          className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          maxLength={100}
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-3 items-start">
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
        <div className="relative">
          <button
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all flex items-center gap-1"
            style={{
              background: selectedGrade !== null ? "var(--color-primary)" : "var(--color-bg-secondary)",
              color: selectedGrade !== null ? "#fff" : "var(--color-text-secondary)",
            }}
            onClick={() => setSelectedGrade(null)}
          >
            {selectedGrade !== null ? `Lớp ${selectedGrade}` : "Tất cả lớp"}
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="absolute top-full left-0 mt-1 flex gap-1 z-10">
            {siteConfig.gradeLevels.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(selectedGrade === g ? null : g)}
                className="w-7 h-7 rounded-full text-xs font-medium cursor-pointer border-none transition-all"
                style={{
                  background: selectedGrade === g ? "var(--color-primary)" : "var(--color-card)",
                  color: selectedGrade === g ? "#fff" : "var(--color-text-secondary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5">
          {["Tất cả", "pdf", "ppt", "video", "doc", "link"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all"
              style={{
                background: selectedType === t ? "var(--color-primary)" : "var(--color-bg-secondary)",
                color: selectedType === t ? "#fff" : "var(--color-text-secondary)",
              }}
            >
              {t === "Tất cả" ? t : typeConfig[t as ResourceItem["type"]]?.label ?? t}
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
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all flex items-center gap-1"
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
  const IconComponent = config.icon;
  const isNew = (Date.now() - new Date(item.date).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
    >
      <a
        href={item.driveUrl}
        {...safeExternalLinkProps}
        className="block rounded-xl p-5 h-full no-underline transition-all hover:shadow-lg hover:scale-[1.02] group"
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
            style={{ background: `${config.color}15` }}
          >
            <IconComponent className="w-5 h-5" style={{ color: config.color }} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${config.color}15`, color: config.color }}
              >
                {config.label}
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

  const filtered = useMemo(() => {
    return resources.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = selectedSubject === "Tất cả" || item.subject === selectedSubject;
      const matchGrade = selectedGrade === null || item.grade === selectedGrade;
      const matchType = selectedType === "Tất cả" || item.type === selectedType;
      return matchSearch && matchSubject && matchGrade && matchType;
    });
  }, [searchQuery, selectedSubject, selectedGrade, selectedType]);

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
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            📚 Kho Học Liệu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Tài liệu, bài giảng, đề thi được tổng hợp theo môn học và khối lớp.
            Tất cả đều miễn phí và được lưu trữ trên Google Drive.
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
      />

      {/* Results count */}
      <div className="container mx-auto max-w-5xl px-4 mb-4">
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
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Không tìm thấy tài liệu nào phù hợp.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
