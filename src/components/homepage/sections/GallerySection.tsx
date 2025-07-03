"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const images = [
    {
        url: "/galeri/g3.jpg",
        alt: "Interior living room with modern design",
    },
    {
        url: "/galeri/g4.jpg",
        alt: "Bedroom with comfortable bed and natural light",
    },
    {   
        url: "/galeri/g5.jpg",
        alt: "Modern kitchen with island and appliances",
    },
    {
        url: "/galeri/g6.jpg",
        alt: "Contemporary bathroom with shower and bathtub",
    },
    {
        url: "/galeri/g7.jpg",
        alt: "Cozy dining area with wooden table",
    },
    {
        url: "/galeri/g8.jpg",
        alt: "Stylish living room with plants and decor",
    },
    {
        url: "/galeri/g9.jpg",
        alt: "Bright bedroom with minimalist design",
    },
    {
        url: "/galeri/g10.jpg",
        alt: "Modern apartment with full kitchen",
    },
    {
        url: "/galeri/g11.jpg",
        alt: "Elegant bathroom with bathtub and vanity",
    },
    {
        url: "/galeri/g12.jpg",
        alt: "Outdoor patio with seating area",
    },
];

// Always show exactly 3 thumbnails (previous, current, next)

const GallerySection = () => {
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
    }, []);

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
        if (!isPaused && !autoplayTimerRef.current) {
            autoplayTimerRef.current = setInterval(handleNextImage, 5000);
        }

        // Clear interval on component unmount
        return () => {
            if (autoplayTimerRef.current) {
                clearInterval(autoplayTimerRef.current);
            }
        };
    }, [isPaused, handleNextImage]);

    return (
        <section className="py-6 md:py-16 bg-background" id="gallery-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-10 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-primary mb-4">
                        Galeri
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Jelajahi keindahan dan kenyamanan Suman Residence
                        melalui koleksi foto kami. Lihat lebih dekat setiap
                        detail unit dan fasilitas yang dirancang untuk kehidupan
                        modern Anda.
                    </p>
                </motion.div>

                {/* Main carousel with proper aspect ratio */}
                <motion.div
                    className="relative w-full max-md:h-[600px] mb-4 rounded-xl bg-black overflow-hidden aspect-[9/16] md:aspect-[16/9]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {/* Main image */}
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-300 ${
                                index === activeIndex
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-contain"
                                priority={index === activeIndex}
                            />
                        </div>
                    ))}

                    {/* Carousel navigation buttons */}
                    <motion.button
                        className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 z-10 transition"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                        className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 z-10 transition"
                        onClick={handleNextImage}
                        aria-label="Next image"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight size={24} />
                    </motion.button>

                    {/* Image counter */}
                    <motion.div
                        className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        viewport={{ once: true }}
                    >
                        {activeIndex + 1} / {images.length}
                    </motion.div>
                </motion.div>

                {/* Thumbnails navigation */}
                <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    {/* Thumbnails */}
                    <div className="flex justify-center gap-2 px-2 sm:px-0">
                        {visibleThumbnailIndices.map((index) => (
                            <Button
                                key={index}
                                ref={(el) => {
                                    thumbnailsRef.current[index] = el;
                                }}
                                onClick={() => handleThumbnailClick(index)}
                                variant="ghost"
                                className={`relative w-[80px] sm:w-[100px] md:w-[140px] aspect-[4/3] rounded-md overflow-hidden transition p-0 ${
                                    index === activeIndex
                                        ? "ring-2 ring-[#D6950B]"
                                        : "opacity-70 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={images[index].url}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 140px"
                                    className="object-cover"
                                />
                            </Button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GallerySection;
