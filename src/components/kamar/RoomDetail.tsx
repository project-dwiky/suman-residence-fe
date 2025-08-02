"use client";

import React, { useState } from "react";
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
    Armchair,
    Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Language, getRoomDetailTranslation } from "@/translations";
import { getStaticRoomById } from "@/utils/static-room-data";

interface RoomDetailProps {
    roomId: string;
    language: Language;
}

const RoomDetail = ({ roomId, language }: RoomDetailProps) => {
    const t = getRoomDetailTranslation(language);

    // Get room data from static translations
    const room = getStaticRoomById(roomId, language);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const handleBookingClick = () => {
        setShowBooking(true);
    };

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {t.notFound.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{t.notFound.backLink}</p>
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
                        <Link
                            href="/kamar"
                            className="flex items-center space-x-2 hover:text-secondary duration-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali ke Daftar Kamar</span>
                        </Link>

                        <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{room.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div>
                    {/* Image Gallery */}
                    <div className="relative">
                        <div className="grid grid-cols-4 gap-2 h-64 md:h-96">
                            {/* Main Image - Left Side (2 columns) */}
                            <div
                                className="col-span-2 relative overflow-hidden rounded-l-lg bg-gray-200 cursor-pointer"
                                onClick={() => setShowAllPhotos(true)}
                            >
                                <Image
                                    src={
                                        room.images[0] || "/galeri/default.jpg"
                                    }
                                    alt={room.title}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </div>

                            {/* Right Side Grid (2 columns, 2 rows) */}
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                {room.images.slice(1, 5).map((image, index) => (
                                    <div
                                        key={index + 1}
                                        className={`relative overflow-hidden bg-gray-200 cursor-pointer ${
                                            index === 0
                                                ? ""
                                                : index === 1
                                                ? "rounded-tr-lg"
                                                : index === 2
                                                ? ""
                                                : "rounded-br-lg"
                                        }`}
                                        onClick={() => setShowAllPhotos(true)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${room.title} ${index + 2}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 25vw, 16.5vw"
                                        />
                                    </div>
                                ))}

                                {/* Fill empty slots if less than 4 additional images */}
                                {room.images.length < 5 &&
                                    [...Array(5 - room.images.length)].map(
                                        (_, index) => (
                                            <div
                                                key={`empty-${index}`}
                                                className={`bg-gray-100 ${
                                                    room.images.length +
                                                        index ===
                                                    2
                                                        ? "rounded-tr-lg"
                                                        : room.images.length +
                                                              index ===
                                                          4
                                                        ? "rounded-br-lg"
                                                        : ""
                                                }`}
                                            />
                                        )
                                    )}
                            </div>
                        </div>

                        {/* Show All Photos Button */}
                        <button
                            onClick={() => setShowAllPhotos(true)}
                            className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 cursor-pointer border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="grid grid-cols-3 gap-0.5">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 bg-gray-800 rounded-full"
                                    ></div>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                Show all photos
                            </span>
                        </button>
                    </div>

                    {/* All Photos Modal */}
                    {showAllPhotos && (
                        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                            <div className="relative max-w-4xl w-full max-h-full">
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowAllPhotos(false)}
                                    className="absolute top-4 cursor-pointer hover:bg-gray-200 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-black p-2 rounded-full transition-all"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                {/* Image Display */}
                                <div className="relative h-96 mb-4">
                                    <Image
                                        src={
                                            room.images[selectedImage] ||
                                            "/galeri/default.jpg"
                                        }
                                        alt={`${room.title} ${
                                            selectedImage + 1
                                        }`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 66vw"
                                    />
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                                    {room.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`aspect-square relative overflow-hidden rounded cursor-pointer border-2 ${
                                                selectedImage === index
                                                    ? "border-white"
                                                    : "border-transparent"
                                            }`}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                        >
                                            <Image
                                                src={image}
                                                alt={`${room.title} ${
                                                    index + 1
                                                }`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 16vw, 10vw"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Image Counter */}
                                <div className="text-center mt-4">
                                    <span className="text-white text-sm">
                                        {selectedImage + 1} /{" "}
                                        {room.images.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop: 2-column layout, Mobile: single column */}
                    <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Left Column - Room Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Room Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
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
                                            {t.roomInfo.maxGuests.replace(
                                                "{count}",
                                                room.maxGuests.toString()
                                            )}
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
                                            <Armchair />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {room.view}
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-6 h-6 mx-auto mb-2 text-primary">
                                            <Building2 />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {t.roomInfo.floor} {room.floor}
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {t.roomInfo.roomDescription}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        {room.longDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-semibold mb-6">
                                    {t.roomInfo.roomAmenities}
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

                            {/* Included vs Additional Costs */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-semibold mb-6">
                                    {t.roomInfo.costBreakdown}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Included Facilities */}
                                    <div>
                                        <h4 className="font-medium text-green-600 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            {t.roomInfo.included}
                                        </h4>
                                        <div className="space-y-2">
                                            {room.includedFacilities.map(
                                                (facility, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {facility}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Costs */}
                                    <div>
                                        <h4 className="font-medium text-orange-600 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            {t.roomInfo.additionalCosts}
                                        </h4>
                                        <div className="space-y-2">
                                            {room.excludedFacilities.map(
                                                (facility, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {facility}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            {t.facilities.additional.map(
                                                (facility, index) => (
                                                    <div
                                                        key={`additional-${index}`}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {facility}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Policies */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-semibold mb-6">
                                    {t.roomInfo.roomPolicies}
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

                        {/* Right Column - Reservation Card (Desktop only) */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Tertarik dengan kamar ini?
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Hubungi admin untuk informasi ketersediaan dan booking
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleBookingClick}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mb-4"
                                        size="lg"
                                    >
                                        Pesan Sekarang
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">
                                            * Ketersediaan kamar akan dikonfirmasi oleh admin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Bottom Navbar */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
                        <div className="flex items-center justify-between max-w-sm mx-auto">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Tertarik dengan kamar ini?
                                </p>
                                <p className="text-xs text-gray-500">
                                    Hubungi admin untuk booking
                                </p>
                            </div>
                            <Button
                                onClick={handleBookingClick}
                                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                                size="sm"
                            >
                                Pesan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {showBooking && (
                <DirectBookingForm
                    room={{
                        id: room.id,
                        title: room.title,
                        price: room.price,
                        type: room.type,
                        size: room.size,
                        description: room.description,
                        facilities: room.features,
                        images: room.images,
                        pricing: room.pricing,
                    }}
                    language={language}
                    onClose={() => setShowBooking(false)}
                />
            )}

            <Footer />
        </div>
    );
};

export default RoomDetail;
