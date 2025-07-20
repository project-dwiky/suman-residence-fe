"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { RentalData } from '../types';

interface GallerySectionProps {
  rentalData: RentalData;
}

const GallerySection: React.FC<GallerySectionProps> = ({ rentalData }) => {
  // Safely handle imagesGallery that might be undefined or not an array
  const imageGallery = rentalData.room?.imagesGallery;
  const images = (Array.isArray(imageGallery) && imageGallery.length > 0) 
    ? imageGallery.map(url => ({
        url,
        alt: `Kamar ${rentalData.room.roomNumber} - ${rentalData.room.type}`
      }))
    : [{ 
        url: '/images/room-placeholder.jpg', 
        alt: `Kamar ${rentalData.room.roomNumber} - ${rentalData.room.type}` 
      }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const thumbnailsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle next/previous image
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetAutoplayTimer();
  };

  const handleNextImage = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);
  
  // Reset autoplay timer when user interacts
  const resetAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  // Handle thumbnail navigation
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    resetAutoplayTimer();
  };
  
  // Get the 3 thumbnails to show (previous, current, next)
  const getVisibleThumbnails = () => {
    // If we have fewer than 3 images, just return all of them
    if (images.length <= 3) {
      return images.map((_, index) => index);
    }
    
    // Get indices of previous, current, and next images
    const prev = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    const next = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    
    return [prev, activeIndex, next];
  };
  
  const visibleThumbnailIndices = getVisibleThumbnails();
  
  // Setup autoplay
  useEffect(() => {
    // Set up autoplay - move to next image every 5 seconds
    if (!isPaused && !autoplayTimerRef.current && images.length > 1) {
      autoplayTimerRef.current = setInterval(handleNextImage, 5000);
    }
    
    // Clear interval on component unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPaused, handleNextImage, images.length]);

  // If no images, show simple placeholder without card
  if (images.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <div>
      {/* Main carousel */}
      <motion.div 
        className="relative w-full aspect-[16/9] overflow-hidden rounded-lg" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main image */}
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              priority={index === activeIndex}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        ))}
        
        {/* Room details overlay */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
          <h2 className="text-xl font-bold md:text-2xl">
            Kamar {rentalData.room.roomNumber}
          </h2>
          <p className="text-sm opacity-90">Lantai {rentalData.room.floor}</p>
        </div> */}

        {/* Carousel navigation buttons */}
        <motion.button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 z-10 transition"
          onClick={handlePrevImage}
          aria-label="Previous image"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 z-10 transition"
          onClick={handleNextImage}
          aria-label="Next image"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={24} />
        </motion.button>

        {/* Image counter */}
        <motion.div 
          className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {activeIndex + 1} / {images.length}
        </motion.div>
      </motion.div>

      {/* Thumbnails navigation - exactly 3 thumbnails */}
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Thumbnails */}
        <div className="grid grid-cols-3 gap-3">
          {visibleThumbnailIndices.map((index) => (
            <button
              key={index}
              ref={(el) => { thumbnailsRef.current[index] = el; }}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-full aspect-[16/9] rounded-md overflow-hidden transition ${index === activeIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
            >
              <Image
                src={images[index].url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GallerySection;
