import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AdvancedMarker,
  APIProvider,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useApiLoadingStatus,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';

gsap.registerPlugin(ScrollTrigger);

interface ResolvedPlace {
  lat: number;
  lng: number;
  title: string;
  formattedAddress: string;
}

function InteractivePlacesMap({
  onFallbackToEmbed,
}: {
  onFallbackToEmbed: () => void;
}) {
  const status = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const [resolved, setResolved] = useState<ResolvedPlace | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      if (status === APILoadingStatus.AUTH_FAILURE) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      onFallbackToEmbed();
    }
  }, [status, onFallbackToEmbed]);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function lookupHotel() {
      try {
        const { places } = await placesLib!.Place.searchByText({
          textQuery: HOTEL_INFO.address,
          fields: ['location', 'displayName', 'formattedAddress'],
          region: 'NG',
        });

        if (cancelled) return;
        const match = places?.[0];
        if (match?.location) {
          setResolved({
            lat: match.location.lat(),
            lng: match.location.lng(),
            title: match.displayName || HOTEL_INFO.officialName,
            formattedAddress: match.formattedAddress || HOTEL_INFO.address,
          });
        } else {
          onFallbackToEmbed();
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onFallbackToEmbed();
      }
    }

    lookupHotel();
    return () => {
      cancelled = true;
    };
  }, [placesLib, onFallbackToEmbed]);

  if (!resolved) {
    return (
      <div className="flex h-full min-h-[380px] w-full items-center justify-center bg-[#1D1F23] text-sm text-[#E5DFD5]/75">
        Locating Cornels Place on Udu Road…
      </div>
    );
  }

  return (
    <GoogleMap
      defaultCenter={{ lat: resolved.lat, lng: resolved.lng }}
      defaultZoom={16}
      mapId="DEMO_MAP_ID"
      gestureHandling="cooperative"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker
        position={{ lat: resolved.lat, lng: resolved.lng }}
        onClick={() => setInfoOpen(true)}
        title={HOTEL_INFO.officialName}
      >
        <Pin background="#8B1E24" borderColor="#141517" glyphColor="#F7F4EE" />
      </AdvancedMarker>

      {infoOpen && (
        <InfoWindow
          position={{ lat: resolved.lat, lng: resolved.lng }}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="max-w-[230px] p-1 text-[#17181B]">
            <p className="font-serif text-base font-semibold text-[#17181B]">
              {HOTEL_INFO.officialName}
            </p>
            <p className="mt-1 text-xs leading-snug text-[#4A4D54]">
              {resolved.formattedAddress}
            </p>
            <a
              href={HOTEL_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8B1E24] underline"
            >
              Open in Google Maps
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export function LocationSection() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [useEmbedFallback, setUseEmbedFallback] = useState(!apiKey);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.location-reveal',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
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

  const encodedQuery = encodeURIComponent(HOTEL_INFO.address);
  const embedSrc =
    apiKey && !useEmbedFallback
      ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
          apiKey
        )}&q=${encodedQuery}&zoom=16&language=en&region=NG`
      : `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="location"
      ref={sectionRef}
      className="border-t border-[#17181B]/12 bg-[#EBE6DD]/70 py-20 text-[#17181B] sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header Band */}
        <div className="location-reveal grid grid-cols-1 items-end gap-6 border-b border-[#17181B]/14 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#8B1E24] uppercase">
              05 — Connection · Directions &amp; Arrival
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] text-[#17181B] [text-wrap:balance] sm:text-5xl">
              FIND YOUR WAY TO US
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#4A4D54] lg:col-span-4 lg:text-right">
            Complimentary on-site parking and 24-hour front desk arrival assistance at Cornels
            Place.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Address & Arrival Dossier Column */}
          <div className="location-reveal flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-[15px] leading-[1.8] text-[#35373D] sm:text-base">
                Cornels Hotel &amp; Suites is situated at Cornels Place along Utuama, Udu Road in
                the Warri/Udu area of Delta State, with complimentary on-site parking available for
                arriving guests.
              </p>

              <dl className="mt-8 divide-y divide-[#17181B]/12 border-y border-[#17181B]/12">
                <div className="py-5">
                  <dt className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#8B1E24] uppercase">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>Hotel Address</span>
                  </dt>
                  <dd className="mt-2">
                    <address className="not-italic text-base font-medium leading-relaxed text-[#17181B]">
                      {HOTEL_INFO.address}
                    </address>
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4 py-4 text-sm">
                  <dt className="text-xs font-semibold tracking-[0.18em] text-[#5A5D64] uppercase">
                    Arrival Parking
                  </dt>
                  <dd className="font-medium text-[#17181B]">Free on-site parking</dd>
                </div>

                <div className="flex items-baseline justify-between gap-4 py-4 text-sm">
                  <dt className="text-xs font-semibold tracking-[0.18em] text-[#5A5D64] uppercase">
                    Reception
                  </dt>
                  <dd className="font-medium text-[#17181B]">24-hour front desk</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={HOTEL_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2.5 bg-[#8B1E24] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={HOTEL_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 border border-[#17181B]/30 bg-[#F7F4EE]/60 px-5 py-3.5 text-xs font-semibold tracking-[0.14em] text-[#17181B] uppercase transition-colors hover:border-[#8B1E24] hover:text-[#8B1E24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24]"
              >
                <span>Open Google Maps Navigation</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Architectural Frame */}
          <div className="location-reveal lg:col-span-7">
            <div className="relative h-[380px] w-full overflow-hidden border border-[#17181B]/18 bg-[#1D1F23] shadow-[0_20px_50px_rgba(20,21,23,0.12)] sm:h-[440px] lg:h-full lg:min-h-[460px]">
              {apiKey && !useEmbedFallback ? (
                <APIProvider apiKey={apiKey} language="en" region="NG">
                  <InteractivePlacesMap
                    onFallbackToEmbed={() => setUseEmbedFallback(true)}
                  />
                </APIProvider>
              ) : (
                <iframe
                  title="Google Map location for Cornels Hotel & Suites, Cornels Place, Utuama, Udu Road, Warri/Udu"
                  src={embedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
