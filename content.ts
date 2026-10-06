/**
 * VK Apartments — all editable site content lives here.
 *
 * - Text, prices, phone, address, links and images can be changed without touching components.
 * - Images in /public/media are real VK Apartments photos.
 *   Anything marked `// REPLACE` is a placeholder (stock photo or unconfirmed fact).
 */

export const site = {
  name: "VK Apartments",
  url: "https://vkapartments.co.zm", // REPLACE with your real domain once deployed
  description:
    "Furnished apartments in Nkana East, Kitwe, Zambia. 1, 2 and 3 bedroom apartments per night with a swimming pool, secure parking, Wi-Fi and DStv. Book by WhatsApp or call 057 060 9865.",
  tagline: "New apartments in Nkana East, Kitwe",
  phone: {
    display: "057 060 9865",
    tel: "tel:+260570609865",
    whatsapp: "https://wa.me/260570609865",
    e164: "+260570609865",
  },
  address: {
    short: "Nkana East, Kitwe",
    full: "Nkana East, Kitwe, Zambia",
    locality: "Kitwe",
    region: "Copperbelt",
    country: "ZM",
  },
  map: {
    shortLink: "https://maps.app.goo.gl/GXZYvQzYwEPsuZay6?g_st=iw",
    // Resolved from the short link: Plus Code 57J4+V9G Kitwe
    lat: -12.81781,
    lng: 28.25595,
  },
  socials: [
    { label: "TikTok", href: "https://vt.tiktok.com/ZSbxJe6h6/" },
    { label: "Instagram", href: "https://www.instagram.com/reel/DN9AsO5ACBk/" },
    { label: "WhatsApp", href: "https://wa.me/260570609865" },
  ],
  branch: {
    label: "Also in Kitwe West",
    text: "Our second VK branch, along Kalulushi Road.",
  },
};

