export interface RoomCategory {
  id: 'deluxe-room' | 'deluxe-queen-room' | 'deluxe-king-room';
  indexLabel: string;
  name: string;
  priceNgn: number;
  formattedPrice: string;
  image: string;
  imageAspect: 'portrait' | 'landscape';
  imageAlt: string;
  imageCaption: string;
  description: string;
  verifiedHighlights: string[];
}

export interface FacilityCategory {
  id: string;
  indexLabel: string;
  title: string;
  summary: string;
  items: string[];
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: 'Exterior' | 'Rooms' | 'Lounge & Dining' | 'Lobby';
  aspect: 'landscape' | 'portrait';
}

export const HOTEL_INFO = {
  officialName: 'Cornels Hotel & Suites',
  brandName: 'Cornels Place',
  address: 'Cornels Place, Utuama, Udu Road, Warri/Udu, Delta State, Nigeria',
  shortAddress: 'Utuama, Udu Road, Warri/Udu, Delta State',
  phoneDisplay: '0704 386 4136',
  phoneIntl: '+2347043864136',
  phoneHref: 'tel:+2347043864136',
  whatsappNumber: '2347043864136',
  whatsappUrl: 'https://wa.me/2347043864136',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Cornels+Place%2C+Utuama%2C+Udu+Road%2C+Warri%2FUdu%2C+Delta+State%2C+Nigeria',
  logoSrc: '/assets/brand/cornels-logo.png',
  heroImageSrc: '/assets/aistudio/unnamed__24__08d43eda.webp',
} as const;

export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'deluxe-room',
    indexLabel: 'ROOM 01',
    name: 'Deluxe Room',
    priceNgn: 41442,
    formattedPrice: '₦41,442',
    image: '/assets/aistudio/unnamed__28__35b2041d.webp',
    imageAspect: 'portrait',
    imageAlt:
      'Representative guestroom interior at Cornels Hotel & Suites with warm wood wall paneling, cove lighting, air conditioning, and private bathroom access',
    imageCaption: 'Representative guestroom interior at Cornels Hotel & Suites',
    description:
      'A refined, air-conditioned guestroom designed for restful stays in Udu/Warri, equipped with essential in-room comforts and 24-hour room service access.',
    verifiedHighlights: [
      'Air-conditioned room',
      'Flat-screen television',
      'Refrigerator & electric kettle',
      'Private bathroom & free Wi-Fi',
    ],
  },
  {
    id: 'deluxe-queen-room',
    indexLabel: 'ROOM 02',
    name: 'Deluxe Queen Room',
    priceNgn: 45813,
    formattedPrice: '₦45,813',
    image: '/assets/aistudio/unnamed__29__010ec6e2.webp',
    imageAspect: 'portrait',
    imageAlt:
      'Representative guestroom interior at Cornels Hotel & Suites featuring fluted dark wood accent wall, warm sconce lighting, and marble-finish flooring',
    imageCaption: 'Representative guestroom interior at Cornels Hotel & Suites',
    description:
      'Thoughtfully appointed accommodation offering calm evening lighting, crisp linens, and convenient access to our restaurant, lounge, and 24-hour front desk.',
    verifiedHighlights: [
      'Air-conditioned room',
      'Flat-screen television',
      'Refrigerator & electric kettle',
      'Private bathroom & free Wi-Fi',
    ],
  },
  {
    id: 'deluxe-king-room',
    indexLabel: 'ROOM 03',
    name: 'Deluxe King Room',
    priceNgn: 67871,
    formattedPrice: '₦67,871',
    image: '/assets/aistudio/hotel-gold-ice-warri-20240806195052860700_7a7a581a.webp',
    imageAspect: 'landscape',
    imageAlt:
      'Representative spacious guestroom interior at Cornels Hotel & Suites with wood-paneled headboard, lounge seating area, work desk, and electric kettle',
    imageCaption: 'Representative guestroom interior at Cornels Hotel & Suites',
    description:
      'Our premier displayed room tier featuring generous floor space, a dedicated seating corner, work desk, and round-the-clock hospitality service.',
    verifiedHighlights: [
      'Air-conditioned suite comfort',
      'Flat-screen television',
      'Refrigerator & electric kettle',
      'Private bathroom & free Wi-Fi',
    ],
  },
];

