import { HOTEL_INFO, ROOM_CATEGORIES, type RoomCategory } from '../data/hotelData';

export interface BookingFormValues {
  fullName: string;
  phoneNumber: string;
  email: string;
  roomId: RoomCategory['id'];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
  arrivalTime: string;
  specialRequests: string;
}

export interface BookingValidationErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  roomId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: string;
  children?: string;
  rooms?: string;
}

export function getLocalTodayIso(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dt = new Date(year, month - 1, day);
  dt.setDate(dt.getDate() + days);
  return getLocalTodayIso(dt);
}

export function calculateNights(checkInDate: string, checkOutDate: string): number {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(`${checkInDate}T00:00:00`);
  const end = new Date(`${checkOutDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatReadableDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getRoomById(roomId: string): RoomCategory | undefined {
  return ROOM_CATEGORIES.find((room) => room.id === roomId);
}

export function validateBookingForm(
  values: BookingFormValues,
  todayIso: string = getLocalTodayIso()
): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const digits = values.phoneNumber.replace(/[^\d]/g, '');
  if (!values.phoneNumber.trim() || digits.length < 7) {
    errors.phoneNumber = 'Please enter a valid WhatsApp or telephone number.';
  }

  if (values.email.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email.trim())) {
      errors.email = 'Please enter a valid email address or leave it blank.';
    }
  }

  if (!getRoomById(values.roomId)) {
    errors.roomId = 'Please select a preferred room category.';
  }

  if (!values.checkInDate) {
    errors.checkInDate = 'Please select a check-in date.';
  } else if (values.checkInDate < todayIso) {
    errors.checkInDate = 'Check-in date cannot be in the past.';
  }

  if (!values.checkOutDate) {
    errors.checkOutDate = 'Please select a check-out date.';
  } else if (values.checkInDate && values.checkOutDate <= values.checkInDate) {
    errors.checkOutDate = 'Check-out date must be at least one night after check-in.';
  }

  if (!Number.isFinite(values.adults) || values.adults < 1) {
    errors.adults = 'At least 1 adult is required.';
  }

  if (!Number.isFinite(values.children) || values.children < 0) {
    errors.children = 'Number of children cannot be negative.';
  }

  if (!Number.isFinite(values.rooms) || values.rooms < 1) {
    errors.rooms = 'At least 1 room is required.';
  }

  return errors;
}

export function formatWhatsAppReservationMessage(values: BookingFormValues): string {
  const room = getRoomById(values.roomId) ?? ROOM_CATEGORIES[0];
  const emailDisplay = values.email.trim() || 'Not provided';
  const arrivalDisplay = values.arrivalTime.trim() || 'Not specified';
  const requestsDisplay = values.specialRequests.trim() || 'None';

  return [
    'Hello Cornels Hotel & Suites,',
    '',
    'I would like to make a reservation inquiry.',
    '',
    'GUEST INFORMATION',
    `Full Name: ${values.fullName.trim()}`,
    `Phone Number: ${values.phoneNumber.trim()}`,
    `Email: ${emailDisplay}`,
    '',
    'STAY DETAILS',
    `Room Category: ${room.name}`,
    `Displayed Room Rate: ${room.formattedPrice}`,
    `Check-in Date: ${values.checkInDate}`,
    `Check-out Date: ${values.checkOutDate}`,
    `Number of Adults: ${values.adults}`,
    `Number of Children: ${values.children}`,
    `Number of Rooms: ${values.rooms}`,
    `Expected Arrival Time: ${arrivalDisplay}`,
    '',
    'SPECIAL REQUESTS:',
    requestsDisplay,
    '',
    'Please confirm room availability and the final reservation details.',
    '',
    'Thank you.',
  ].join('\n');
}

export function buildWhatsAppReservationUrl(values: BookingFormValues): string {
  const message = formatWhatsAppReservationMessage(values);
  return `https://wa.me/${HOTEL_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
