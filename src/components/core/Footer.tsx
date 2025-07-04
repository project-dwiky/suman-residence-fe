"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1 - About */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">
                            SUMAN RESIDENCE
                        </h3>
                        <p className="text-slate-300 text-sm">
                            Hunian eksklusif dengan fasilitas premium dan lokasi
                            strategis yang dirancang untuk kehidupan yang nyaman
                            dan berkualitas.
                        </p>
                        <div className="flex items-start text-sm pt-2">
                            <MapPin
                                size={18}
                                className="mr-2 text-secondary flex-shrink-0 mt-0.5"
                            />
                            <span className="flex-1">
                                Jl. Kayee Adang Utama, Lamgugob, Kec. Syiah
                                Kuala, Kota Banda Aceh, Aceh 23115
                            </span>
                        </div>
                    </div>

                    {/* Column 2 - Contact */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">
                            Kontak
                        </h3>
                        <div className="flex items-center text-sm">
                            <Phone size={16} className="mr-2 text-secondary" />
                            <span>082211040701 (Owner)</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Phone size={16} className="mr-2 text-secondary" />
                            <span>081265945003 (Admin)</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Mail size={16} className="mr-2 text-secondary" />
                            <a
                                href="mailto:Sumanresidence338@gmail.com"
                                className="hover:text-secondary transition-colors"
                            >
                                Sumanresidence338@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Column 3 - Social Media & Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">
                            Social Media
                        </h3>

                        <div className="flex space-x-4 mb-6">
                            <a
                                href="https://www.instagram.com/Suman_Residence"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.tiktok.com/@Suman.Residence"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M19.321 5.562a4.961 4.961 0 0 1-1.908-2.272A4.99 4.99 0 0 1 17.07 1h-3.101v13.643a3.216 3.216 0 0 1-1.928.602 3.245 3.245 0 0 1-1.735-.798 3.313 3.313 0 0 1-.73-3.833 3.203 3.203 0 0 1 .642-.825 3.169 3.169 0 0 1 .865-.549 3.143 3.143 0 0 1 .957-.27V6.14A6.209 6.209 0 0 0 9.939 6.873a6.332 6.332 0 0 0-3.46 3.472 6.422 6.422 0 0 0 1.38 6.944A6.238 6.238 0 0 0 12 19.282a6.292 6.292 0 0 0 4.209-1.777 6.472 6.472 0 0 0 1.862-4.557V7.452a7.985 7.985 0 0 0 4.928 1.681v-3.137a4.928 4.928 0 0 1-3.678-.434z" />
                                </svg>
                            </a>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Links</h4>
                            <ul className="space-y-1 text-sm">
                                <li>
                                    <Link
                                        href="/"
                                        className="hover:text-secondary transition-colors"
                                    >
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/kamar"
                                        className="hover:text-secondary transition-colors"
                                    >
                                        Kamar
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/fasilitas"
                                        className="hover:text-secondary transition-colors"
                                    >
                                        Fasilitas
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="py-6 text-center border-t border-gray-200 text-sm text-gray-200">
                    <p>© {currentYear} Suman Residence. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
