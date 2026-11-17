import { HOTEL_INFO, ROOM_CATEGORIES } from '../data/hotelData';

interface FooterProps {
  onOpenBooking: (roomId?: (typeof ROOM_CATEGORIES)[number]['id']) => void;
}

export function Footer({ onOpenBooking }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/12 bg-[#141517] text-[#E5DFD5]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Summary */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-block">
              <img
                src={HOTEL_INFO.logoSrc}
                alt="Cornels Place official logo"
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#E5DFD5]/75">
              Cornels Hotel &amp; Suites (Cornels Place) offers air-conditioned accommodation,
              on-site dining, Cornel&apos;s Lounge, an event centre, and 24-hour hospitality on Udu
              Road, Warri/Udu, Delta State.
            </p>
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="mt-6 inline-flex min-h-[44px] items-center justify-center bg-[#8B1E24] px-5 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
            >
              WhatsApp Reservation
            </button>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#C5A46D] uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Location', href: '#location' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="editorial-underline inline-block text-[#E5DFD5]/80 transition-colors hover:text-[#C5A46D]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Accommodation */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#C5A46D] uppercase">
              Accommodation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {ROOM_CATEGORIES.map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => onOpenBooking(room.id)}
                    className="flex w-full items-center justify-between gap-2 text-left text-[#E5DFD5]/80 transition-colors hover:text-[#C5A46D]"
                  >
                    <span>{room.name}</span>
                    <span className="font-serif text-sm text-[#C5A46D] tabular-nums">
                      {room.formattedPrice}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="mt-7 text-xs font-semibold tracking-[0.22em] text-[#C5A46D] uppercase">
              Facilities
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#E5DFD5]/75">
              <li>
                <a href="#facilities" className="transition-colors hover:text-[#C5A46D]">
                  Restaurant &amp; Cornel&apos;s Lounge
                </a>
              </li>
              <li>
                <a href="#facilities" className="transition-colors hover:text-[#C5A46D]">
                  Event Centre &amp; Unisex Salon
                </a>
              </li>
              <li>
                <a href="#facilities" className="transition-colors hover:text-[#C5A46D]">
                  24-Hour Front Desk &amp; Wi-Fi
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Direct Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#C5A46D] uppercase">
              Location &amp; Desk
            </h3>
            <address className="mt-4 not-italic text-sm leading-relaxed text-[#E5DFD5]/80">
              {HOTEL_INFO.address}
            </address>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <a
                  href={HOTEL_INFO.phoneHref}
                  className="font-medium text-[#F7F4EE] tabular-nums transition-colors hover:text-[#C5A46D]"
                >
                  Tel: {HOTEL_INFO.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={HOTEL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A46D] underline underline-offset-4 transition-colors hover:text-[#F7F4EE]"
                >
                  WhatsApp: {HOTEL_INFO.phoneIntl}
                </a>
              </p>
              <p>
                <a
                  href={HOTEL_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E5DFD5]/75 underline underline-offset-4 transition-colors hover:text-[#C5A46D]"
                >
                  Get Directions on Google Maps
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-8 text-xs text-[#E5DFD5]/55 sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} {HOTEL_INFO.officialName} ({HOTEL_INFO.brandName}). All rights
            reserved.
          </p>
          <p>Utuama, Udu Road, Warri/Udu, Delta State, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
