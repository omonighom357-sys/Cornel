import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export function AboutSection({ onOpenBooking }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const foregroundPlateRef = useRef<HTMLElement>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.18);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-headline-line',
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.about-text-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.about-image-reveal',
        { clipPath: 'inset(14% 0% 0% 0%)', opacity: 0, scale: 1.05 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          duration: 1.05,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        }
      );

      // Subtle overlapping plate depth parallax on desktop
      if (foregroundPlateRef.current && window.innerWidth >= 1024) {
        gsap.to(foregroundPlateRef.current, {
          y: -36,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[#17181B]/10 bg-[#F7F4EE] py-20 text-[#17181B] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Chapter Header Spread */}
        <div className="grid grid-cols-1 items-end gap-6 border-b border-[#17181B]/14 pb-8 lg:grid-cols-12 lg:pb-10">
          <div className="lg:col-span-9">
            <p className="about-text-reveal text-xs font-semibold tracking-[0.26em] text-[#8B1E24] uppercase">
              02 — Discovery · Cornels Place
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.03] tracking-[0.01em] text-[#17181B] sm:text-5xl lg:text-[3.75rem]">
              <span className="block overflow-hidden">
                <span className="about-headline-line block">AN EXPERIENCE</span>
              </span>
              <span className="block overflow-hidden">
                <span className="about-headline-line block">DESIGNED AROUND YOU</span>
              </span>
            </h2>
          </div>

          <div className="about-text-reveal lg:col-span-3 lg:text-right">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#5A5D64] uppercase">
              Warri / Udu · Delta State
            </p>
            <p className="mt-1.5 font-serif text-xl italic text-[#17181B]">
              Welcome to Cornels Hotel &amp; Suites.
            </p>
          </div>
        </div>

        {/* Magazine Editorial Spread: Overlapping Diptych + Drop-Cap Narrative */}
        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          {/* Layered Overlapping Photographic Composition */}
          <div className="relative lg:col-span-7">
            <div className="relative">
              {/* Primary Tall Plate */}
              <figure className="about-image-reveal w-full sm:w-[70%]">
                <div className="aspect-[4/5] overflow-hidden bg-[#EBE6DD]">
                  <img
                    src="/assets/aistudio/unnamed__26__5ef03d09.webp"
                    alt="Reception lobby at Cornels Place featuring oak and charcoal front desk, warm cove ceiling, and staircase"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-4 border-t border-[#17181B]/12 pt-2.5 text-xs text-[#5A5D64]">
                  <span className="font-serif italic text-[#17181B]">
                    Plate 01 — 24-Hour Reception &amp; Lobby
                  </span>
                  <span className="tracking-[0.16em] uppercase">Cornels Place</span>
                </figcaption>
              </figure>

              {/* Overlapping Secondary Architectural Plate */}
              <figure
                ref={foregroundPlateRef}
                className="about-image-reveal relative z-10 ml-auto -mt-14 w-[76%] border-4 border-[#F7F4EE] bg-[#F7F4EE] shadow-[0_24px_60px_rgba(20,21,23,0.16)] sm:absolute sm:top-20 sm:right-0 sm:mt-0 sm:w-[46%]"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#EBE6DD]">
                  <img
                    src="/assets/aistudio/unnamed__27__212c55f3.webp"
                    alt="Exterior facade of Cornels Hotel & Suite with charcoal cladding and red courtyard lines"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-2.5 px-1 pb-1 font-serif text-xs italic text-[#5A5D64]">
                  Plate 02 — Entrance Facade, Utuama, Udu Road
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Right Reading Column */}
          <div className="lg:col-span-5 lg:pt-6">
            <div className="about-text-reveal space-y-6 text-[15px] leading-[1.82] text-[#2C2E33] sm:text-base">
              <p className="first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-medium first-letter:leading-none first-letter:text-[#8B1E24]">
                Situated along Utuama, Udu Road in the Warri/Udu corridor of Delta State, Cornels
                Place is built as a composed retreat for business travellers, visiting families, and
                guests seeking unhurried comfort.
              </p>
              <p>
                Every visit begins at our 24-hour front desk and continues into quiet,
                air-conditioned rooms paired with attentive room service, on-site dining at our
                restaurant and Cornel&apos;s Lounge, free Wi-Fi, and complimentary on-site parking.
              </p>
              <p>
                Whether you are staying overnight in Udu, hosting a celebration at our event centre,
                or stopping by the lounge and unisex salon, every detail is organised around practical
                ease and warm Nigerian hospitality.
              </p>
            </div>

            {/* Subtle Editorial Pull Quote */}
            <blockquote className="about-text-reveal my-9 border-y border-[#17181B]/14 py-6">
              <p className="font-serif text-2xl italic leading-snug text-[#17181B]">
                &ldquo;Where Comfort Meets Exceptional Hospitality.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-medium tracking-[0.18em] text-[#8B1E24] uppercase">
                Cornels Hotel &amp; Suites · Warri / Udu
              </footer>
            </blockquote>

            {/* Architectural Ledger Details */}
            <div className="about-text-reveal grid grid-cols-2 gap-6 pb-8">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  Location
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#17181B]">
                  Utuama, Udu Road, Warri/Udu
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  Front Desk
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#17181B]">24-Hour Assistance</p>
              </div>
            </div>

            <div className="about-text-reveal">
              <button
                ref={ctaRef}
                type="button"
                onClick={onOpenBooking}
                className="magnetic-cta group inline-flex min-h-[48px] items-center gap-3 border border-[#17181B] bg-[#141517] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase hover:border-[#8B1E24] hover:bg-[#8B1E24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <span>Plan Your Stay</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