export const FACILITY_CATEGORIES: FacilityCategory[] = [
  {
    id: 'accommodation',
    indexLabel: '01',
    title: 'Accommodation',
    summary: 'Calm, climate-controlled private rooms outfitted for business and leisure stays.',
    items: [
      'Air-conditioned rooms',
      'Flat-screen televisions',
      'Refrigerators',
      'Electric kettles',
      'Private bathrooms',
    ],
  },
  {
    id: 'dining',
    indexLabel: '02',
    title: 'Dining and Entertainment',
    summary: 'On-site dining and Cornel’s Lounge for morning breakfast, meals, and evening drinks.',
    items: ['Restaurant', 'Bar and lounge', 'Breakfast options'],
  },
  {
    id: 'services',
    indexLabel: '03',
    title: 'Guest Services',
    summary: 'Attentive round-the-clock support and practical on-site conveniences.',
    items: [
      '24-hour room service',
      '24-hour front desk',
      'Free Wi-Fi',
      'Free on-site parking',
    ],
  },
  {
    id: 'additional',
    indexLabel: '04',
    title: 'Additional Facilities',
    summary: 'Dedicated spaces on property for celebrations, gatherings, and personal grooming.',
    items: ['Event centre', 'Unisex salon'],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'exterior-courtyard',
    src: '/assets/aistudio/unnamed__24__08d43eda.webp',
    alt: 'Full exterior view of Cornels Hotel & Suites and Cornels Place mural with stamped charcoal courtyard and red architectural lines',
    caption: 'Exterior Courtyard & Main Hotel Facade',
    category: 'Exterior',
    aspect: 'landscape',
  },
  {
    id: 'lobby-reception',
    src: '/assets/aistudio/unnamed__26__5ef03d09.webp',
    alt: 'Cornels Place reception lobby with charcoal and oak front desk, warm cove ceiling, chandelier, and staircase',
    caption: '24-Hour Front Desk & Reception Lobby',
    category: 'Lobby',
    aspect: 'portrait',
  },
  {
    id: 'lounge-bar',
    src: '/assets/aistudio/unnamed__30__ec58633f.webp',
    alt: "Cornel's Lounge bar counter with fluted charcoal finish, warm under-counter lighting, cognac stools, and backlit bottle display",
    caption: "Cornel's Lounge Bar",
    category: 'Lounge & Dining',
    aspect: 'landscape',
  },
  {
    id: 'king-interior',
    src: '/assets/aistudio/hotel-gold-ice-warri-20240806195052860700_7a7a581a.webp',
    alt: 'Spacious guestroom interior with wood-paneled headboard wall, armchairs, work desk, electric kettle, and air conditioning',
    caption: 'Guestroom Seating & Work Area',
    category: 'Rooms',
    aspect: 'landscape',
  },
  {
    id: 'exterior-signage',
    src: '/assets/aistudio/unnamed__27__212c55f3.webp',
    alt: 'Architectural facade of Cornels Hotel & Suite showing charcoal cladding, white trim lines, and entrance porch',
    caption: 'Cornels Hotel & Suite Entrance Facade',
    category: 'Exterior',
    aspect: 'portrait',
  },
  {
    id: 'room-wood-cove',
    src: '/assets/aistudio/unnamed__28__35b2041d.webp',
    alt: 'Guestroom with recessed warm cove ceiling lighting, wood headboard wall, flat-screen wall area, and glass bathroom door',
    caption: 'Warm Wood-Paneled Guestroom',
    category: 'Rooms',
    aspect: 'portrait',
  },
  {
    id: 'lounge-banquette',
    src: '/assets/aistudio/unnamed__32__92832559.webp',
    alt: "Emerald velvet banquette seating and marble-top tables inside Cornel's Lounge with woven pendant lamps",
    caption: "Cornel's Lounge Velvet Banquette Seating",
    category: 'Lounge & Dining',
    aspect: 'portrait',
  },
  {
    id: 'room-sconces',
    src: '/assets/aistudio/unnamed__29__010ec6e2.webp',
    alt: 'Guestroom with charcoal upholstered bed frame, fluted timber accent wall, sculptural wall sconces, and marble-look floor',
    caption: 'Fluted Timber Wall & Ambient Lighting',
    category: 'Rooms',
    aspect: 'portrait',
  },
  {
    id: 'lounge-dining',
    src: '/assets/aistudio/unnamed__31__3655e5f5.webp',
    alt: "Cornel's Lounge dining tables with cognac chairs, textured feature wall, and red architectural ceiling light",
    caption: "Cornel's Lounge Dining & Social Space",
    category: 'Lounge & Dining',
    aspect: 'portrait',
  },
];
