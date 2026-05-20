import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import StructuredData from '@/components/StructuredData';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, isLocale, getDirection } from '@/i18n/config';
import { SITE_URL } from '@/config/restaurant';
import '../globals.css';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.brand.name} | ${dict.brand.tagline}`;
  const description = dict.brand.shortDesc;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${dict.brand.name}`,
    },
    description,
    keywords: [
      'pizza',
      'pizza Annaba',
      'pizza feu de bois',
      'Aïn Achir',
      'restaurant italien Annaba',
      'Zaguette',
      'pizza vue mer',
    ],
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
    openGraph: {
      type: 'website',
      siteName: dict.brand.name,
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      locale: lang,
      images: [
        {
          url: '/terrace-sea.png',
          width: 1200,
          height: 630,
          alt: dict.brand.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/terrace-sea.png'],
    },
  };
}

export default async function LocaleLayout({
  params,
  children,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const dir = getDirection(lang);

  return (
    <html lang={lang} dir={dir}>
      <body className="page-wrapper">
        <StructuredData locale={lang} />
        <I18nProvider locale={lang} dict={dict}>
          <CartProvider>
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer locale={lang} />
            <FloatingWhatsApp />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
