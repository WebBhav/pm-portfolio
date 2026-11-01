import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_COOKIE_NAME,
  getExpectedAuthToken,
  validateAccessCode,
} from '@/lib/interview-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please provide an access code.' },
        { status: 400 }
      );
    }

    const isValid = validateAccessCode(code);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid access code' },
        { status: 401 }
      );
    }

    const token = getExpectedAuthToken();
    const cookieStore = await cookies();

    // Set secure, HTTP-only, SameSite cookie with persistent session (no 24h expiration)
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // Stays valid until explicit logout or browser data clear
    });

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    console.error('Error verifying interview access code:', err?.stack || err?.message || err);
    return NextResponse.json(
      { success: false, message: 'An error occurred while validating the code.', error: err?.message },
      { status: 500 }
    );
  }
}
