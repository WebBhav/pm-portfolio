'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, KeyRound, ArrowRight, Home, Eye, EyeOff, AlertCircle, MessageSquare, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface InterviewAccessPromptProps {
  onUnlock?: () => void;
}

export default function InterviewAccessPrompt({ onUnlock }: InterviewAccessPromptProps) {
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMessage('Please enter an access code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/interview-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        try {
          sessionStorage.setItem('interview_auth_unlocked', 'true');
          localStorage.setItem('interview_auth_unlocked', 'true');
        } catch {}

        // Immediate unlock transition
        setTimeout(() => {
          if (onUnlock) {
            onUnlock();
          } else {
            window.location.reload();
          }
        }, 300);
      } else {
        setErrorMessage(data.message || 'Invalid access code');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setErrorMessage('Unable to verify access code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Card className="w-full max-w-md border-border/80 shadow-2xl bg-card/90 backdrop-blur-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent shadow-inner">
            {isSuccess ? (
              <CheckCircle2 className="h-7 w-7 text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <Lock className="h-7 w-7" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isSuccess ? 'Access Granted' : 'Protected Section'}
          </CardTitle>
          <CardDescription className="text-sm mt-2 text-muted-foreground leading-relaxed">
            {isSuccess
              ? 'Verification successful! Loading interview experiences...'
              : 'This section contains confidential round-by-round summaries, case studies, and strategic problem-solving frameworks. Please enter your access code to proceed.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="interview-code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Access Code
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                </div>
                <Input
                  id="interview-code"
                  type={showCode ? 'text' : 'password'}
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isLoading || isSuccess}
                  autoComplete="off"
                  autoFocus
                  className="pl-9 pr-10 bg-background/50 border-input focus:border-accent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showCode ? 'Hide access code' : 'Show access code'}
                  tabIndex={-1}
                  disabled={isLoading || isSuccess}
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in-50 duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading || !accessCode.trim() || isSuccess}
              className="w-full text-base font-medium transition-all"
            >
              {isSuccess ? (
                <>Unlocking...</>
              ) : isLoading ? (
                <>Verifying code...</>
              ) : (
                <>
                  Unlock Experiences <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between w-full pt-2 text-xs text-muted-foreground">
              <Button asChild variant="ghost" size="sm" className="h-auto px-1 py-1 text-xs text-muted-foreground hover:text-foreground">
                <Link href="/">
                  <Home className="mr-1.5 h-3.5 w-3.5" /> Back to Portfolio
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm" className="h-auto px-1 py-1 text-xs text-accent hover:text-accent/80 hover:bg-accent/10">
                <Link href="/query">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Request Access Code
                </Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
