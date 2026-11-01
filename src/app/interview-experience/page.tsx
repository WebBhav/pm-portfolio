import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/interview-auth';
import InterviewExperienceView from '@/components/sections/interview-experience-view';

export const metadata: Metadata = {
  title: 'Interview Experiences | Vaibhav Singhal',
  description: 'A collection of my interview journeys with various companies for product management roles.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

// Force dynamic server evaluation so cookies are checked per request
export const dynamic = 'force-dynamic';

export default async function InterviewExperiencePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = verifyAuthToken(authToken);

  return <InterviewExperienceView initialAuthenticated={isAuthenticated} />;
}
