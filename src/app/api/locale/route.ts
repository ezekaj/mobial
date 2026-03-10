import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr'];

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale. Supported: en, de, es, fr' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ locale });
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
