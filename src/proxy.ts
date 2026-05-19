import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

function getLocaleFromHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase());

  for (const lang of preferred) {
    const base = lang.split('-')[0];
    if ((locales as readonly string[]).includes(base)) {
      return base as Locale;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin section is locale-free
  if (pathname.startsWith('/admin')) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = getLocaleFromHeader(request);
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
