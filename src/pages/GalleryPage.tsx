import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { galleryCategories } from "@/data/gallery";
import type { GalleryCategory, GalleryImage } from "@/data/gallery";
import AnimatedSection from "@/components/shared/AnimatedSection";

// ===== LIGHTBOX =====
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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.9)" }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="Xem ảnh"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none z-10"
        style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
        aria-label="Đóng"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs text-white"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none z-10"
          style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none z-10"
          style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          aria-label="Ảnh tiếp"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={image.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
          loading="lazy"
        />
        <div className="mt-3 text-center">
          <p className="text-white text-sm font-medium">{image.title}</p>
          <p className="text-white/60 text-xs mt-1 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            {image.date} • {image.category}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== GALLERY GRID =====
function GalleryGrid({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  return (
    <motion.div
      layout
      className="columns-2 md:columns-3 gap-4 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {images.map((image: GalleryImage, i: number) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.04 }}
            className="break-inside-avoid"
          >
            <button
              onClick={() => onImageClick(i)}
              className="relative w-full rounded-xl overflow-hidden cursor-pointer border-none p-0 group block"
              style={{ background: "var(--color-bg-secondary)" }}
              aria-label={`Xem ảnh: ${image.title}`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                style={{
                  background: "linear-gradient(transparent 40%, rgba(0,0,0,0.7))",
                }}
              >
                <ZoomIn className="absolute top-3 right-3 w-5 h-5 text-white/80" />
                <p className="text-white text-xs font-medium line-clamp-2 text-left">
                  {image.title}
                </p>
                <p className="text-white/60 text-[10px] mt-0.5 text-left">
                  {image.category} • {image.date}
                </p>
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Tất cả"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + filtered.length) % filtered.length : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % filtered.length : null,
    );

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
            🎨 Thư Viện Sáng Tạo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Hình ảnh hoạt động, sản phẩm sáng tạo của học sinh và khoảnh khắc đáng nhớ.
          </motion.p>
        </div>
      </section>

      {/* Category tabs */}
      <AnimatedSection className="container mx-auto max-w-5xl px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => {
            const count =
              cat === "Tất cả"
                ? galleryImages.length
                : galleryImages.filter((img) => img.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer border-none transition-all hover:scale-105"
                style={{
                  background:
                    activeCategory === cat
                      ? "var(--color-primary)"
                      : "var(--color-bg-secondary)",
                  color:
                    activeCategory === cat ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Results */}
      <div className="container mx-auto max-w-5xl px-4 mb-4">
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          Hiển thị <strong>{filtered.length}</strong> ảnh
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto max-w-5xl px-4 mb-16">
        {filtered.length > 0 ? (
          <GalleryGrid images={filtered} onImageClick={openLightbox} />
        ) : (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Chưa có ảnh trong danh mục này.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filtered}
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
