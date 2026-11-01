'use client';

import type { ComponentProps } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Mail, Menu } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';
import { useLoading } from '@/contexts/loading-context';
import { usePathname } from 'next/navigation';


const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#journey', label: 'Journey' },
  { href: '/#skills', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
  { href: '/#positions', label: 'PORs' },
  { href: '/#awards', label: 'Awards' },
  { href: '/interview-experience', label: 'Interviews' },
];

const NavLink = ({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const pathname = usePathname();
  const isPageLink = href.startsWith('/') && !href.startsWith('/#');
  const isActive = isPageLink && pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'transition-colors px-3 py-2 rounded-md text-sm font-medium',
        'text-muted-foreground hover:text-foreground hover:bg-accent/10',
        isActive && 'text-accent font-semibold',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      suppressHydrationWarning
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick,
}: ComponentProps<typeof Link> & { onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
  const pathname = usePathname();
  const isPageLink = (href as string).startsWith('/') && !(href as string).startsWith('/#');
  const isActive = isPageLink && pathname === (href as string);

  return (
    <SheetClose asChild>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'block py-2 text-base font-medium transition-colors rounded-sm px-3',
          'text-foreground/80 hover:text-foreground hover:bg-accent/10',
          isActive && 'text-accent font-semibold',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
        )}
        aria-current={isActive ? 'page' : undefined}
        suppressHydrationWarning
      >
        {children}
      </Link>
    </SheetClose>
  );
};

const Header = () => {
  const { setIsLoading } = useLoading();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkCollision = () => {
      if (!containerRef.current || !brandRef.current || !actionsRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const brandWidth = brandRef.current.offsetWidth;
      const actionsWidth = actionsRef.current.offsetWidth;
      
      // Known natural width of the 7 nav links with padding and gaps (~530px)
      const navWidth = navRef.current ? Math.max(navRef.current.scrollWidth, 530) : 530;
      
      // Buffer of 48px to guarantee tabs NEVER touch any adjacent element
      const availableSpace = containerWidth - brandWidth - actionsWidth;
      const shouldCollapse = availableSpace < (navWidth + 48) || window.innerWidth < 1280;

      setIsCollapsed(shouldCollapse);
    };

    checkCollision();

    const observer = new ResizeObserver(() => {
      checkCollision();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', checkCollision);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkCollision);
    };
  }, []);

  const handleNavigationClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
        return;
    }
    if (href.startsWith('/#') && pathname === '/') {
        e.preventDefault();
        const elementId = href.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (window.location.hash !== `#${elementId}`) {
                history.pushState(null, '', `/#${elementId}`);
            }
        }
    }
  }, [pathname]);

  const handleSheetLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsSheetOpen(false);
    handleNavigationClick(e, href);
  }, [handleNavigationClick]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className="multicolor-line"></div>
      <div ref={containerRef} className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 relative" suppressHydrationWarning>
        
        {/* Left: Logo & Brand */}
        <div ref={brandRef} className="flex justify-start items-center shrink-0 z-10" suppressHydrationWarning>
          <Link href="/" className="flex items-center space-x-2" onClick={(e) => handleNavigationClick(e, '/')} suppressHydrationWarning>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-accent">
              <rect width="256" height="256" fill="none"></rect>
              <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
              <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
            </svg>
            <span className="font-bold text-base sm:text-lg whitespace-nowrap">Vaibhav Singhal</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div 
          className={cn(
            "justify-center items-center flex-1 px-4 transition-opacity duration-150",
            isCollapsed ? "hidden" : "hidden xl:flex"
          )} 
          suppressHydrationWarning
        >
          <nav ref={navRef} className="flex items-center space-x-1 lg:space-x-2 whitespace-nowrap" suppressHydrationWarning>
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigationClick(e, link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div ref={actionsRef} className="flex justify-end items-center gap-2 sm:gap-4 shrink-0 z-10" suppressHydrationWarning>
          <Button asChild variant="default" size="sm" className="shadow-md hidden sm:inline-flex">
            <Link href="#contact" onClick={(e) => handleNavigationClick(e, '#contact')}>
              <Mail className="mr-2 h-4 w-4" /> Contact Me
            </Link>
          </Button>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "hover:bg-accent/10 focus:ring-2 focus:ring-ring",
                  isCollapsed ? "inline-flex" : "xl:hidden"
                )}
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background p-0 flex flex-col">
               <SheetHeader className="p-6 pb-4 border-b">
                 <div className="flex items-center space-x-2">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5 text-accent">
                     <rect width="256" height="256" fill="none"></rect>
                     <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                     <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                   </svg>
                   <span className="font-semibold text-lg">Menu</span>
                 </div>
                 <VisuallyHidden>
                   <SheetTitle>Main Menu</SheetTitle>
                   <SheetDescription>Links to different sections of the portfolio.</SheetDescription>
                 </VisuallyHidden>
              </SheetHeader>
              <ScrollArea className="flex-grow">
                <ScrollAreaViewport className="h-full p-6">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <MobileNavLink
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleSheetLinkClick(e, link.href)}
                      >
                        {link.label}
                      </MobileNavLink>
                    ))}
                  </nav>
                </ScrollAreaViewport>
              </ScrollArea>
              <div className="p-6 mt-auto border-t">
                <SheetClose asChild>
                  <Button asChild variant="default" className="w-full">
                    <Link href="#contact" onClick={(e) => handleSheetLinkClick(e, '#contact')}>
                        <Mail className="mr-2 h-4 w-4" /> Contact Me
                    </Link>
                  </Button>
                </SheetClose>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;