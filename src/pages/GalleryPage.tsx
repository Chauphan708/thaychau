import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Layers, Grid, Sparkles, FolderHeart } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { galleryCategories } from "@/data/gallery";
import type { GalleryCategory, GalleryImage } from "@/data/gallery";
import AnimatedSection from "@/components/shared/AnimatedSection";

// ===== LIGHTBOX WITH INTERACTIVE MAGNIFIER (Kính lúp soi chi tiết) =====
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const image = images[currentIndex];
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const [zoomLevel, setZoomLevel] = useState<number>(2.5);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPos({ x, y, show: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      style={{ background: "rgba(0,0,0,0.94)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="Xem ảnh"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setZoomLevel((z) => (z === 2.5 ? 3.5 : z === 3.5 ? 1.8 : 2.5))}
          className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer border-none transition-transform hover:scale-105"
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
        >
          <ZoomIn className="w-3.5 h-3.5" /> Kính lúp: {zoomLevel}x
        </button>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none z-10 hover:scale-110 transition-transform"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Counter & Hint */}
      <div
        className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-2"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        <span>{currentIndex + 1} / {images.length}</span>
        <span className="opacity-60 font-normal">| Rê chuột vào ảnh để soi kính lúp 🔍</span>
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none z-10 hover:scale-110 transition-transform"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none z-10 hover:scale-110 transition-transform"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          aria-label="Ảnh tiếp"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image with Interactive Glass Lens (Kính Lúp Soi Chi Tiết) */}
      <motion.div
        key={image.id}
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 10 }}
        transition={{ duration: 0.25 }}
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-2xl cursor-crosshair shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMagnifierPos((p) => ({ ...p, show: false }))}
        >
          <img
            src={image.src}
            alt={image.title}
            className="max-w-full max-h-[72vh] object-contain rounded-2xl block"
            loading="lazy"
          />

          {/* Floating Glass Lens (Thấu kính soi kính lúp) */}
          {magnifierPos.show && (
            <div
              className="pointer-events-none absolute w-52 h-52 rounded-full border-4 border-white shadow-2xl overflow-hidden -translate-x-1/2 -translate-y-1/2 z-30"
              style={{
                left: `${magnifierPos.x}%`,
                top: `${magnifierPos.y}%`,
                backgroundImage: `url(${image.src})`,
                backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
                boxShadow: "0 0 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.4)",
              }}
            />
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-white text-base font-bold">{image.title}</p>
          <p className="text-white/70 text-xs mt-1 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {image.date} • <span className="px-2 py-0.5 rounded-full bg-white/10">{image.category}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== STACKED IMAGE CARD GROUP (Bộ ảnh xếp chồng) =====
function StackedAlbumGroup({
  category,
  images,
  onImageClick,
}: {
  category: string;
  images: GalleryImage[];
  onImageClick: (imgIndex: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const topImages = images.slice(0, 4);

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 relative"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
            <FolderHeart className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
              {category}
            </h3>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {images.length} khoảnh khắc sáng tạo
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "var(--color-bg-secondary)", color: "var(--color-primary)" }}>
          Chạm vào ảnh để xòe
        </span>
      </div>

      {/* Stacked Cards Container */}
      <div className="relative h-[280px] sm:h-[320px] w-full flex items-center justify-center my-2">
        {topImages.map((img, idx) => {
          // Calculates rotation and offsets for stacked fan-out effect
          const offsetStep = 14;
          const rotateStep = 6;
          const isTop = idx === 0;

          // When hovered, fan out neatly!
          const rotation = isHovered
            ? (idx - (topImages.length - 1) / 2) * 12
            : (idx % 2 === 0 ? 1 : -1) * idx * rotateStep;

          const translateX = isHovered
            ? (idx - (topImages.length - 1) / 2) * 45
            : idx * offsetStep;

          const translateY = isHovered ? -12 : idx * -6;

          return (
            <motion.div
              key={img.id}
              onClick={() => onImageClick(idx)}
              className="absolute w-[200px] sm:w-[230px] h-[240px] sm:h-[270px] rounded-2xl overflow-hidden cursor-pointer shadow-md group border-2 border-white/80"
              style={{
                zIndex: topImages.length - idx,
                background: "var(--color-bg-secondary)",
              }}
              animate={{
                rotate: rotation,
                x: translateX,
                y: translateY,
                scale: isHovered && isTop ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.85))" }}
              >
                <ZoomIn className="absolute top-3 right-3 w-5 h-5 text-white/90" />
                <p className="text-white text-xs font-bold line-clamp-2">{img.title}</p>
                <p className="text-white/70 text-[10px] mt-1">{img.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ===== MASONRY GRID =====
function GalleryGrid({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  return (
    <motion.div layout className="columns-2 md:columns-3 gap-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {images.map((image: GalleryImage, i: number) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.03 }}
            className="break-inside-avoid"
          >
            <button
              onClick={() => onImageClick(i)}
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer border-none p-0 group block shadow-sm hover:shadow-xl transition-all"
              style={{ background: "var(--color-bg-secondary)" }}
              aria-label={`Xem ảnh: ${image.title}`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.8))" }}
              >
                <ZoomIn className="absolute top-3 right-3 w-5 h-5 text-white/80" />
                <p className="text-white text-xs font-semibold line-clamp-2 text-left">{image.title}</p>
                <p className="text-white/70 text-[10px] mt-0.5 text-left">{image.category} • {image.date}</p>
              </div>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== MAIN PAGE =====
export default function GalleryPage() {
  const { gallery: galleryImages } = useSiteData();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("Tất cả");
  const [viewMode, setViewMode] = useState<"stacked" | "grid">("stacked");
  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Tất cả"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  // Group images by category for stacked view
  const groupedCategories = galleryCategories.filter((cat) => cat !== "Tất cả").map((cat) => ({
    category: cat,
    images: galleryImages.filter((img) => img.category === cat),
  })).filter(g => g.images.length > 0);

  const openLightbox = (imagesList: GalleryImage[], index: number) => {
    setLightboxImages(imagesList);
    setLightboxIndex(index);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + lightboxImages.length) % lightboxImages.length : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % lightboxImages.length : null,
    );

  return (
    <main>
      {/* Header */}
      <section className="pt-12 pb-6">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: "rgba(37,99,235,0.1)", color: "var(--color-primary)" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Bộ sưu tập khoảnh khắc sinh động
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            🎨 Thư Viện Sáng Tạo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Hình ảnh hoạt động, sản phẩm sáng tạo của học sinh được sắp xếp dạng bộ bài tương tác 3D.
          </motion.p>
        </div>
      </section>

      {/* Control Bar: View mode & Category tabs */}
      <AnimatedSection className="container mx-auto max-w-5xl px-4" style={{ marginTop: "30px", marginBottom: "30px" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
            {galleryCategories.map((cat) => {
              const count =
                cat === "Tất cả"
                  ? galleryImages.length
                  : galleryImages.filter((img) => img.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all hover:scale-105"
                  style={{
                    background: activeCategory === cat ? "var(--color-primary)" : "var(--color-bg-secondary)",
                    color: activeCategory === cat ? "#fff" : "var(--color-text-secondary)",
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl shrink-0" style={{ background: "var(--color-bg-secondary)" }}>
            <button
              onClick={() => setViewMode("stacked")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all"
              style={{
                background: viewMode === "stacked" ? "var(--color-card)" : "transparent",
                color: viewMode === "stacked" ? "var(--color-primary)" : "var(--color-text-secondary)",
                boxShadow: viewMode === "stacked" ? "var(--shadow-sm)" : "none",
              }}
            >
              <Layers className="w-3.5 h-3.5" /> Bộ ảnh xếp chồng
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all"
              style={{
                background: viewMode === "grid" ? "var(--color-card)" : "transparent",
                color: viewMode === "grid" ? "var(--color-primary)" : "var(--color-text-secondary)",
                boxShadow: viewMode === "grid" ? "var(--shadow-sm)" : "none",
              }}
            >
              <Grid className="w-3.5 h-3.5" /> Lưới ảnh
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-5xl px-4" style={{ marginBottom: "60px" }}>
        {viewMode === "stacked" && activeCategory === "Tất cả" ? (
          /* Stacked Deck View for All Categories */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedCategories.map((group) => (
              <StackedAlbumGroup
                key={group.category}
                category={group.category}
                images={group.images}
                onImageClick={(idx) => openLightbox(group.images, idx)}
              />
            ))}
          </div>
        ) : (
          /* Grid or Filtered View */
          <div>
            <div style={{ marginBottom: "20px" }}>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Hiển thị <strong>{filtered.length}</strong> ảnh {activeCategory !== "Tất cả" && `trong mục "${activeCategory}"`}
              </p>
            </div>
            {filtered.length > 0 ? (
              <GalleryGrid images={filtered} onImageClick={(idx) => openLightbox(filtered, idx)} />
            ) : (
              <div className="text-center py-16">
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Chưa có ảnh trong danh mục này.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
