"use client";

import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Sample room data (in real app, this would come from API)
const roomData = {
    1: {
        id: 1,
        title: "Kamar Tipe A",
        size: "4 x 4 meter",
        price: "Rp 1.500.000",
        originalPrice: "Rp 1.800.000",
        pricePerMonth: "Rp 1.500.000",
        description:
            "Kamar eksklusif khusus perempuan dengan ukuran 4x4 meter. Dilengkapi dengan fasilitas modern untuk kenyamanan maksimal dalam hunian kos-kosan premium di Banda Aceh.",
        longDescription:
            'Kamar Tipe A di Suman Residence menawarkan hunian kos-kosan eksklusif khusus perempuan dengan konsep "Cozy Living Space". Dengan ukuran 4x4 meter, kamar ini dilengkapi dengan kasur Queen Bed yang nyaman, AC untuk kenyamanan suhu ruangan, lemari pakaian yang cukup luas, meja nakas, dan tempat sampah.',
        features: [
            "AC",
            "Kasur Queen Bed",
            "WiFi Gratis",
            "Lemari Pakaian",
            "Meja Nakas", 
            "Tempat Sampah"
        ],
        amenities: [
            {
                name: "AC",
                icon: Snowflake,
                description: "Air conditioning untuk kenyamanan suhu ruangan",
            },
            {
                name: "Kasur Queen Bed",
                icon: Bed,
                description: "Kasur queen size yang nyaman untuk istirahat optimal",
            },
            {
                name: "WiFi Gratis",
                icon: Wifi,
                description: "Koneksi internet gratis untuk kebutuhan digital",
            },
            {
                name: "Lemari Pakaian",
                icon: Users,
                description: "Lemari pakaian dengan kapasitas yang memadai",
            },
            {
                name: "Meja Nakas",
                icon: Tv,
                description: "Meja nakas untuk keperluan pribadi",
            },
            {
                name: "Tempat Sampah",
                icon: Bath,
                description: "Tempat sampah untuk menjaga kebersihan kamar",
            },
        ],
        images: ["/galeri/kamar_A/h1.JPG", "/galeri/kamar_A/h2.JPG"],
        availability: "available" as const,
        type: "A" as const,
        units: 35,
        totalUnits: 39,
        rating: 4.9,
        reviewCount: 89,
        maxGuests: 1,
        bedType: "Queen Bed",
        view: "City View",
        floor: "Lantai 1-3",
        checkIn: "Fleksibel 24 jam",
        checkOut: "Sesuai kontrak sewa",
        rentalPeriods: ["Mingguan", "Bulanan", "Semester", "Tahunan"],
        policies: [
            "Hunian khusus perempuan",
            "Check-in fleksibel 24 jam",
            "Akses WiFi gratis unlimited", 
            "Air PDAM gratis",
            "Parkir gratis (mobil & motor)",
            "Listrik prabayar per kamar",
            "Laundry antar jemput tersedia"
        ],
        includedFacilities: [
            "Free Air PDAM",
            "Free WiFi", 
            "Free Parkir"
        ],
        excludedFacilities: [
            "Listrik prabayar per kamar"
        ],
        sharedFacilities: [
            "Void Lounge",
            "Dapur Bersama", 
            "Area Jemuran",
            "Balkon",
            "Parkiran (Mobil & Motor)"
        ],
        contact: {
            owner: "08221140701",
            admin: "081265945003", 
            email: "Sumanresidence338@gmail.com",
            instagram: "@Suman_Residence",
            tiktok: "@Suman.Residence"
        }
    },
    2: {
        id: 2,
        title: "Kamar Tipe B", 
        size: "4 x 5,5 meter",
        price: "Rp 2.100.000",
        originalPrice: "Rp 2.400.000",
        pricePerMonth: "Rp 2.100.000",
        description:
            "Kamar premium khusus perempuan dengan ukuran lebih luas 4x5,5 meter. Suite eksklusif dengan ruang yang lebih fleksibel untuk kenyamanan maksimal.",
        longDescription:
            'Kamar Tipe B di Suman Residence adalah pilihan premium dengan ukuran 4x5,5 meter yang memberikan ruang lebih luas dan fleksibel. Hunian kos-kosan eksklusif khusus perempuan ini dilengkapi dengan semua fasilitas modern termasuk kasur Queen Bed, AC, lemari pakaian yang lebih besar, meja nakas, dan area yang lebih lega untuk aktivitas sehari-hari.',
        features: [
            "AC",
            "Kasur Queen Bed", 
            "WiFi Gratis",
            "Lemari Pakaian Besar",
            "Meja Nakas",
            "Area Lebih Luas"
        ],
        amenities: [
            {
                name: "AC",
                icon: Snowflake,
                description: "Air conditioning untuk kenyamanan suhu ruangan",
            },
            {
                name: "Kasur Queen Bed",
                icon: Bed,
                description: "Kasur queen size premium yang sangat nyaman",
            },
            {
                name: "WiFi Gratis", 
                icon: Wifi,
                description: "Koneksi internet gratis unlimited",
            },
            {
                name: "Lemari Pakaian Besar",
                icon: Users,
                description: "Lemari pakaian dengan kapasitas ekstra besar",
            },
            {
                name: "Meja Nakas",
                icon: Tv,
                description: "Meja nakas dengan storage tambahan",
            },
            {
                name: "Area Lebih Luas", 
                icon: Bath,
                description: "Ruang kamar yang lebih lega dan fleksibel",
            },
        ],
        images: ["/galeri/kamar_A/h1.JPG", "/galeri/kamar_A/h2.JPG"],
        availability: "limited" as const,
        type: "B" as const,
        units: 5,
        totalUnits: 39,
        rating: 4.9,
        reviewCount: 89,
        maxGuests: 1,
        bedType: "Queen Bed",
        view: "Premium City View", 
        floor: "Lantai 2-3",
        checkIn: "Fleksibel 24 jam",
        checkOut: "Sesuai kontrak sewa",
        rentalPeriods: ["Mingguan", "Bulanan", "Semester", "Tahunan"],
        policies: [
            "Hunian khusus perempuan",
            "Check-in fleksibel 24 jam",
            "Akses WiFi gratis unlimited",
            "Air PDAM gratis", 
            "Parkir gratis (mobil & motor)",
            "Listrik prabayar per kamar",
            "Laundry antar jemput tersedia"
        ],
        includedFacilities: [
            "Free Air PDAM",
            "Free WiFi",
            "Free Parkir"
        ],
        excludedFacilities: [
            "Listrik prabayar per kamar"
        ],
        sharedFacilities: [
            "Void Lounge",
            "Dapur Bersama",
            "Area Jemuran", 
            "Balkon",
            "Parkiran (Mobil & Motor)"
        ],
        contact: {
            owner: "08221140701",
            admin: "081265945003",
            email: "Sumanresidence338@gmail.com", 
            instagram: "@Suman_Residence",
            tiktok: "@Suman.Residence"
        }
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
                                        <Select
                                            value={guests.toString()}
                                            onValueChange={(value) =>
                                                setGuests(Number(value))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih jumlah tamu" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                <SelectItem value="1">
                                                    1 Tamu
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    2 Tamu
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-4">
                                    Pesan Sekarang
                                </Button>

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
