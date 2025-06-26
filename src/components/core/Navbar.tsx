"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scroll, setScroll] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero-section');
  const pathname = usePathname();

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '#', scrollTo: 'hero-section' },
    { name: 'Gallery', href: '#', scrollTo: 'gallery-section' },
    { name: 'Lokasi', href: '#', scrollTo: 'map-section' },
    { name: 'Fasilitas', href: '#', scrollTo: 'facility-section' },
    { name: 'Kamar', href: '/kamar' },
  ];
  
  // Function to scroll to sections
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    
    // If we're on the kamar page, navigate to home first
    if (pathname === '/kamar') {
      // Navigate to home page with hash
      window.location.href = `/#${id}`;
      return;
    }
    
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };
  
  // Function to scroll to CTA section
  const scrollToCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If we're on the kamar page, navigate to home first
    if (pathname === '/kamar') {
      // Navigate to home page with CTA hash
      window.location.href = '/#cta-section';
      return;
    }
    
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Handle Scroll Event and Active Section
  useEffect(() => {
    // Set active section based on current page
    if (pathname === '/kamar') {
      setActiveSection('kamar-page');
      return; // Don't run scroll logic on kamar page
    }

    const handleScroll = () => {
      // Handle navbar background
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
      
      // Handle active section
      const sections = [
        'hero-section',
        'gallery-section',
        'map-section',
        'facility-section',
        'cta-section'
      ];
      
      // Find which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If section is in viewport (with some buffer for navbar height)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scroll 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="h-10 transition-all duration-300 group-hover:opacity-90">
              <Image 
                src="/logo.svg" 
                alt="Suman Residence Logo" 
                width={160} 
                height={40} 
                className="object-contain h-10" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.scrollTo ? (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.scrollTo!)}
                  className={`font-medium text-sm transition-colors relative group cursor-pointer ${activeSection === link.scrollTo ? 'text-secondary font-bold' : 'text-primary hover:text-secondary'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${activeSection === link.scrollTo ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </a>
              ) : (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`text-primary hover:text-secondary font-medium text-sm transition-colors relative group ${pathname === link.href ? 'text-secondary font-bold' : ''}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={scrollToCTA}
              className="bg-primary text-white hover:bg-primary/90 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:scale-[1.03] px-6"
            >
              <span>Booking Sekarang</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } ${scroll ? 'bg-white' : 'bg-white/95'}`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3">
          {navLinks.map((link) => (
            link.scrollTo ? (
              <a
                key={link.name}
                href={link.href}
                className={`block font-medium py-2 text-sm cursor-pointer ${activeSection === link.scrollTo ? 'text-secondary font-bold' : 'text-primary hover:text-secondary'}`}
                onClick={(e) => scrollToSection(e, link.scrollTo!)}
              >
                {link.name}
                {activeSection === link.scrollTo && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`block text-primary hover:text-secondary font-medium py-2 text-sm ${pathname === link.href ? 'text-secondary font-bold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
                {pathname === link.href && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>}
              </Link>
            )
          ))}
          <Button 
            onClick={scrollToCTA}
            className="bg-primary text-white hover:bg-primary/90 rounded-full w-full mt-3 transition-all duration-300 hover:shadow-md"
          >
            <span>Booking Sekarang</span>
         
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
