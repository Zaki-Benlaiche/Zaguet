import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import CheckoutForm from './CheckoutForm';

export default async function CheckoutPage({
  params,
}: PageProps<'/[lang]/checkout'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <CheckoutForm locale={lang} dict={dict} />;
}
