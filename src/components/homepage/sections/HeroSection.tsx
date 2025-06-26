"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Hero image
  const heroImage = "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1740";

  return (
    <section className="py-6 md:py-16 bg-background relative overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-stretch">
          {/* Left Card - Content */}
          <div className="md:col-span-2 flex flex-col z-10">
            <motion.div 
              className="bg-card rounded-xl p-8 flex-1 flex flex-col justify-between shadow-md"
              initial={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              animate={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
                  <span className="text-secondary">SUMAN RESIDENCE</span> 
                  <span className="text-xl md:text-2xl block mt-1">Cozy Living Space</span>
                </h1>
              </div>
              <p className="text-muted-foreground mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full w-fit mb-3 transition-all duration-300 hover:shadow-md">
                  Booking Sekarang
                </Button>
              </motion.div>
              
              {/* Statistics */}
              <motion.div 
                className="grid grid-cols-3 gap-3 md:gap-6 mt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="relative bg-white p-3 md:p-6 pt-6 md:pt-8 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-secondary shadow-md bg-white">
                      <Image 
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=100" 
                        width={48} 
                        height={48} 
                        alt="Room" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <motion.div 
                    className="text-center pt-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-xl md:text-3xl font-bold text-primary">39<span className="text-xl md:text-3xl font-bold">+</span></p>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-tight max-w-[90px] mx-auto">Unit kamar tersedia untuk pilihan Anda</p>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-white p-3 md:p-6 pt-6 md:pt-8 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-secondary shadow-md bg-white">
                      <Image 
                        src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=100" 
                        width={48} 
                        height={48} 
                        alt="Amenities" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <motion.div 
                    className="text-center pt-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-xl md:text-3xl font-bold text-primary">12<span className="text-xl md:text-3xl font-bold">+</span></p>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-tight max-w-[90px] mx-auto">Fasilitas modern untuk kenyamanan optimal</p>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-white p-3 md:p-6 pt-6 md:pt-8 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2">
                    <motion.div 
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-secondary shadow-md bg-white flex items-center justify-center bg-amber-50"
                      initial={{ rotate: -30 }}
                      whileInView={{ rotate: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      viewport={{ once: true }}
                    >
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-center pt-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-xl md:text-3xl font-bold text-primary">5.0<span className="text-lg md:text-xl font-medium">/5</span></p>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-tight max-w-[90px] mx-auto">Dari 22 pengguna di Google Maps</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Card - Image */}
          <motion.div 
            className="md:col-span-2 relative min-h-[300px] md:min-h-[450px] rounded-xl overflow-hidden shadow-lg z-10"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-full w-full">
              <Image 
                src={heroImage} 
                alt="Suman Residence" 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