export const nav = [
  { label: "Living", href: "#manifesto" },
  { label: "Location", href: "#location" },
  { label: "Amenities", href: "#amenities" },
  { label: "Interiors", href: "#interiors" },
  { label: "Apartments", href: "#apartments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const media = {
  living: { src: "/media/living.jpg", alt: "Open-plan living room with charcoal sectional sofa, dining island and globe chandelier", w: 1080, h: 750 },
  pool: { src: "/media/pool.jpg", alt: "Private swimming pool with loungers and a covered lounge area", w: 1080, h: 810 },
  bathroom: { src: "/media/bathroom.jpg", alt: "Bathroom with grey marble-look tiles, backlit round mirror and glass shower", w: 900, h: 1080 },
  facade: { src: "/media/facade.jpg", alt: "Apartment entrance with grey facade, patio seating and hexagonal paved courtyard", w: 810, h: 1080 },
  kitchen: { src: "/media/kitchen.jpg", alt: "Grey handle-less kitchen with lit glass display cabinet, brass globe pendants and teal dining chairs", w: 800, h: 960 }, // REPLACE with a dedicated kitchen photo (currently cropped from living.jpg),
  dining: { src: "/media/dining.jpg", alt: "Breakfast bar set for two with red bar stools, lounge behind", w: 800, h: 960 },
  lounge: { src: "/media/lounge.jpg", alt: "Lounge with grey sofa, swirl rug and breakfast bar seen from above", w: 800, h: 700 }, // REPLACE with a dedicated lounge photo (currently cropped from dining.jpg),
  // Optional: drop a short muted loop at /public/media/hero.mp4 and set this to "/media/hero.mp4".
  heroVideo: null as string | null,
};

export const hero = {
  lines: [
    { text: "A home that", serif: true },
    { text: "shapes how", serif: false },
    { text: "you live", serif: false },
  ],
  tagline: site.tagline,
  image: media.living,
};

export const manifesto = {
  eyebrow: "Living at VK",
  titleSerif: "Your own rules",
  title: "of modern life",
  // Words wrapped in *asterisks* are highlighted in copper as you scroll.
  paragraph:
    "Wake to soft light across the kitchen and make *coffee* at the island. Take the short drive into *town* for meetings, errands and lunch. Come back to a quiet street in Nkana East, *swim* in the afternoon, then put the game on DStv and cook *dinner* with friends. That is a day at VK Apartments: unhurried, comfortable and *yours*.",
};

export const location = {
  eyebrow: "Location",
  titleSerif: "In the heart of",
  title: "Nkana East",
  body: [
    "Nkana East is one of Kitwe's most established neighbourhoods: tree-lined streets, quiet nights and friendly neighbours.",
    "You are minutes from Kitwe's town centre, shopping malls, schools, hospitals and restaurants. It is close enough for business and calm enough to rest.",
  ],
  // REPLACE / confirm these travel-time chips
  chips: ["Minutes to Kitwe town centre", "Quiet residential street", "Easy access to malls & services"],
  images: [media.facade, media.pool, media.lounge],
};

// REPLACE / confirm: well-known Kitwe places for the marquee strips
export const nearby = {
  rowA: ["Kitwe Town Centre", "Mukuba Mall", "ECL Mall", "Copperbelt University", "Kitwe Teaching Hospital"],
  rowB: ["VK Kitwe West · Kalulushi Road", "Nkana Stadium", "Chisokone Market", "Edinburgh Hotel", "Mindolo Dam"],
};

export type AmenityIcon = "pool" | "parking" | "shield" | "bolt" | "drop" | "leaf" | "wifi" | "tv" | "snow";

export const amenities = {
  eyebrow: "Amenities",
  titleSerif: "Your own",
  title: "territory",
  items: [
    { icon: "pool", title: "Swimming pool", text: "A sparkling pool with loungers and a covered lounge.", image: media.pool },
    { icon: "parking", title: "Secure parking", text: "Paved, gated off-street parking right at your door.", image: media.facade },
    { icon: "shield", title: "24/7 security", text: "Electric fencing, lighting and a gated compound.", image: media.facade },
    { icon: "bolt", title: "Backup power", text: "Stay switched on, even during load-shedding.", image: media.living }, // REPLACE: confirm solar / generator
    { icon: "drop", title: "Reliable water", text: "Constant water supply for showers and kitchen.", image: media.bathroom }, // REPLACE: confirm tank / borehole
    { icon: "wifi", title: "Fast Wi-Fi", text: "Work, stream and video-call from anywhere inside.", image: media.lounge },
    { icon: "tv", title: "DStv", text: "Satellite TV for the match, the news and the movies.", image: media.living },
    { icon: "snow", title: "Air conditioning", text: "Split-unit AC keeps every apartment cool.", image: media.living },
    { icon: "leaf", title: "Garden", text: "Landscaped beds, palms and a quiet patio to sit out.", image: media.facade },
  ] as { icon: AmenityIcon; title: string; text: string; image: typeof media.pool }[],
};

export const interiors = {
  eyebrow: "Interiors & design",
  titleSerif: "Stylish,",
  title: "for real",
  rows: [
    {
      title: "Kitchens made for cooking",
      text: "Gloss handle-less cabinets, glass display units lit from within, quartz-look counters, a gas hob, built-in oven and a brass mixer tap.",
      image: media.kitchen,
    },
    {
      title: "Light that sets the mood",
      text: "Cove LED ceilings, brass globe chandeliers and warm pendants over the breakfast bar. Bright for the morning, soft for the evening.",
      image: media.living,
    },
    {
      title: "Bathrooms like a hotel",
      text: "Marble-look porcelain from floor to ceiling, a backlit round mirror, wall-hung vanity and a frameless glass shower.",
      image: media.bathroom,
    },
  ],
};

export const architecture = {
  eyebrow: "Architecture",
  titleSerif: "Calm lines,",
  title: "solid ground",
  text: [
    "Low-rise, single-storey blocks in soft grey render with charcoal window frames. Each apartment has its own front door and patio.",
    "A courtyard of terracotta and sand hexagonal pavers ties the compound together, edged with palms and planted beds. The hexagon became our mark.",
  ],
  image: media.facade,
};

export const apartments = {
  eyebrow: "Apartments",
  titleSerif: "Choose your",
  title: "apartment",
  currency: "K",
  priceSuffix: "/ night",
  note: "Fully furnished, nightly stays. Book by WhatsApp or phone. No online payment needed.",
  types: [
    {
      id: "1-bed",
      label: "1 Bedroom",
      bedrooms: 1,
      bathrooms: 1, // REPLACE: confirm
      guests: 2, // REPLACE: confirm max guests
      size: null as number | null, // REPLACE: add size in m² (e.g. 55) or leave null to hide
      price: 1300,
      features: ["Open-plan lounge & kitchen", "Wi-Fi & DStv", "Air conditioning", "Pool access"],
      image: media.dining,
    },
    {
      id: "2-bed",
      label: "2 Bedroom",
      bedrooms: 2,
      bathrooms: 2, // REPLACE: confirm
      guests: 4, // REPLACE: confirm
      size: null as number | null,
      price: 1800,
      features: ["Separate dining area", "Full kitchen", "Wi-Fi & DStv", "Secure parking"],
      image: media.kitchen,
    },
    {
      id: "3-bed",
      label: "3 Bedroom",
      bedrooms: 3,
      bathrooms: 2, // REPLACE: confirm
      guests: 6, // REPLACE: confirm
      size: null as number | null,
      price: 2200,
      features: ["Spacious open-plan living", "Dining for six", "Wi-Fi & DStv", "Pool & garden"],
      image: media.living,
    },
  ],
};

export const gallery = {
  eyebrow: "Gallery",
  titleSerif: "A look",
  title: "inside",
  images: [media.living, media.kitchen, media.pool, media.bathroom, media.dining, media.facade, media.lounge],
};

export const howToBook = {
  eyebrow: "How to book",
  titleSerif: "Three steps",
  title: "to your stay",
  steps: [
    { title: "Choose", text: "Pick a 1, 2 or 3 bedroom apartment and your dates." },
    { title: "Message or call", text: "WhatsApp or call 057 060 9865. We confirm availability and the total." },
    { title: "Check in", text: "Arrive, collect your keys and make yourself at home." },
  ],
  payment: {
    title: "Payment",
    items: [
      "No online payments on this website",
      "Bookings confirmed directly by WhatsApp or phone call",
      "We'll share payment details when we confirm your dates", // REPLACE: list accepted methods (mobile money, bank, cash)
    ],
  },
};

export const contact = {
  titleSerif: "Come home to",
  title: "Nkana East",
  formTitle: "Send an enquiry",
  formNote: "Your enquiry opens in WhatsApp, ready to send to us.",
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} VK Apartments`,
};
