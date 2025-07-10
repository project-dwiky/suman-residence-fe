"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Language, getCtaTranslation } from "@/translations";

interface CtaSectionProps {
    language: Language;
}

const CTASection = ({ language }: CtaSectionProps) => {
    const t = getCtaTranslation(language);
    
    return (
        <section
            id="cta-section"
            className="pb-20 md:pb-28 relative overflow-hidden scroll-mt-24"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Left flowing ribbon shape */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 opacity-20">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20 50C40 30 70 40 90 60C110 80 120 100 100 120C80 140 50 130 30 110C10 90 0 70 20 50Z"
                            fill="#6b7280"
                            className="animate-pulse"
                        />
                        <path
                            d="M30 70C50 50 80 60 100 80C120 100 130 120 110 140C90 160 60 150 40 130C20 110 10 90 30 70Z"
                            fill="#9ca3af"
                            opacity="0.7"
                            className="animate-pulse"
                            style={{ animationDelay: "1s" }}
                        />
                        <path
                            d="M40 90C60 70 90 80 110 100C130 120 140 140 120 160C100 180 70 170 50 150C30 130 20 110 40 90Z"
                            fill="#d1d5db"
                            opacity="0.5"
                            className="animate-pulse"
                            style={{ animationDelay: "2s" }}
                        />
                    </svg>
                </div>

                {/* Right flowing ribbon shape */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 opacity-20">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M180 50C160 30 130 40 110 60C90 80 80 100 100 120C120 140 150 130 170 110C190 90 200 70 180 50Z"
                            fill="#6b7280"
                            className="animate-pulse"
                        />
                        <path
                            d="M170 70C150 50 120 60 100 80C80 100 70 120 90 140C110 160 140 150 160 130C180 110 190 90 170 70Z"
                            fill="#9ca3af"
                            opacity="0.7"
                            className="animate-pulse"
                            style={{ animationDelay: "1.5s" }}
                        />
                        <path
                            d="M160 90C140 70 110 80 90 100C70 120 60 140 80 160C100 180 130 170 150 150C170 130 180 110 160 90Z"
                            fill="#d1d5db"
                            opacity="0.5"
                            className="animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                        />
                    </svg>
                </div>

                <div className="text-center relative z-10">
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {t.title.main}
                        <br />
                        <span className="text-secondary">{t.title.highlight}</span>
                    </motion.h2>

                    <motion.p
                        className="text-primary/75 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {t.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/kamar" passHref>
                            <Button
                                variant="outline"
                                size="lg"
                                className=" border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-base rounded-full font-medium transition-all duration-300 hover:border-gray-600"
                            >
                                {t.buttonText}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
