import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, ExternalLink, MessageCircle, X } from 'lucide-react';
import { HOTEL_INFO, ROOM_CATEGORIES, type RoomCategory } from '../data/hotelData';
import {
  addDaysIso,
  buildWhatsAppReservationUrl,
  calculateNights,
  formatReadableDate,
  formatWhatsAppReservationMessage,
  getLocalTodayIso,
  getRoomById,
  validateBookingForm,
  type BookingFormValues,
  type BookingValidationErrors,
} from '../utils/booking';

interface BookingModalProps {
  isOpen: boolean;
  initialRoomId: RoomCategory['id'];
  onClose: () => void;
}

export function BookingModal({ isOpen, initialRoomId, onClose }: BookingModalProps) {
  const todayIso = useMemo(() => getLocalTodayIso(), []);
  const [values, setValues] = useState<BookingFormValues>(() => ({
    fullName: '',
    phoneNumber: '',
    email: '',
    roomId: initialRoomId,
    checkInDate: todayIso,
    checkOutDate: addDaysIso(todayIso, 1),
    adults: 1,
    children: 0,
    rooms: 1,
    arrivalTime: '',
    specialRequests: '',
  }));

  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const hiddenLinkRef = useRef<HTMLAnchorElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setValues((prev) => ({
      ...prev,
      roomId: initialRoomId,
    }));
    setErrors({});
    setGeneratedUrl(null);
    setGeneratedPreview(null);
  }, [isOpen, initialRoomId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedRoom = getRoomById(values.roomId) ?? ROOM_CATEGORIES[0];
  const nights = calculateNights(values.checkInDate, values.checkOutDate);
  const minCheckOut = values.checkInDate
    ? addDaysIso(values.checkInDate, 1)
    : addDaysIso(todayIso, 1);

  const updateField = <K extends keyof BookingFormValues>(
    field: K,
    nextValue: BookingFormValues[K]
  ) => {
    setValues((prev) => {
      const next = { ...prev, [field]: nextValue };
      if (field === 'checkInDate' && typeof nextValue === 'string' && nextValue) {
        if (!next.checkOutDate || next.checkOutDate <= nextValue) {
          next.checkOutDate = addDaysIso(nextValue, 1);
        }
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGeneratedUrl(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm(values, todayIso);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const url = buildWhatsAppReservationUrl(values);
    const preview = formatWhatsAppReservationMessage(values);
    setGeneratedUrl(url);
    setGeneratedPreview(preview);

    requestAnimationFrame(() => {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      hiddenLinkRef.current?.click();
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0D0F]/82 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-[#17181B]/20 bg-[#F7F4EE] text-[#17181B] shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Concierge Folio Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#141517] px-5 py-4 text-[#F7F4EE] sm:px-7 sm:py-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#C5A46D] uppercase">
              Cornels Hotel &amp; Suites · Reservation Inquiry
            </p>
            <h2
              id="booking-modal-heading"
              className="mt-1 font-serif text-2xl font-medium tracking-wide text-[#F7F4EE] sm:text-3xl"
            >
              LET&apos;S PLAN YOUR STAY
            </h2>
            <p className="mt-0.5 text-xs text-[#E5DFD5]/80 sm:text-sm">
              Share your stay details to open a pre-filled reservation inquiry with our desk.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking form"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-[#1D1F23] text-[#F7F4EE] transition-colors hover:border-[#C5A46D] hover:text-[#C5A46D] focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden anchor for compliant WhatsApp dispatch without window.open */}
        {generatedUrl && (
          <a
            ref={hiddenLinkRef}
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sr-only"
            tabIndex={-1}
          >
            Launch WhatsApp
          </a>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Column: Structured Guest & Stay Form */}
          <div className="space-y-6 p-5 sm:p-7 lg:col-span-7">
            {/* A. Guest Information */}
            <fieldset className="space-y-4">
              <legend className="w-full border-b border-[#17181B]/14 pb-2 text-xs font-semibold tracking-[0.22em] text-[#8B1E24] uppercase">
                A. Guest Information
              </legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="booking-full-name"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Full Name <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-full-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={values.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.fullName && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    WhatsApp / Phone <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="e.g. 0803 123 4567"
                    value={values.phoneNumber}
                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.phoneNumber && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-email"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Email <span className="font-normal text-[#5A5D64]">(Optional)</span>
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* B. Stay Information */}
            <fieldset className="space-y-4">
              <legend className="w-full border-b border-[#17181B]/14 pb-2 text-xs font-semibold tracking-[0.22em] text-[#8B1E24] uppercase">
                B. Stay Details
              </legend>

              <div>
                <label
                  htmlFor="booking-room"
                  className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                >
                  Room Category <span className="text-[#8B1E24]">*</span>
                </label>
                <select
                  id="booking-room"
                  required
                  value={values.roomId}
                  onChange={(e) =>
                    updateField('roomId', e.target.value as RoomCategory['id'])
                  }
                  className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm font-medium text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                >
                  {ROOM_CATEGORIES.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.formattedPrice}
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                    {errors.roomId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-checkin"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Check-in Date <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-checkin"
                    type="date"
                    required
                    min={todayIso}
                    value={values.checkInDate}
                    onChange={(e) => updateField('checkInDate', e.target.value)}
                    aria-invalid={Boolean(errors.checkInDate)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.checkInDate && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.checkInDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-checkout"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Check-out Date <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-checkout"
                    type="date"
                    required
                    min={minCheckOut}
                    value={values.checkOutDate}
                    onChange={(e) => updateField('checkOutDate', e.target.value)}
                    aria-invalid={Boolean(errors.checkOutDate)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3.5 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.checkOutDate && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.checkOutDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                <div>
                  <label
                    htmlFor="booking-adults"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Adults <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-adults"
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={values.adults}
                    onChange={(e) =>
                      updateField('adults', Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-invalid={Boolean(errors.adults)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3 py-2 text-sm text-[#17181B] tabular-nums focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.adults && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.adults}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-children"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Children
                  </label>
                  <input
                    id="booking-children"
                    type="number"
                    min={0}
                    max={20}
                    value={values.children}
                    onChange={(e) =>
                      updateField('children', Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-invalid={Boolean(errors.children)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3 py-2 text-sm text-[#17181B] tabular-nums focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.children && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.children}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-rooms"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Rooms <span className="text-[#8B1E24]">*</span>
                  </label>
                  <input
                    id="booking-rooms"
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={values.rooms}
                    onChange={(e) =>
                      updateField('rooms', Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-invalid={Boolean(errors.rooms)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3 py-2 text-sm text-[#17181B] tabular-nums focus:border-[#8B1E24] focus:outline-none"
                  />
                  {errors.rooms && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#8B1E24]">
                      {errors.rooms}
                    </p>
                  )}
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="booking-arrival-time"
                    className="block text-[11px] font-semibold tracking-[0.14em] text-[#17181B] uppercase"
                  >
                    Arrival Time
                  </label>
                  <input
                    id="booking-arrival-time"
                    type="time"
                    value={values.arrivalTime}
                    onChange={(e) => updateField('arrivalTime', e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full border border-[#17181B]/20 bg-white px-3 py-2 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>

            {/* C. Special Requests */}
            <fieldset className="space-y-2.5">
              <legend className="w-full border-b border-[#17181B]/14 pb-2 text-xs font-semibold tracking-[0.22em] text-[#8B1E24] uppercase">
                C. Special Requests
              </legend>

              <div>
                <label htmlFor="booking-requests" className="sr-only">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="booking-requests"
                  rows={2}
                  placeholder="Optional: arrival notes, accessibility preferences, or inquiries (do not enter payment or ID numbers)."
                  value={values.specialRequests}
                  onChange={(e) => updateField('specialRequests', e.target.value)}
                  className="w-full border border-[#17181B]/20 bg-white px-3.5 py-2.5 text-sm text-[#17181B] transition-colors focus:border-[#8B1E24] focus:outline-none"
                />
              </div>
            </fieldset>
          </div>

          {/* Right Column: Concierge Reservation Folio & Confirmation Drawer */}
          <div className="flex flex-col justify-between border-t border-[#17181B]/12 bg-[#141517] p-5 text-[#F7F4EE] sm:p-7 lg:col-span-5 lg:border-l lg:border-t-0">
            <div>
              {/* Selected Room Visual Preview */}
              <div className="flex items-center gap-4 border-b border-white/12 pb-5">
                <div className="h-20 w-24 shrink-0 overflow-hidden bg-[#1D1F23]">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.imageAlt}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#C5A46D] uppercase">
                    {selectedRoom.indexLabel} · Selected Tier
                  </p>
                  <p className="mt-1 font-serif text-xl font-medium text-[#F7F4EE]">
                    {selectedRoom.name}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-semibold text-[#C5A46D] tabular-nums">
                    {selectedRoom.formattedPrice}
                    <span className="font-sans text-[11px] font-normal text-[#E5DFD5]/65">
                      {' '}
                      / displayed rate
                    </span>
                  </p>
                </div>
              </div>

              {/* Stay Summary Details */}
              <div className="mt-5 space-y-3 border-b border-white/12 pb-5 text-xs text-[#E5DFD5]/88">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#E5DFD5]/60 uppercase">
                  Inquiry Summary
                </p>
                <p className="flex items-center gap-2 text-sm text-[#F7F4EE]">
                  <Calendar className="h-4 w-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>
                    {formatReadableDate(values.checkInDate)} →{' '}
                    {formatReadableDate(values.checkOutDate)}
                  </span>
                </p>
                <p className="tabular-nums text-[#E5DFD5]/80">
                  {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'}` : 'Select valid dates'}{' '}
                  · {values.rooms} room{values.rooms === 1 ? '' : 's'} · {values.adults} adult
                  {values.adults === 1 ? '' : 's'}
                  {values.children > 0
                    ? `, ${values.children} child${values.children === 1 ? '' : 'ren'}`
                    : ''}
                </p>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[#E5DFD5]/72">
                Submitting this form opens a reservation inquiry via WhatsApp (
                {HOTEL_INFO.phoneDisplay}). This is not a confirmed booking until room availability
                and final details are verified by Cornels Hotel &amp; Suites.
              </p>

              {/* Ready-to-Send Confirmation Card */}
              {generatedUrl && generatedPreview && (
                <div
                  ref={statusRef}
                  role="status"
                  className="mt-5 border border-[#C5A46D]/45 bg-[#1C1E22] p-4 text-[#F7F4EE]"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A46D]" />
                    <div className="w-full">
                      <p className="text-xs font-semibold tracking-wide text-[#F7F4EE]">
                        Your reservation inquiry is ready for WhatsApp
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#E5DFD5]/75">
                        If WhatsApp did not open automatically, click below to launch your
                        pre-filled message.
                      </p>
                      <pre className="mt-2.5 max-h-28 overflow-y-auto whitespace-pre-wrap border border-white/10 bg-[#141517] p-2.5 font-sans text-[11px] text-[#E5DFD5]/85">
                        {generatedPreview}
                      </pre>
                      <a
                        href={generatedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-[42px] w-full items-center justify-center gap-2 bg-[#14532D] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#166534]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Open WhatsApp Inquiry</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/12 pt-5 sm:flex-row lg:flex-col">
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 bg-[#8B1E24] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F7F4EE] uppercase transition-colors hover:bg-[#73171C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>CONTINUE TO WHATSAPP</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] w-full border border-white/20 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#E5DFD5] uppercase transition-colors hover:border-[#C5A46D] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
