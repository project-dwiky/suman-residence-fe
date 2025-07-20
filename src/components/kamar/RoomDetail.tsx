"use client";

import React, { useState, useEffect } from "react";
import Footer from "../core/Footer";
import { Button } from "@/components/ui/button";
import DirectBookingForm from "@/components/customer/DirectBookingForm";
import {
    ArrowLeft,
    Star,
    MapPin,
    Wifi,
    Snowflake,
    Tv,
    Bed,
    Bath,
    Users,
    CheckCircle,
    Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Language, getRoomDetailTranslation } from "@/translations";
import { fetchRoomData, SimpleRoom } from "@/utils/room-data";

interface RoomDetailProps {
    roomId: string;
    language: Language;
}

const RoomDetail = ({ roomId, language }: RoomDetailProps) => {
    const t = getRoomDetailTranslation(language);
    const [room, setRoom] = useState<SimpleRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    // Load room data
    useEffect(() => {
        const loadRoom = async () => {
            setLoading(true);
            
            // Fetch from API only
            const roomData = await fetchRoomData(roomId);
            setRoom(roomData);
            setLoading(false);
        };
        
        loadRoom();
    }, [roomId]);

    const handleBookingClick = () => {
        setShowBooking(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading room details...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Kamar Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-4">Kamar yang Anda cari tidak tersedia</p>
                    <Link href="/kamar">
                        <Button>Kembali ke Daftar Kamar</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/kamar" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali ke Daftar Kamar</span>
                        </Link>
                        
                        <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{room.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-200">
                            <Image
                                src={room.images[selectedImage] || '/galeri/default.jpg'}
                                alt={room.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        
                        {room.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {room.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`aspect-video relative overflow-hidden rounded cursor-pointer border-2 ${
                                            selectedImage === index ? 'border-blue-500' : 'border-transparent'
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${room.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 25vw, 12.5vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Room Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {room.name}
                            </h1>
                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                <div className="flex items-center space-x-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{room.size || 'Standard'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Suman Residence</span>
                                </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-blue-600 mb-4">
                                {room.price}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {room.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fasilitas</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {room.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Button */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-center mb-4">
                                <p className="text-gray-600 mb-2">Tertarik dengan kamar ini?</p>
                                <p className="text-sm text-gray-500">
                                    Hubungi admin untuk informasi ketersediaan dan booking
                                </p>
                            </div>
                            
                            <Button 
                                onClick={handleBookingClick}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                size="lg"
                            >
                                Pesan Sekarang
                            </Button>
                            
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    * Ketersediaan kamar akan dikonfirmasi oleh admin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Informasi Penting</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Ketentuan Sewa</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Minimal sewa 6 bulan</li>
                                <li>• Deposit 1 bulan di muka</li>
                                <li>• Listrik dan air terpisah</li>
                                <li>• Tidak boleh merusak fasilitas</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Fasilitas Umum</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Parkir motor gratis</li>
                                <li>• Security 24 jam</li>
                                <li>• Akses Wi-Fi</li>
                                <li>• Dapur umum (berbagi)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {showBooking && (
                <DirectBookingForm
                    room={{
                        id: room.id,
                        title: room.name,
                        price: room.price
                    }}
                    onClose={() => setShowBooking(false)}
                />
            )}

            <Footer />
        </div>
    );
};

export default RoomDetail;
