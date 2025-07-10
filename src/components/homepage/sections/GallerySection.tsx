"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const galleryItems = [
    {
        id: 1,
        url: "/galeri/g3.jpg",
        title: "Living Room Modern",
        description: "Ruang tamu dengan desain modern dan nyaman",
        category: "Living Room",
    },
    {
        id: 3,
        url: "/galeri/g10.jpg",
        title: "Dapur Bersama",
        description: "Dapur lengkap dengan kitchen island dan peralatan modern",
        category: "Kitchen",
    },
    {
        id: 2,
        url: "/galeri/kamar_A/3.png",
        title: "Kamar Tidur Premium",
        description: "Kamar tidur dengan pencahayaan alami",
        category: "Bedroom",
    },
    {
        id: 4,
        url: "/galeri/kamar_B/1.png",
        title: "Kamar Mandi Dalam",
        description: "Kamar mandi kontemporer dengan shower dan toilet",
        category: "Bathroom",
    },
    {
        id: 5,
        url: "/galeri/g4.jpg",
        title: "Area Parkir",
        description: "Area parkir yang luas dan aman",
        category: "Parking Area",
    },
];

const GallerySection = () => {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const categories = [
        "Semua",
        "Living Room",
        "Kitchen",
        "Bedroom",
        "Bathroom",
        "Parking Area",
    ];

    const filteredItems =
        activeCategory === "Semua"
            ? galleryItems
            : galleryItems.filter((item) => item.category === activeCategory);

    // Responsive items per view
    const getItemsPerView = () => {
        if (typeof window !== "undefined") {
            if (window.innerWidth < 640) return 1; // Mobile: 1 item
            if (window.innerWidth < 1024) return 2; // Tablet: 2 items
            return 4; // Desktop: 4 items
        }
        return 4; // Default for SSR
    };

    const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
    const maxIndex = Math.max(0, filteredItems.length - itemsPerView);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerView(getItemsPerView());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    // Reset index when category or itemsPerView changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory, itemsPerView]);

    // Auto-scroll functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= maxIndex) {
                    return 0;
                } else {
                    return prev + 1;
                }
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [maxIndex]);

    return (
        <section
            className="py-8 md:py-16 bg-gradient-to-b from-background to-muted/20"
            id="gallery-section"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Galeri Suman Residence
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Jelajahi berbagai tipe unit dan fasilitas premium yang
                        kami tawarkan untuk kenyamanan hidup modern Anda
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            variant={
                                activeCategory === category
                                    ? "default"
                                    : "outline"
                            }
                            className={`px-4 py-2 text-sm transition-all duration-300 ${
                                activeCategory === category
                                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                    : "hover:bg-primary/10"
                            }`}
                        >
                            {category}
                        </Button>
                    ))}
                </motion.div>

                {/* Gallery Carousel */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            ref={carouselRef}
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentIndex * (100 / itemsPerView)
                                }%)`,
                            }}
                        >
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="relative group cursor-pointer flex-shrink-0"
                                    style={{
                                        width: `${100 / itemsPerView}%`,
                                    }}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="relative h-[300px] md:h-[400px] mx-1 sm:mx-2 rounded-xl overflow-hidden bg-black">
                                        <Image
                                            src={item.url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.1,
                                                }}
                                                viewport={{ once: true }}
                                            >
                                                <h3 className="text-lg md:text-xl font-bold mb-2 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm md:text-base text-gray-200 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {item.description}
                                                </p>
                                                <div className="inline-flex items-center mt-3 text-secondary font-medium">
                                                    <span className="text-xs tracking-wider uppercase">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Hover effect overlay */}
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {filteredItems.length > itemsPerView && (
                        <>
                            <Button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={currentIndex >= maxIndex}
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {filteredItems.length > itemsPerView && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: maxIndex + 1 }).map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentIndex
                                                ? "bg-primary w-8"
                                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                        }`}
                                    />
                                )
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default GallerySection;
