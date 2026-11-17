import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysIso,
  buildWhatsAppReservationUrl,
  calculateNights,
  formatWhatsAppReservationMessage,
  validateBookingForm,
  type BookingFormValues,
} from './booking';

function makeValidValues(overrides: Partial<BookingFormValues> = {}): BookingFormValues {
  return {
    fullName: 'Adaeze Okafor',
    phoneNumber: '0704 386 4136',
    email: 'adaeze@example.com',
    roomId: 'deluxe-queen-room',
    checkInDate: '2026-12-10',
    checkOutDate: '2026-12-13',
    adults: 2,
    children: 1,
    rooms: 1,
    arrivalTime: '15:00',
    specialRequests: 'Quiet room away from the staircase if available.',
    ...overrides,
  };
}

test('validateBookingForm passes with valid future dates and required fields', () => {
  const errors = validateBookingForm(makeValidValues(), '2026-12-01');
  assert.deepEqual(errors, {});
});

test('validateBookingForm rejects past check-in dates', () => {
  const errors = validateBookingForm(
    makeValidValues({ checkInDate: '2026-11-30', checkOutDate: '2026-12-02' }),
    '2026-12-01'
  );
  assert.equal(errors.checkInDate, 'Check-in date cannot be in the past.');
});

test('validateBookingForm rejects check-out on or before check-in', () => {
  const sameDayErrors = validateBookingForm(
    makeValidValues({ checkInDate: '2026-12-10', checkOutDate: '2026-12-10' }),
    '2026-12-01'
  );
  assert.equal(
    sameDayErrors.checkOutDate,
    'Check-out date must be at least one night after check-in.'
  );

  const earlierErrors = validateBookingForm(
    makeValidValues({ checkInDate: '2026-12-10', checkOutDate: '2026-12-09' }),
    '2026-12-01'
  );
  assert.equal(
    earlierErrors.checkOutDate,
    'Check-out date must be at least one night after check-in.'
  );
});

test('validateBookingForm requires guest name, phone, and positive adults/rooms', () => {
  const errors = validateBookingForm(
    makeValidValues({
      fullName: ' ',
      phoneNumber: '123',
      email: 'invalid-email',
      adults: 0,
      rooms: 0,
    }),
    '2026-12-01'
  );
  assert.ok(errors.fullName);
  assert.ok(errors.phoneNumber);
  assert.ok(errors.email);
  assert.ok(errors.adults);
  assert.ok(errors.rooms);
});

test('calculateNights and addDaysIso calculate multi-night stays accurately', () => {
  assert.equal(calculateNights('2026-12-10', '2026-12-13'), 3);
  assert.equal(addDaysIso('2026-12-30', 3), '2027-01-02');
});

test('formatWhatsAppReservationMessage follows exact required structure and rates', () => {
  const msg = formatWhatsAppReservationMessage(makeValidValues());
  assert.match(msg, /^Hello Cornels Hotel & Suites,/);
  assert.match(msg, /Full Name: Adaeze Okafor/);
  assert.match(msg, /Phone Number: 0704 386 4136/);
  assert.match(msg, /Room Category: Deluxe Queen Room/);
  assert.match(msg, /Displayed Room Rate: ₦45,813/);
  assert.match(msg, /Check-in Date: 2026-12-10/);
  assert.match(msg, /Check-out Date: 2026-12-13/);
  assert.match(msg, /Number of Adults: 2/);
  assert.match(msg, /Number of Children: 1/);
  assert.match(msg, /Number of Rooms: 1/);
  assert.match(msg, /SPECIAL REQUESTS:\nQuiet room away from the staircase if available\./);
});

test('buildWhatsAppReservationUrl targets exact hotel WhatsApp number +2347043864136', () => {
  const url = buildWhatsAppReservationUrl(makeValidValues({ roomId: 'deluxe-king-room' }));
  assert.ok(url.startsWith('https://wa.me/2347043864136?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.match(decoded, /Deluxe King Room/);
  assert.match(decoded, /₦67,871/);
});
