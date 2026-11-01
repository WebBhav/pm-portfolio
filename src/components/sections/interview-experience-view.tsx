'use client';

import { useState, useEffect } from 'react';
import InterviewAccessPrompt from '@/components/sections/interview-access-prompt';
import InterviewContent from '@/components/sections/interview-content';

interface InterviewExperienceViewProps {
  initialAuthenticated: boolean;
}

export default function InterviewExperienceView({ initialAuthenticated }: InterviewExperienceViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);

  useEffect(() => {
    // Check if previously authorized via client session storage (e.g., in iframe or private browsing)
    if (!initialAuthenticated) {
      try {
        const sessionActive = sessionStorage.getItem('interview_auth_unlocked') === 'true' ||
                              localStorage.getItem('interview_auth_unlocked') === 'true';
        if (sessionActive) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Storage access error:', err);
      }
    }
  }, [initialAuthenticated]);

  const handleUnlock = () => {
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <InterviewAccessPrompt onUnlock={handleUnlock} />;
  }

  return <InterviewContent onLock={handleLock} />;
}
