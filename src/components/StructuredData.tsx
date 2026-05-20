import { RESTAURANT, SITE_URL } from '@/config/restaurant';
import type { Locale } from '@/i18n/config';

export default function StructuredData({ locale }: { locale: Locale }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: RESTAURANT.name,
    image: [
      `${SITE_URL}/terrace-sea.png`,
      `${SITE_URL}/pizza-duo.png`,
      `${SITE_URL}/restaurant-sign.png`,
    ],
    url: SITE_URL,
    telephone: RESTAURANT.phone,
    email: RESTAURANT.email,
    servesCuisine: ['Italian', 'Pizza'],
    priceRange: RESTAURANT.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: RESTAURANT.address[locale],
      addressLocality: RESTAURANT.city,
      addressCountry: RESTAURANT.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: RESTAURANT.geo.lat,
      longitude: RESTAURANT.geo.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '11:30',
      closes: '23:30',
    },
    sameAs: [
      RESTAURANT.social.instagram,
      RESTAURANT.social.facebook,
      RESTAURANT.social.tiktok,
    ],
    acceptsReservations: 'True',
    hasMenu: `${SITE_URL}/${locale}/menu`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
