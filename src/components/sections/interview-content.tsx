'use client';

import { useState } from 'react';
import InterviewPost from '@/components/sections/interview-post';
import { Separator } from '@/components/ui/separator';
import AnimatedSection from '@/components/ui/animated-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Briefcase, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { interviewExperiences } from '@/data/interview-data';

interface InterviewContentProps {
  onLock?: () => void;
}

export default function InterviewContent({ onLock }: InterviewContentProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      try {
        sessionStorage.removeItem('interview_auth_unlocked');
        localStorage.removeItem('interview_auth_unlocked');
      } catch {}

      await fetch('/api/interview-auth/logout', { method: 'POST' });
      if (onLock) {
        onLock();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-12 md:space-y-16 animate-in fade-in-50 duration-300">
      {/* Session Header / Lock Option */}
      <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-card/60 border border-border/60 text-xs sm:text-sm text-muted-foreground backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1.5 font-normal py-0.5 px-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Authorized Session</span>
          </Badge>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            Access unlocked with code
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Lock and clear session"
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {isLoggingOut ? 'Locking...' : 'Lock / Exit'}
        </Button>
      </div>

      <AnimatedSection>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Interview Experience</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A structured breakdown of my interview journeys, problem-solving approaches, and learnings across product management roles.
          </p>
          <div className="multicolor-line mt-6 mb-12 w-24 mx-auto"></div>
        </div>
      </AnimatedSection>

      <div className="space-y-12">
        {interviewExperiences.map((experience, index) => (
          <AnimatedSection key={index}>
            <InterviewPost {...experience} />
            {index < interviewExperiences.length - 1 && <Separator className="my-12" />}
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <div className="text-center mt-16 space-y-6">
          <p className="text-muted-foreground">More experiences coming soon...</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="outline">
              <Link href="/#journey">
                <Briefcase className="mr-2 h-5 w-5" /> My Professional Journey
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" /> Lock Section
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
