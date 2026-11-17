import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  introDone: boolean;
  onOpenBooking: () => void;
}

export function Hero({ introDone, onOpenBooking }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRailRef = useRef<HTMLDivElement>(null);
  const exploreRef = useMagnetic<HTMLAnchorElement>(0.2);
  const bookRef = useMagnetic<HTMLButtonElement>(0.2);

  useEffect(() => {
    if (!introDone) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Architectural veil unveil of the full-bleed exterior facade
      if (mediaWrapRef.current) {
        gsap.fromTo(
          mediaWrapRef.current,
          { scale: 1.07, opacity: 0.72 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }
        );

        // Subtle scroll parallax depth as guest transitions into Chapter 02
        gsap.to(mediaWrapRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Masked line-by-line headline reveals
      const lines = contentRef.current?.querySelectorAll('.hero-line-inner') ?? [];
      const metaItems = contentRef.current?.querySelectorAll('.hero-fade-up') ?? [];

      const tl = gsap.timeline({ delay: 0.05 });

      tl.fromTo(
        metaItems[0] ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
      )
        .fromTo(
          lines,
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power4.out' },
          '-=0.35'
        )
        .fromTo(
          Array.from(metaItems).slice(1),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
          '-=0.4'
        );

      if (bottomRailRef.current) {
        gsap.fromTo(
          bottomRailRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.75, delay: 0.6, ease: 'power2.out' }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#141517] pt-28"
    >
      {/* Full-bleed authentic exterior background photograph */}
      <div
        ref={mediaWrapRef}
        className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      >
        <img
          src={HOTEL_INFO.heroImageSrc}
          alt="Exterior courtyard and main architectural facade of Cornels Hotel & Suites (Cornels Place) in Udu, Warri"
          referrerPolicy="no-referrer"
          className="animate-cornels-hero-motion h-full w-full object-cover object-[56%_42%] sm:object-center"
        />
        {/* Controlled multi-stop contrast scrim keeping architecture clear while upholding AA contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#111214]/94 via-[#111214]/45 to-[#111214]/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#111214]/84 via-[#111214]/38 to-transparent"
        />
      </div>

      {/* Subtle Architectural Framing Hairlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 bottom-24 top-24 hidden border-x border-white/8 lg:inset-x-8 lg:block"
      />

      {/* Primary Hero Architectural Composition */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <div ref={contentRef} className="max-w-5xl">
          <div className="hero-fade-up mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-semibold tracking-[0.2em] text-[#C5A46D] uppercase sm:text-xs sm:tracking-[0.26em]">
            <span className="whitespace-nowrap">01 — Arrival</span>
            <span aria-hidden="true" className="text-white/35">
              ·
            </span>
            <span className="whitespace-nowrap text-[#E5DFD5]/85">Cornels Place, Warri &amp; Udu</span>
          </div>

          <h1 className="font-serif text-[2.25rem] font-medium leading-[1.02] tracking-[0.015em] text-[#F7F4EE] sm:text-6xl lg:text-[4.65rem]">
            <span className="block overflow-hidden">
              <span className="hero-line-inner block">YOUR SPACE.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block">YOUR COMFORT.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block whitespace-nowrap text-[#F7F4EE]">
                YOUR EXPERIENCE.
              </span>
            </span>
          </h1>

          <div className="hero-fade-up mt-7 grid grid-cols-1 items-end gap-7 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-8">
            <p className="max-w-xl text-[15px] leading-[1.7] text-[#E9E4DC]/92 sm:text-lg lg:col-span-6">
              Discover a welcoming hospitality experience at Cornels Hotel &amp; Suites, where
              comfort, convenience and thoughtful service come together.
            </p>

            <div className="hero-fade-up flex flex-wrap items-center gap-3.5 lg:col-span-6 lg:justify-end">
              <a
                ref={exploreRef}
                href="#accommodation"
                className="magnetic-cta group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-3 whitespace-nowrap bg-[#8B1E24] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <span>EXPLORE OUR ROOMS</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <button
                ref={bookRef}
                type="button"
                onClick={onOpenBooking}
                className="magnetic-cta inline-flex min-h-[48px] shrink-0 items-center justify-center whitespace-nowrap border border-[#F7F4EE]/45 bg-[#141517]/55 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase backdrop-blur-sm hover:border-[#C5A46D] hover:bg-[#141517]/80 hover:text-[#C5A46D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                BOOK YOUR STAY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Bottom Ledger & Animated Scroll Indicator */}
      <div
        ref={bottomRailRef}
        className="relative z-10 border-t border-white/12 bg-[#111214]/70 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#E5DFD5]/80">
            <span className="font-medium tracking-[0.16em] text-[#C5A46D] uppercase">
              Utuama, Udu Road
            </span>
            <span aria-hidden="true" className="hidden text-white/25 sm:inline">
              ·
            </span>
            <span className="hidden sm:inline">Warri / Udu, Delta State, Nigeria</span>
            <span aria-hidden="true" className="hidden text-white/25 md:inline">
              ·
            </span>
            <span className="hidden md:inline">24-Hour Front Desk &amp; On-Site Parking</span>
          </div>

          <a
            href="#about"
            aria-label="Scroll to Discovery chapter"
            className="group inline-flex shrink-0 items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#E5DFD5]/85 uppercase transition-colors hover:text-[#C5A46D]"
          >
            <span>Scroll</span>
            <span className="relative flex h-6 w-px overflow-hidden bg-white/20">
              <span className="animate-cornels-scroll-line block h-full w-full bg-[#C5A46D]" />
            </span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
