"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section id="cta-section" className="py-6 md:py-12 bg-background relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-secondary/90 px-6 py-10 md:py-16 shadow-xl overflow-hidden relative">
          {/* Professional geometric background pattern */}
          <div className="absolute inset-0 opacity-10">
            {/* Right side pattern */}
            <svg className="absolute right-0 top-0 h-full" width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M600 0V400H0L600 0Z" fillOpacity="0.1" fill="white"/>
              <path d="M600 0V300H150L600 0Z" fillOpacity="0.1" fill="white"/>
              <path d="M600 0V200H300L600 0Z" fillOpacity="0.1" fill="white"/>
              <path d="M600 0V100H450L600 0Z" fillOpacity="0.1" fill="white"/>
            </svg>
            
            {/* Left side subtle grid pattern */}
            <svg className="absolute left-0 bottom-0 h-3/4" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50" x2="300" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="0" y1="100" x2="300" y2="100" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="0" y1="150" x2="300" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="0" y1="200" x2="300" y2="200" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="0" y1="250" x2="300" y2="250" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              
              <line x1="50" y1="0" x2="50" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="100" y1="0" x2="100" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="150" y1="0" x2="150" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
              <line x1="250" y1="0" x2="250" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="8 8"/>
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Siap untuk memulai hidup nyaman?
            </motion.h2>
            
            <motion.p 
              className="text-white/90 text-lg mb-8 md:mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Booking sekarang untuk mendapatkan kesempatan hunian terbaik sesuai kebutuhan Anda.
              Dapatkan penawaran spesial untuk booking minggu ini.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/kamar" passHref>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Booking Sekarang
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
