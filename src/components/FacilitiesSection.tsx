import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BedDouble,
  Car,
  Clock,
  Coffee,
  Scissors,
  Sparkles,
  Tv,
  Utensils,
  Wifi,
  Wine,
} from 'lucide-react';
import { FACILITY_CATEGORIES } from '../data/hotelData';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<string, typeof BedDouble> = {
  'Air-conditioned rooms': BedDouble,
  'Flat-screen televisions': Tv,
  Refrigerators: Coffee,
  'Electric kettles': Coffee,
  'Private bathrooms': Sparkles,
  Restaurant: Utensils,
  'Bar and lounge': Wine,
  'Breakfast options': Coffee,
  '24-hour room service': Clock,
  '24-hour front desk': Clock,
  'Free Wi-Fi': Wifi,
  'Free on-site parking': Car,
  'Event centre': Sparkles,
  'Unisex salon': Scissors,
};

export function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.facility-editorial-row',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.facility-dossier-list',
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="facilities"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#141517] py-20 text-[#F7F4EE] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Monumental Typographic Statement + Lounge Photography Diptych */}
        <div className="grid grid-cols-1 items-end gap-10 border-b border-white/12 pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-16">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#C5A46D] uppercase">
              04 — Experience · Facilities &amp; Services
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] text-[#F7F4EE] [text-wrap:balance] sm:text-5xl lg:text-[3.4rem]">
              THOUGHTFUL HOSPITALITY AT EVERY HOUR
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-[#E5DFD5]/80 sm:text-base">
              From air-conditioned rooms and 24-hour front desk support to Cornel&apos;s Lounge,
              our restaurant, event centre, and unisex salon, every space on property is organised
              for a comfortable stay in Warri/Udu.
            </p>
          </div>

          {/* Asymmetrical Authentic Cornel's Lounge Photography Composition */}
          <div className="grid grid-cols-12 items-end gap-4 lg:col-span-6">
            <figure className="col-span-7 overflow-hidden bg-[#1C1E22]">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/assets/aistudio/unnamed__30__ec58633f.webp"
                  alt="Cornel's Lounge bar counter with cognac bar stools and backlit shelving"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <figcaption className="border-t border-white/10 px-3.5 py-2.5 text-[11px] tracking-wide text-[#E5DFD5]/75">
                Cornel&apos;s Lounge Bar
              </figcaption>
            </figure>

            <figure className="col-span-5 overflow-hidden bg-[#1C1E22]">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/assets/aistudio/unnamed__32__92832559.webp"
                  alt="Cornel's Lounge emerald banquette seating and marble-top tables"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <figcaption className="border-t border-white/10 px-3.5 py-2.5 text-[11px] tracking-wide text-[#E5DFD5]/75">
                Lounge Seating
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Hairline-Ruled Hospitality Dossier Rows (No Repetitive Icon Box Grid) */}
        <div className="facility-dossier-list divide-y divide-white/12">
          {FACILITY_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="facility-editorial-row grid grid-cols-1 gap-6 py-9 transition-colors duration-300 hover:bg-white/[0.02] lg:grid-cols-12 lg:items-start lg:gap-10 lg:px-4 lg:py-11"
            >
              {/* Index & Category Name */}
              <div className="flex items-baseline gap-4 lg:col-span-4">
                <span className="font-serif text-xl italic text-[#C5A46D] tabular-nums">
                  {category.indexLabel}
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#F7F4EE] sm:text-3xl">
                  {category.title}
                </h3>
              </div>

              {/* Editorial Summary */}
              <p className="text-sm leading-relaxed text-[#E5DFD5]/72 lg:col-span-3 lg:pt-1">
                {category.summary}
              </p>

              {/* Clean Amenity List */}
              <ul className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:col-span-5">
                {category.items.map((item) => {
                  const IconComponent = ICON_MAP[item] ?? Sparkles;
                  return (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium text-[#F7F4EE]/92"
                    >
                      <IconComponent
                        className="h-4 w-4 shrink-0 text-[#C5A46D]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
