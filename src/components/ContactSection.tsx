import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export function ContactSection({ onOpenBooking }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bookBtnRef = useMagnetic<HTMLButtonElement>(0.18);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
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
      id="contact"
      ref={sectionRef}
      className="border-t border-[#17181B]/12 bg-[#F7F4EE] py-20 text-[#17181B] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left Architectural Reservation Invitation */}
          <div className="contact-reveal lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#8B1E24] uppercase">
              06 — Reservation &amp; Direct Desk
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] text-[#17181B] [text-wrap:balance] sm:text-5xl lg:text-[3.5rem]">
              CORNELS HOTEL &amp; SUITES
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#35373D] sm:text-base">
              Our 24-hour front desk and reservations team are available to confirm room
              availability, arrange stays, and answer inquiries for individual guests or events at
              Cornels Place.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                ref={bookBtnRef}
                type="button"
                onClick={onOpenBooking}
                className="magnetic-cta group inline-flex min-h-[48px] items-center justify-center gap-2.5 bg-[#8B1E24] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <span>Book a Room</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <a
                href={HOTEL_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2.5 border border-[#17181B]/30 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#17181B] uppercase transition-colors hover:border-[#8B1E24] hover:text-[#8B1E24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Hairline-Ruled Verified Contact Dossier */}
          <div className="contact-reveal border-t border-[#17181B]/18 pt-2 lg:col-span-6 lg:border-t-0 lg:pt-0">
            <dl className="divide-y divide-[#17181B]/14 border-y border-[#17181B]/14">
              <div className="py-7">
                <dt className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  <MapPin className="h-4 w-4 text-[#8B1E24]" aria-hidden="true" />
                  <span>Address</span>
                </dt>
                <dd className="mt-3">
                  <p className="text-base font-medium leading-relaxed text-[#17181B] sm:text-lg">
                    {HOTEL_INFO.address}
                  </p>
                  <a
                    href={HOTEL_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] text-[#8B1E24] uppercase underline-offset-4 hover:underline"
                  >
                    <span>Open Google Maps Directions</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>

              <div className="py-7">
                <dt className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  <Phone className="h-4 w-4 text-[#8B1E24]" aria-hidden="true" />
                  <span>Telephone</span>
                </dt>
                <dd className="mt-3">
                  <a
                    href={HOTEL_INFO.phoneHref}
                    className="font-serif text-3xl font-medium text-[#17181B] tabular-nums transition-colors hover:text-[#8B1E24]"
                  >
                    {HOTEL_INFO.phoneDisplay}
                  </a>
                  <p className="mt-1 text-xs text-[#5A5D64]">
                    Click to call front desk ({HOTEL_INFO.phoneIntl})
                  </p>
                </dd>
              </div>

              <div className="py-7">
                <dt className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  <MessageCircle className="h-4 w-4 text-[#8B1E24]" aria-hidden="true" />
                  <span>WhatsApp Reservations</span>
                </dt>
                <dd className="mt-3">
                  <a
                    href={HOTEL_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base font-medium text-[#17181B] underline decoration-[#8B1E24]/50 underline-offset-4 transition-colors hover:text-[#8B1E24]"
                  >
                    <span>Chat with Cornels Hotel &amp; Suites ({HOTEL_INFO.phoneDisplay})</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
