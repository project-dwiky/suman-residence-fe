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
    title: "Kamar Tipe A",
    size: "4 x 4 meter",
    price: "Rp 1.500.000",
    description: "Kamar nyaman dengan ukuran compact, ideal untuk mahasiswi atau profesional muda. Dilengkapi dengan fasilitas modern untuk kenyamanan maksimal.",
    features: ["AC", "Kasur Queen Bed", "Wi-Fi Gratis", "Lemari Pakaian", "Meja Nakas", "Tempat Sampah"],
    image: "/galeri/kamar_A/h2.JPG",
    availability: "available" as const,
    type: "A" as const,
    units: 35
  },
  {
    id: 2,
    title: "Kamar Tipe B", 
    size: "4 x 5,5 meter",
    price: "Rp 2.100.000",
    description: "Kamar luas dengan ruang yang lebih fleksibel untuk kebutuhan Anda. Suite premium dengan area kerja dan penyimpanan yang lebih besar.",
    features: ["AC", "Kasur Queen Bed", "Wi-Fi Gratis", "Lemari Pakaian Besar", "Meja Nakas", "Area Kerja"],
    image: "/galeri/kamar_A/h1.JPG",
    availability: "limited" as const,
    type: "B" as const,
    units: 5
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


            {/* Rooms Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
