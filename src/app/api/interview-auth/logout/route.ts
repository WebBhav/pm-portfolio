import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/interview-auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out of interview section:', err);
    return NextResponse.json(
      { success: false, message: 'An error occurred during logout.' },
      { status: 500 }
    );
  }
}
