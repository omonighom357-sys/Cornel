import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HOTEL_INFO } from '../data/hotelData';

interface CinematicIntroProps {
  onComplete: () => void;
}

const SEEN_STORAGE_KEY = 'cornels_intro_seen_v1';

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasVisitedBefore] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(SEEN_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAutostart = params.get('autostart') === '1';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldAutostart || prefersReducedMotion) {
      onComplete();
      return;
    }

    const markSeenTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(SEEN_STORAGE_KEY, '1');
      } catch {
        // ignore storage errors
      }
    }, 300);

    const ctx = gsap.context(() => {
      const welcomeLetters = welcomeRef.current?.querySelectorAll('.intro-char') ?? [];
      const titleLetters = titleRef.current?.querySelectorAll('.intro-char') ?? [];

      const tl = gsap.timeline({
        onComplete: () => {
          setIsLeaving(true);
          onComplete();
        },
      });

      if (hasVisitedBefore) {
        // Returning visitor fast choreography (~1.35s)
        tl.fromTo(
          frameRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
          .fromTo(
            logoWrapRef.current,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' },
            '-=0.25'
          )
          .fromTo(
            [welcomeRef.current, titleRef.current, taglineRef.current],
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
            '-=0.2'
          )
          .to(containerRef.current, {
            opacity: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.48,
            delay: 0.32,
            ease: 'power3.inOut',
          });
      } else {
        // First-visit architectural curtain choreography (~3.6s)
        tl.fromTo(
          frameRef.current,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
        )
          .fromTo(
            logoWrapRef.current,
            { opacity: 0, scale: 0.9, y: 12 },
            { opacity: 1, scale: 1, y: 0, duration: 0.72, ease: 'power3.out' },
            '-=0.35'
          )
          .fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.45, ease: 'power2.inOut' },
            '-=0.3'
          )
          .fromTo(
            welcomeLetters,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.32, stagger: 0.025, ease: 'power2.out' },
            '-=0.25'
          )
          .fromTo(
            titleLetters,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.44, stagger: 0.02, ease: 'power3.out' },
            '-=0.12'
          )
          .fromTo(
            taglineRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            '-=0.15'
          )
          .to(containerRef.current, {
            opacity: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.72,
            delay: 0.9,
            ease: 'power3.inOut',
          });
      }
    }, containerRef);

    return () => {
      window.clearTimeout(markSeenTimer);
      ctx.revert();
    };
  }, [hasVisitedBefore, onComplete]);

  const handleSkip = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      window.localStorage.setItem(SEEN_STORAGE_KEY, '1');
    } catch {
      // ignore storage failure
    }
    if (containerRef.current) {
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.28,
        ease: 'power2.out',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  const renderChars = (text: string) =>
    text.split('').map((char, idx) => (
      <span key={`${idx}-${char}`} className="intro-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Welcome to Cornels Hotel and Suites"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#111214] px-6 text-[#F7F4EE]"
    >
      {/* Subtle architectural radial depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-65"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(197, 164, 109, 0.13) 0%, rgba(139, 30, 36, 0.08) 38%, rgba(17, 18, 20, 0) 72%)',
        }}
      />

      {/* Perimeter architectural hairline frame */}
      <div
        ref={frameRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 border border-[#F7F4EE]/12 md:inset-10"
      >
        <span className="absolute left-4 top-4 text-[10px] font-medium tracking-[0.28em] text-[#C5A46D]/75 uppercase">
          Cornels Place · Udu, Warri
        </span>
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Official Cornels Place logo with metallic sheen sweep */}
        <div
          ref={logoWrapRef}
          className="relative mb-6 flex items-center justify-center overflow-hidden px-4 py-2"
        >
          <img
            src={HOTEL_INFO.logoSrc}
            alt="Cornels Place official logo"
            className="h-24 w-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)] md:h-28"
          />
          <div
            aria-hidden="true"
            className="animate-cornels-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
        </div>

        <div
          ref={lineRef}
          aria-hidden="true"
          className="mb-6 h-px w-28 origin-center bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent"
        />

        <div
          ref={welcomeRef}
          className="mb-2 text-xs font-medium tracking-[0.36em] text-[#C5A46D] uppercase md:text-sm"
        >
          {renderChars('WELCOME TO')}
        </div>

        <div
          ref={titleRef}
          className="font-serif text-3xl font-medium tracking-[0.06em] text-[#F7F4EE] sm:text-4xl md:text-5xl"
        >
          {renderChars('CORNELS HOTEL & SUITES')}
        </div>

        <p
          ref={taglineRef}
          className="mt-4 max-w-md font-serif text-lg italic tracking-wide text-[#E5DFD5]/88 md:text-xl"
        >
          Where Comfort Meets Exceptional Hospitality.
        </p>
      </div>

      {/* Discreet Skip Intro control */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-7 right-7 z-20 inline-flex min-h-[44px] items-center gap-2 border border-[#F7F4EE]/20 bg-[#141517]/75 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-[#E5DFD5] uppercase transition-colors hover:border-[#C5A46D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] md:bottom-12 md:right-12"
      >
        Skip Intro
      </button>
    </div>
  );
}
