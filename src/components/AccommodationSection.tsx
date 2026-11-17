import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check } from 'lucide-react';
import { ROOM_CATEGORIES, type RoomCategory } from '../data/hotelData';

gsap.registerPlugin(ScrollTrigger);

interface AccommodationSectionProps {
  onBookRoom: (roomId: RoomCategory['id']) => void;
}

export function AccommodationSection({ onBookRoom }: AccommodationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.room-editorial-plate').forEach((plate) => {
        gsap.fromTo(
          plate,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: plate,
              start: 'top 80%',
              once: true,
            },
          }
        );

        const imgMask = plate.querySelector('.room-img-clip');
        if (imgMask) {
          gsap.fromTo(
            imgMask,
            { clipPath: 'inset(12% 0% 0% 0%)', scale: 1.05 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: plate,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [deluxeRoom, deluxeQueenRoom, deluxeKingRoom] = ROOM_CATEGORIES;

  return (
    <section
      id="accommodation"
      ref={sectionRef}
      className="border-t border-[#17181B]/12 bg-[#EBE6DD]/65 py-20 text-[#17181B] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Chapter 03 Header + Quick Category Index Rail */}
        <div className="border-b border-[#17181B]/15 pb-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.26em] text-[#8B1E24] uppercase">
                03 — Accommodation &amp; Displayed Rates
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.04] text-[#17181B] [text-wrap:balance] sm:text-5xl lg:text-[3.5rem]">
                ROOMS DESIGNED FOR RESTFUL STAYS
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#4A4D54]">
              Select a room category below to initiate a direct reservation inquiry via WhatsApp.
              Displayed nightly rates remain subject to hotel confirmation of availability.
            </p>
          </div>

          {/* Architectural Tier Index Strip */}
          <div className="mt-9 grid grid-cols-1 divide-y divide-[#17181B]/12 border border-[#17181B]/12 bg-[#F7F4EE]/85 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {ROOM_CATEGORIES.map((room) => (
              <a
                key={room.id}
                href={`#tier-${room.id}`}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#141517] hover:text-[#F7F4EE]"
              >
                <div>
                  <span className="block text-[10px] font-semibold tracking-[0.22em] text-[#8B1E24] uppercase group-hover:text-[#C5A46D]">
                    {room.indexLabel}
                  </span>
                  <span className="mt-0.5 block font-serif text-lg font-medium">
                    {room.name}
                  </span>
                </div>
                <span className="font-serif text-xl font-semibold tabular-nums group-hover:text-[#C5A46D]">
                  {room.formattedPrice}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ROOM 01 — DELUXE ROOM (Overlapping Ivory Folio Architecture) */}
        <article
          id={`tier-${deluxeRoom.id}`}
          className="room-editorial-plate mt-16 grid grid-cols-1 items-center lg:mt-24 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <figure className="group relative overflow-hidden bg-[#1D1F23]">
              <div className="room-img-clip aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:aspect-[10/11]">
                <img
                  src={deluxeRoom.image}
                  alt={deluxeRoom.imageAlt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="border-t border-white/10 bg-[#141517] px-5 py-3 text-[11px] tracking-wide text-[#E5DFD5]/80">
                {deluxeRoom.imageCaption}
              </figcaption>
            </figure>
          </div>

          <div className="relative z-10 border border-[#17181B]/12 bg-[#F7F4EE] p-7 shadow-[0_24px_60px_rgba(20,21,23,0.1)] sm:p-10 lg:col-span-6 lg:-ml-16 lg:p-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#17181B]/12 pb-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-[#8B1E24] uppercase">
                  {deluxeRoom.indexLabel}
                </p>
                <h3 className="mt-2 font-serif text-3xl font-medium text-[#17181B] sm:text-4xl">
                  {deluxeRoom.name}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                  Displayed Rate
                </p>
                <p className="mt-1 font-serif text-3xl font-semibold text-[#17181B] tabular-nums sm:text-[2.35rem]">
                  {deluxeRoom.formattedPrice}
                </p>
              </div>
            </div>

            <p className="mt-6 text-[15px] leading-[1.78] text-[#35373D] sm:text-base">
              {deluxeRoom.description}
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-2.5 border-y border-[#17181B]/10 py-5 sm:grid-cols-2">
              {deluxeRoom.verifiedHighlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#2C2E33]">
                  <Check className="h-4 w-4 shrink-0 text-[#8B1E24]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#5A5D64]">
                Final rate and availability confirmed by Cornels Hotel &amp; Suites.
              </p>
              <button
                type="button"
                onClick={() => onBookRoom(deluxeRoom.id)}
                className="group inline-flex min-h-[46px] items-center gap-2.5 bg-[#141517] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors duration-200 hover:bg-[#8B1E24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <span>Book This Room</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </article>

        {/* ROOM 02 — DELUXE QUEEN ROOM (Broadsheet Architectural Composition) */}
        <article
          id={`tier-${deluxeQueenRoom.id}`}
          className="room-editorial-plate mt-20 border-t border-[#17181B]/15 pt-16 lg:mt-32 lg:pt-20"
        >
          {/* Oversized Tier Header Row */}
          <div className="grid grid-cols-1 items-end gap-6 pb-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.24em] text-[#8B1E24] uppercase">
                {deluxeQueenRoom.indexLabel}
              </p>
              <h3 className="mt-2 font-serif text-4xl font-medium text-[#17181B] sm:text-5xl">
                {deluxeQueenRoom.name}
              </h3>
            </div>
            <div className="flex items-baseline justify-between border-b border-[#17181B]/15 pb-3 lg:col-span-5 lg:justify-end lg:gap-8">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#5A5D64] uppercase">
                Displayed Rate
              </span>
              <span className="font-serif text-4xl font-semibold text-[#8B1E24] tabular-nums sm:text-5xl">
                {deluxeQueenRoom.formattedPrice}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-5 lg:pt-4">
              <p className="text-[15px] leading-[1.8] text-[#35373D] sm:text-base">
                {deluxeQueenRoom.description}
              </p>

              <dl className="mt-8 divide-y divide-[#17181B]/12 border-y border-[#17181B]/12">
                {deluxeQueenRoom.verifiedHighlights.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 py-3.5 text-sm"
                  >
                    <dt className="flex items-center gap-2.5 font-medium text-[#17181B]">
                      <Check className="h-4 w-4 text-[#8B1E24]" aria-hidden="true" />
                      <span>{item}</span>
                    </dt>
                    <dd className="font-serif text-xs italic text-[#5A5D64] tabular-nums">
                      0{idx + 1}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 space-y-4">
                <p className="text-xs text-[#5A5D64]">
                  Final rate and availability confirmed by Cornels Hotel &amp; Suites.
                </p>
                <button
                  type="button"
                  onClick={() => onBookRoom(deluxeQueenRoom.id)}
                  className="group inline-flex min-h-[48px] items-center gap-2.5 bg-[#141517] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors duration-200 hover:bg-[#8B1E24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
                >
                  <span>Book This Room</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <figure className="group relative overflow-hidden bg-[#1D1F23]">
                <div className="room-img-clip aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={deluxeQueenRoom.image}
                    alt={deluxeQueenRoom.imageAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="border-t border-white/10 bg-[#141517] px-5 py-3 text-[11px] tracking-wide text-[#E5DFD5]/80">
                  {deluxeQueenRoom.imageCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </article>

        {/* ROOM 03 — DELUXE KING ROOM (Flagship Charcoal Architectural Suite Spread) */}
        <article
          id={`tier-${deluxeKingRoom.id}`}
          className="room-editorial-plate mt-20 grid grid-cols-1 items-stretch overflow-hidden bg-[#141517] text-[#F7F4EE] lg:mt-32 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <figure className="group relative h-full overflow-hidden">
              <div className="room-img-clip aspect-[4/3] h-full w-full overflow-hidden lg:aspect-auto">
                <img
                  src={deluxeKingRoom.image}
                  alt={deluxeKingRoom.imageAlt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="border-t border-white/10 bg-[#111214] px-5 py-3 text-[11px] tracking-wide text-[#E5DFD5]/75 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:bg-[#111214]/88 lg:backdrop-blur-sm">
                {deluxeKingRoom.imageCaption}
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-12">
            <div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[#C5A46D] uppercase">
                    {deluxeKingRoom.indexLabel}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-medium text-[#F7F4EE] sm:text-4xl">
                    {deluxeKingRoom.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#E5DFD5]/65 uppercase">
                    Displayed Rate
                  </p>
                  <p className="mt-1 font-serif text-3xl font-semibold text-[#C5A46D] tabular-nums sm:text-4xl">
                    {deluxeKingRoom.formattedPrice}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-[1.78] text-[#E5DFD5]/88">
                {deluxeKingRoom.description}
              </p>

              <ul className="mt-7 divide-y divide-white/10 border-y border-white/12">
                {deluxeKingRoom.verifiedHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-sm text-[#E5DFD5]/92"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#C5A46D]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-xs text-[#E5DFD5]/65">
                Final availability and rate confirmation provided directly via our reservations desk.
              </p>
              <button
                type="button"
                onClick={() => onBookRoom(deluxeKingRoom.id)}
                className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 bg-[#8B1E24] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors duration-200 hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <span>Book This Room</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
