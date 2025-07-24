"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import AvatarGroup from "./facilities/AvatarGroup";
import Link from "next/link";
import { Language, getTranslation } from "@/translations";

interface HeroSectionProps {
    language: Language;
}

const HeroSection = ({ language }: HeroSectionProps) => {
    const t = getTranslation(language);
    return (
        <section
            className="py-8 md:py-16 bg-gray-50 relative overflow-hidden"
            id="hero-section"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Main Heading */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                                    {t.hero.title.split(' ').slice(0, 2).join(' ')}
                                    <br />
                                    <span className="text-secondary">
                                        {t.hero.title.split(' ').slice(2).join(' ')}
                                    </span>
                                </h1>
                                {/* <AvatarGroup /> */}
                            </div>
                            <p className="text-primary text-lg font-semibold">
                                {t.hero.subtitle}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <p className="text-primary leading-relaxed">
                                {t.hero.description}
                            </p>

                            {/* Customer Review */}
                            <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-primary">5.0</span>
                                    <span className="text-xs text-primary">Google Maps</span>
                                </div>
                                
                                <blockquote className="text-primary italic text-sm leading-relaxed border-l-3 border-yellow-400 pl-4">
                                    "{t.hero.review.quote}"
                                </blockquote>
                                
                                <p className="text-xs text-primary/80">
                                    — {t.hero.review.author}
                                </p>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-start">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-4 ">
                                    <Image
                                        src="/galeri/kamar_B/1.png"
                                        width={48}
                                        height={48}
                                        alt="Tenant 1"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-primary mb-2">
                                    39+
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t.hero.stats.rooms}
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-start">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-4 ">
                                    <Image
                                        src="/galeri/g9.jpg"
                                        width={48}
                                        height={48}
                                        alt="Tenant 2"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-primary mb-2">
                                    12+
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t.hero.stats.facilities}
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-start">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-4">
                                    <Image
                                        src="/galeri/g10.jpg"
                                        width={48}
                                        height={48}
                                        alt="Tenant 3"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-primary mb-2 flex items-center gap-1">
                                    5 <Star className="w-5 h-5" />
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t.hero.stats.rating}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        className="relative h-full min-h-[600px]"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Main Property Image */}
                        <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/suman.jpg"
                                fill
                                alt="Luxury Villa"
                                className="object-cover"
                            />

                            {/* Melbourne Card Overlay */}
                            <motion.div
                                className="absolute top-6 right-6 bg-white space-x-4 rounded-2xl p-2 shadow-lg flex items-center justify-between"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="flex flex-col px-2">
                                    <div>
                                        <h4 className="font-semibold text-primary text-sm w-max">
                                            {t.hero.location.city}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {t.hero.location.country}
                                        </p>
                                    </div>
                                    <Link
                                        href="https://maps.app.goo.gl/4iswZuYEofcETz9j9"
                                        target="_blank"
                                    >
                                        <Button
                                            className="mt-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center
                                        hover:bg-primary/80 transition-all duration-300 cursor-pointer"
                                        >
                                            <ArrowRight className="w-4 h-4 -rotate-45" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="w-[100px] h-[100px] rounded-xl overflow-hidden">
                                    <Image
                                        src="/galeri/g12.jpg"
                                        width={100}
                                        height={100}
                                        alt="Melbourne Interior"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Property Description Overlay */}
                            <motion.div
                                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <p className="text-primary font-medium mb-4">
                                    {t.hero.propertyDescription}
                                </p>

                                <div className="flex items-center space-x-4">
                                    <Link href="/kamar">
                                        <Button className="bg-primary hover:bg-primary/80 text-white rounded-full">
                                            <div className="flex items-center gap-2">
                                                {t.hero.cta}
                                                <ArrowRight className="w-4 h-4 -rotate-45" />
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
