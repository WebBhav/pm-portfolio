'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const paragraphs = [
  "I get AI from demo to daily use.",
  "At Moglix, I own AI product across procure-to-pay, from document AI to agent workflows. I've driven workflows from 0% to 83% net automation, reducing manual workload across teams.",
  "Previously, I built AI content and ad-tech products at JustBaat, serving 400+ publishers. I turn complex AI capabilities into measurable business outcomes, balancing accuracy, cost, and user trust.",
  "Mechanical Engineering @ IIT Ropar. Born in Alwar. Driven by curiosity, craft, and impact."
];

// Strictly limit default description to 30 words
const allWords = paragraphs.join(' ').trim().split(/\s+/);
const STRICT_WORD_LIMIT = 30;
const truncated30Words = allWords.slice(0, STRICT_WORD_LIMIT).join(' ') + '...';

const AboutSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const fullText = (
    <div className="space-y-4">
      {paragraphs.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </div>
  );

  return (
    <section id="about" className="container mx-auto py-12 md:py-24 scroll-mt-16">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8 text-center">About Me</h2>
      <div className="multicolor-line mb-12 w-24 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <Image
            src="/handshake.jpg"
            alt="Handshake"
            width={500}
            height={375}
            className="rounded-lg shadow-xl object-cover"
            data-ai-hint="business agreement"
          />
        </div>
        <div className="md:col-span-2 text-lg text-muted-foreground space-y-4">
          <div>
            {isExpanded ? fullText : <p>{truncated30Words}</p>}
            <Button
              variant="link"
              onClick={toggleReadMore}
              className="px-0 h-auto py-1 text-accent mt-2 font-medium"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </Button>
          </div>
          <div className="pt-6 flex justify-center md:justify-start">
            <Button asChild variant="outline" size="lg">
              <Link href="/resume" target="_blank" rel="noopener noreferrer">
                Access My One-Pager <FileText className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
