export const RESTAURANT = {
  name: 'Zaguette family',
  phone: '+213 38 00 00 00',
  whatsapp: '+213600000000',
  email: 'contact@zaguettefamily.dz',
  address: {
    fr: 'Cité Aïn Achir, Annaba, Algérie',
    ar: 'حي عين عشير، ولاية عنابة، الجزائر',
    en: 'Aïn Achir, Annaba, Algeria',
  },
  hours: {
    fr: 'Tous les jours : 11h30 - 23h30',
    ar: 'كل الأيام: 11:30 - 23:30',
    en: 'Daily: 11:30 - 23:30',
  },
  social: {
    instagram: 'https://instagram.com/zaguettefamily',
    facebook: 'https://facebook.com/zaguettefamily',
    tiktok: 'https://tiktok.com/@zaguettefamily',
  },
  mapsEmbedSrc:
    'https://www.google.com/maps?q=Cit%C3%A9+A%C3%AFn+Achir%2C+Annaba%2C+Alg%C3%A9rie&output=embed',
  geo: { lat: 36.8702, lng: 7.7851 }, // Annaba (approx — replace with exact pin)
  city: 'Annaba',
  country: 'DZ',
  priceRange: '800–1600 DZD',
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://zaguet.vercel.app';
