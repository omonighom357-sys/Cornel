import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';
import { useMagnetic } from '../hooks/useMagnetic';

interface NavbarProps {
  onOpenBooking: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Accommodation', href: '#accommodation', id: 'accommodation' },
  { label: 'Facilities', href: '#facilities', id: 'facilities' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Location', href: '#location', id: 'location' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const bookButtonRef = useMagnetic<HTMLButtonElement>(0.18);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 48);

      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0);

      // Scroll-spy for architectural chapter links
      const probeY = y + window.innerHeight * 0.32;
      let matched = 'home';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= probeY) {
          matched = link.id;
        }
      }
      setActiveSection(matched);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        !target.closest('[data-mobile-menu-toggle="true"]')
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#141517]/95 shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-md'
          : 'bg-gradient-to-b from-[#111214]/88 via-[#111214]/45 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Top-left Official Hotel Logo */}
        <a
          href="#home"
          aria-label="Cornels Hotel & Suites Home"
          className="flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A46D]"
        >
          <img
            src={HOTEL_INFO.logoSrc}
            alt="Cornels Place official logo"
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled ? 'h-10 sm:h-11' : 'h-11 sm:h-14'
            }`}
          />
        </a>

        {/* Desktop Navigation with Active Chapter Underline */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 lg:flex xl:gap-7"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={isActive}
                className={`editorial-underline shrink-0 whitespace-nowrap text-[13px] font-medium tracking-[0.06em] transition-colors focus-visible:text-[#C5A46D] focus-visible:outline-none ${
                  isActive
                    ? 'text-[#C5A46D]'
                    : 'text-[#F7F4EE]/90 hover:text-[#C5A46D]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA + Compact Mobile Hamburger */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            ref={bookButtonRef}
            type="button"
            onClick={onOpenBooking}
            className="magnetic-cta hidden min-h-[42px] shrink-0 whitespace-nowrap bg-[#8B1E24] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#F7F4EE] uppercase hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] sm:inline-flex sm:items-center"
          >
            Book a Room
          </button>

          <button
            type="button"
            data-mobile-menu-toggle="true"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="compact-mobile-nav"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/25 bg-[#141517]/80 text-[#F7F4EE] transition-colors hover:border-[#C5A46D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex h-3.5 w-5 flex-col justify-between">
              <span
                className={`block h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-3.5 self-end bg-[#C5A46D] transition-opacity duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Hairline Reading Depth Progress Indicator */}
      <div
        aria-hidden="true"
        className={`h-[1.5px] w-full origin-left bg-gradient-to-r from-[#8B1E24] via-[#C5A46D] to-[#C5A46D]/60 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Compact Floating Navigation Drawer (Mobile/Tablet) */}
      <div
        id="compact-mobile-nav"
        ref={drawerRef}
        aria-hidden={!mobileMenuOpen}
        className={`absolute right-4 top-[calc(100%+8px)] w-56 origin-top-right border border-white/15 bg-[#181A1D]/98 p-3.5 text-[#F7F4EE] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-md transition-all duration-200 sm:right-6 lg:hidden ${
          mobileMenuOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="mb-1.5 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A46D] uppercase">
            Menu
          </span>
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="inline-flex h-8 w-8 items-center justify-center text-[#E5DFD5]/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-col">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={handleLinkClick}
                className={`flex min-h-[38px] items-center justify-between border-b border-white/5 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#C5A46D]'
                    : 'text-[#F7F4EE]/90 hover:text-[#C5A46D]'
                }`}
              >
                <span>{link.label}</span>
                <span aria-hidden="true" className="text-xs text-[#C5A46D]/60">
                  →
                </span>
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          tabIndex={mobileMenuOpen ? 0 : -1}
          onClick={() => {
            setMobileMenuOpen(false);
            onOpenBooking();
          }}
          className="mt-3 flex min-h-[42px] w-full items-center justify-center bg-[#8B1E24] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#F7F4EE] uppercase transition-colors hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
        >
          Book a Room
        </button>
      </div>
    </header>
  );
}
