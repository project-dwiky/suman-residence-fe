'use client'

import React from 'react';
import Navbar from "../core/Navbar";
import Footer from "../core/Footer";
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoomTypeCard from '../homepage/sections/facilities/RoomTypeCard';

// Sample room data
const roomData = [
  {
    id: 1,
    title: "Deluxe Room",
    size: "24m²",
    price: "Rp 350.000",
    description: "Kamar nyaman dengan pemandangan kota yang indah, dilengkapi dengan fasilitas modern untuk kenyamanan maksimal.",
    features: ["AC", "TV LED 32\"", "WiFi Gratis", "Kamar Mandi Dalam", "Tempat Tidur Queen", "Lemari Pakaian"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    availability: "available" as const,
    type: "A" as const,
    units: 8
  },
  {
    id: 2,
    title: "Superior Room",
    size: "28m²",
    price: "Rp 450.000",
    description: "Kamar premium dengan ruang yang lebih luas, ideal untuk keluarga kecil atau perjalanan bisnis.",
    features: ["AC", "TV LED 43\"", "WiFi Gratis", "Kamar Mandi Dalam", "Tempat Tidur King", "Lemari Pakaian", "Meja Kerja"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    availability: "limited" as const,
    type: "B" as const,
    units: 4
  },
  {
    id: 3,
    title: "Family Room",
    size: "35m²",
    price: "Rp 550.000",
    description: "Kamar keluarga yang luas dengan 2 tempat tidur, sempurna untuk keluarga dengan anak-anak.",
    features: ["AC", "TV LED 55\"", "WiFi Gratis", "Kamar Mandi Dalam", "2 Tempat Tidur", "Lemari Pakaian", "Sofa", "Balkon"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    availability: "available" as const,
    type: "A" as const,
    units: 3
  },
  {
    id: 4,
    title: "Executive Suite",
    size: "45m²",
    price: "Rp 750.000",
    description: "Suite mewah dengan ruang tamu terpisah, cocok untuk tamu VIP atau perjalanan bisnis premium.",
    features: ["AC", "TV LED 65\"", "WiFi Gratis", "Kamar Mandi Dalam", "Tempat Tidur King", "Ruang Tamu", "Meja Kerja", "Mini Bar"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    availability: "limited" as const,
    type: "B" as const,
    units: 2
  }
];

const Kamar = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Pilihan Kamar Kami
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Nikmati kenyamanan dan kemewahan di setiap kamar yang dirancang khusus untuk memberikan pengalaman menginap terbaik
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari kamar..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <Button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Banda Aceh</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>4.8/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Kamar Tersedia
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Pilih kamar yang sesuai dengan kebutuhan dan budget Anda. Semua kamar dilengkapi dengan fasilitas modern dan pelayanan terbaik.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {roomData.map((room, index) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <RoomTypeCard {...room} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 bg-white rounded-2xl shadow-lg p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Check-in Fleksibel</h3>
                                <p className="text-gray-600">Check-in tersedia 24 jam dengan pelayanan yang ramah dan profesional</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Reservasi Instan</h3>
                                <p className="text-gray-600">Booking kamar dapat dilakukan secara online dengan konfirmasi instan</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Kenyamanan Maksimal</h3>
                                <p className="text-gray-600">Setiap kamar dirancang untuk memberikan kenyamanan dan privasi terbaik</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Kamar;
