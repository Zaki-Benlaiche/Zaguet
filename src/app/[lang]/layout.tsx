import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, isLocale, getDirection } from '@/i18n/config';
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
  return {
    title: `${dict.brand.name} | ${dict.brand.tagline}`,
    description: dict.brand.shortDesc,
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
