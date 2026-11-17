import { useCallback, useEffect, useState } from 'react';
import { type RoomCategory } from './data/hotelData';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { AccommodationSection } from './components/AccommodationSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [introDone, setIntroDone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return params.get('autostart') === '1' || reduced;
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] =
    useState<RoomCategory['id']>('deluxe-room');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleOpenBooking = useCallback(
    (roomId: RoomCategory['id'] = 'deluxe-room') => {
      setSelectedRoomId(roomId);
      setBookingModalOpen(true);
    },
    []
  );

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#17181B]">
      {gmpQuotaExceeded && (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-900 shadow-sm md:text-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-950 underline hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {!introDone && <CinematicIntro onComplete={handleIntroComplete} />}

      <Navbar onOpenBooking={() => handleOpenBooking('deluxe-room')} />

      <main>
        <Hero
          introDone={introDone}
          onOpenBooking={() => handleOpenBooking('deluxe-room')}
        />
        <AboutSection onOpenBooking={() => handleOpenBooking('deluxe-room')} />
        <AccommodationSection onBookRoom={(roomId) => handleOpenBooking(roomId)} />
        <FacilitiesSection />
        <GallerySection />
        <LocationSection />
        <ContactSection onOpenBooking={() => handleOpenBooking('deluxe-room')} />
      </main>

      <Footer onOpenBooking={(roomId) => handleOpenBooking(roomId)} />

      <BookingModal
        isOpen={bookingModalOpen}
        initialRoomId={selectedRoomId}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
