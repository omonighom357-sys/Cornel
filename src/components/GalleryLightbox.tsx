import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../data/hotelData';

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % items.length);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, items.length, onChangeIndex, onClose]);

  if (activeIndex === null || !items[activeIndex]) {
    return null;
  }

  const currentItem = items[activeIndex];
  const handlePrev = () => onChangeIndex((activeIndex - 1 + items.length) % items.length);
  const handleNext = () => onChangeIndex((activeIndex + 1) % items.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery photo: ${currentItem.caption}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0D0F]/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Lightbox Header Bar */}
        <div className="mb-3 flex w-full items-center justify-between border-b border-white/12 pb-3 text-[#F7F4EE]">
          <p className="text-xs font-medium tracking-[0.2em] text-[#C5A46D] uppercase tabular-nums">
            Plate {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · {currentItem.category}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery lightbox"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/20 bg-[#141517]/80 text-[#F7F4EE] transition-colors hover:border-[#C5A46D] hover:text-[#C5A46D] focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Active Exhibition Frame */}
        <div className="relative flex w-full items-center justify-center overflow-hidden border border-white/10 bg-[#141517]">
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            referrerPolicy="no-referrer"
            className="max-h-[64vh] w-auto max-w-full object-contain"
          />

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-[#141517]/85 text-[#F7F4EE] transition-colors hover:border-[#C5A46D] hover:text-[#C5A46D] focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-[#141517]/85 text-[#F7F4EE] transition-colors hover:border-[#C5A46D] hover:text-[#C5A46D] focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-center font-serif text-lg italic text-[#E5DFD5]">
          {currentItem.caption}
        </p>

        {/* Bottom Plate Selection Strip */}
        {items.length > 1 && (
          <div className="mt-4 flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            {items.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeIndex(idx)}
                  aria-label={`Select plate ${idx + 1}: ${item.caption}`}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden border transition-all ${
                    isCurrent
                      ? 'border-[#C5A46D] opacity-100'
                      : 'border-white/15 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={item.src}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
