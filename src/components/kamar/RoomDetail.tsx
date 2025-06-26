"use client";

import React, { useState } from "react";
import Navbar from "../core/Navbar";
import Footer from "../core/Footer";
import { Button } from "@/components/ui/button";
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
    Phone,
    Mail,
    Clock,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Sample room data (in real app, this would come from API)
const roomData = {
    1: {
        id: 1,
        title: "Deluxe Room",
        size: "24m²",
        price: "Rp 350.000",
        originalPrice: "Rp 400.000",
        description:
            "Kamar nyaman dengan pemandangan kota yang indah, dilengkapi dengan fasilitas modern untuk kenyamanan maksimal. Kamar ini cocok untuk perjalanan bisnis maupun liburan.",
        longDescription:
            'Deluxe Room kami menawarkan pengalaman menginap yang nyaman dan mewah. Dengan luas 24m², kamar ini dilengkapi dengan tempat tidur queen yang nyaman, kamar mandi dalam yang bersih, dan pemandangan kota yang indah dari jendela kamar. AC yang sejuk, TV LED 32" dengan channel lengkap, dan WiFi gratis tersedia untuk kenyamanan Anda.',
        features: [
            "AC",
            'TV LED 32"',
            "WiFi Gratis",
            "Kamar Mandi Dalam",
            "Tempat Tidur Queen",
            "Lemari Pakaian",
        ],
        amenities: [
            {
                name: "AC",
                icon: Snowflake,
                description: "Air conditioning dengan pengaturan suhu",
            },
            {
                name: 'TV LED 32"',
                icon: Tv,
                description: "Televisi dengan channel lengkap",
            },
            {
                name: "WiFi Gratis",
                icon: Wifi,
                description: "Koneksi internet cepat",
            },
            {
                name: "Kamar Mandi Dalam",
                icon: Bath,
                description: "Kamar mandi pribadi dengan shower",
            },
            {
                name: "Tempat Tidur Queen",
                icon: Bed,
                description: "Tempat tidur queen size yang nyaman",
            },
            {
                name: "Lemari Pakaian",
                icon: Users,
                description: "Lemari pakaian dengan hanger",
            },
        ],
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        ],
        availability: "available" as const,
        type: "A" as const,
        units: 8,
        rating: 4.8,
        reviewCount: 127,
        maxGuests: 2,
        bedType: "Queen Bed",
        view: "City View",
        floor: "2-4",
        checkIn: "14:00",
        checkOut: "12:00",
        cancellation: "Free cancellation until 24 hours before check-in",
        policies: [
            "Check-in: 14:00 | Check-out: 12:00",
            "Free cancellation until 24 hours before check-in",
            "No smoking in rooms",
            "Pets not allowed",
            "Quiet hours: 22:00 - 07:00",
        ],
    },
};

const RoomDetail = ({ roomId }: { roomId: string }) => {
    const room = roomData[roomId as unknown as keyof typeof roomData];
    const [selectedImage, setSelectedImage] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Kamar tidak ditemukan
                        </h1>
                        <Link
                            href="/kamar"
                            className="text-primary hover:underline"
                        >
                            Kembali ke daftar kamar
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/kamar" className="hover:text-primary">
                            Kamar
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">{room.title}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                            <div className="relative h-96">
                                <Image
                                    src={room.images[selectedImage]}
                                    alt={room.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <Link
                                        href="/kamar"
                                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-4 gap-2">
                                    {room.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative h-20 rounded-lg overflow-hidden ${
                                                selectedImage === index
                                                    ? "ring-2 ring-primary"
                                                    : ""
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${room.title} ${
                                                    index + 1
                                                }`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Room Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {room.title}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>Banda Aceh</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>{room.rating}</span>
                                            <span>
                                                ({room.reviewCount} ulasan)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">
                                        {room.price}
                                    </div>
                                    <div className="text-sm text-gray-500 line-through">
                                        {room.originalPrice}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <div className="text-sm text-gray-600">
                                        Max {room.maxGuests} tamu
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <div className="text-sm text-gray-600">
                                        {room.bedType}
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 mx-auto mb-2 text-primary">
                                        🏙️
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {room.view}
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 mx-auto mb-2 text-primary">
                                        🏢
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Lantai {room.floor}
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-4">
                                    Deskripsi Kamar
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {room.longDescription}
                                </p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h3 className="text-xl font-semibold mb-6">
                                Fasilitas Kamar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {room.amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <amenity.icon className="w-5 h-5 text-primary flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">
                                                {amenity.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {amenity.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Policies */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-xl font-semibold mb-6">
                                Kebijakan Kamar
                            </h3>
                            <div className="space-y-3">
                                {room.policies.map((policy, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">
                                            {policy}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Pesan Kamar
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Check-in
                                        </label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) =>
                                                setCheckIn(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Check-out
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) =>
                                                setCheckOut(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jumlah Tamu
                                        </label>
                                        <select
                                            value={guests}
                                            onChange={(e) =>
                                                setGuests(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            {[1, 2].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} tamu
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">
                                            Harga per malam
                                        </span>
                                        <span className="font-medium">
                                            {room.price}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">
                                            Diskon
                                        </span>
                                        <span className="text-green-600">
                                            -Rp 50.000
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {room.price}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-4">
                                    Pesan Sekarang
                                </Button>

                                <div className="text-center text-sm text-gray-600 mb-4">
                                    {room.cancellation}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">
                                        Butuh bantuan?
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>+62 812-3456-7890</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>info@sumanresidence.com</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>24/7 Customer Service</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RoomDetail;
