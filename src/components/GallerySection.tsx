import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Expand } from 'lucide-react';
import { GALLERY_ITEMS, type GalleryItem } from '../data/hotelData';
import { GalleryLightbox } from './GalleryLightbox';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES: Array<'All' | GalleryItem['category']> = [
  'All',
  'Exterior',
  'Lobby',
  'Rooms',
  'Lounge & Dining',
];

// Curated editorial spans across all 9 unique photos preserving true landscape/portrait orientation
const CURATED_ALL_LAYOUT: Record<string, { colSpan: string; aspect: string; offset?: string }> = {
  'exterior-courtyard': { colSpan: 'lg:col-span-7', aspect: 'aspect-[4/3]' },
  'lobby-reception': { colSpan: 'lg:col-span-5', aspect: 'aspect-[3/4]', offset: 'lg:mt-12' },
  'lounge-bar': { colSpan: 'lg:col-span-6', aspect: 'aspect-[4/3]' },
  'king-interior': { colSpan: 'lg:col-span-6', aspect: 'aspect-[4/3]', offset: 'lg:mt-10' },
  'exterior-signage': { colSpan: 'lg:col-span-4', aspect: 'aspect-[3/4]' },
  'room-wood-cove': { colSpan: 'lg:col-span-4', aspect: 'aspect-[3/4]', offset: 'lg:mt-10' },
  'lounge-banquette': { colSpan: 'lg:col-span-4', aspect: 'aspect-[3/4]' },
  'room-sconces': { colSpan: 'lg:col-span-6', aspect: 'aspect-[3/4]' },
  'lounge-dining': { colSpan: 'lg:col-span-6', aspect: 'aspect-[3/4]', offset: 'lg:mt-10' },
};

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] =
    useState<'All' | GalleryItem['category']>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const visibleItems = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-plate',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="border-t border-[#17181B]/10 bg-[#F7F4EE] py-20 text-[#17181B] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Art-Directed Portfolio Header + Segmented Filter Tabs */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#17181B]/14 pb-9 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-[#8B1E24] uppercase">
              Property Portfolio · Visual Monograph
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-[#17181B] sm:text-5xl">
              INSIDE CORNELS PLACE
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter hotel photographs"
            className="flex flex-wrap items-center gap-1.5"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSelectedCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`min-h-[40px] whitespace-nowrap px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${
                    isActive
                      ? 'bg-[#141517] text-[#F7F4EE]'
                      : 'border border-[#17181B]/15 bg-transparent text-[#4A4D54] hover:border-[#17181B]/45 hover:text-[#17181B]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Art-Directed Photography Plates (9 Unique Photos, Curated Rhythm) */}
        <div className="mt-12 grid grid-cols-1 items-start gap-7 sm:grid-cols-2 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {visibleItems.map((item, idx) => {
            const curated =
              selectedCategory === 'All' ? CURATED_ALL_LAYOUT[item.id] : undefined;

            const colSpanClass =
              curated?.colSpan ??
              (item.aspect === 'landscape' ? 'lg:col-span-6' : 'lg:col-span-4');
            const aspectClass =
              curated?.aspect ??
              (item.aspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]');
            const offsetClass = curated?.offset ?? '';
            const figureNo = String(idx + 1).padStart(2, '0');

            return (
              <figure
                key={item.id}
                className={`gallery-plate group ${colSpanClass} ${offsetClass}`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View larger image: ${item.caption}`}
                  className="relative block w-full overflow-hidden bg-[#EBE6DD] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B1E24]"
                >
                  <div className={`${aspectClass} w-full overflow-hidden`}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Subtle architectural scrim + inspect plate affordance */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111214]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3.5 right-3.5 inline-flex items-center gap-2 border border-white/25 bg-[#141517]/85 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#F7F4EE] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
                  >
                    <Expand className="h-3.5 w-3.5 text-[#C5A46D]" />
                    <span>Inspect</span>
                  </span>
                </button>

                <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-[#17181B]/12 pt-2.5 text-xs text-[#5A5D64]">
                  <span className="font-serif text-sm italic text-[#17181B]">
                    <span className="mr-2 font-sans text-[10px] font-semibold not-italic tracking-[0.18em] text-[#8B1E24] tabular-nums">
                      FIG. {figureNo}
                    </span>
                    {item.caption}
                  </span>
                  <span className="shrink-0 text-[10px] font-medium tracking-[0.16em] uppercase">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <GalleryLightbox
        items={visibleItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
