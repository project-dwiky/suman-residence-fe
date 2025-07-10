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
    Armchair,
    Building2,
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
import { Language, getRoomDetailTranslation } from "@/translations";

interface RoomDetailProps {
    roomId: string;
    language: Language;
}

const RoomDetail = ({ roomId, language }: RoomDetailProps) => {
    const t = getRoomDetailTranslation(language);

    // Sample room data (in real app, this would come from API)
    const roomData = {
        1: {
            id: 1,
            title: t.rooms.typeA.title,
            size: t.rooms.typeA.size,
            price: t.rooms.typeA.price,
            originalPrice: t.rooms.typeA.originalPrice,
            pricePerMonth: t.rooms.typeA.price,
            description: t.rooms.typeA.description,
            longDescription: t.rooms.typeA.longDescription,
            features: t.rooms.typeA.features,
            amenities: [
                {
                    name: t.rooms.typeA.amenities.ac.name,
                    icon: Snowflake,
                    description: t.rooms.typeA.amenities.ac.description,
                },
                {
                    name: t.rooms.typeA.amenities.bed.name,
                    icon: Bed,
                    description: t.rooms.typeA.amenities.bed.description,
                },
                {
                    name: t.rooms.typeA.amenities.wifi.name,
                    icon: Wifi,
                    description: t.rooms.typeA.amenities.wifi.description,
                },
                {
                    name: t.rooms.typeA.amenities.wardrobe.name,
                    icon: Users,
                    description: t.rooms.typeA.amenities.wardrobe.description,
                },
                {
                    name: t.rooms.typeA.amenities.table.name,
                    icon: Tv,
                    description: t.rooms.typeA.amenities.table.description,
                },
                {
                    name: t.rooms.typeA.amenities.trash.name,
                    icon: Bath,
                    description: t.rooms.typeA.amenities.trash.description,
                },
            ],
            images: ["/galeri/kamar_A/h1.JPG", "/galeri/kamar_A/h2.JPG"],
            availability: "available" as const,
            type: "A" as const,
            units: 35,
            totalUnits: t.common.totalUnits,
            rating: t.common.rating,
            reviewCount: t.common.reviewCount,
            maxGuests: t.common.maxGuests,
            bedType: t.rooms.typeA.bedType,
            view: t.rooms.typeA.view,
            floor: t.rooms.typeA.floor,
            checkIn: t.rooms.typeA.checkIn,
            checkOut: t.rooms.typeA.checkOut,
            rentalPeriods: t.common.rentalPeriods,
            policies: t.policies,
            includedFacilities: t.facilities.included,
            excludedFacilities: t.facilities.excluded,
            sharedFacilities: t.facilities.shared,
            contact: t.contact,
        },
        2: {
            id: 2,
            title: t.rooms.typeB.title,
            size: t.rooms.typeB.size,
            price: t.rooms.typeB.price,
            originalPrice: t.rooms.typeB.originalPrice,
            pricePerMonth: t.rooms.typeB.price,
            description: t.rooms.typeB.description,
            longDescription: t.rooms.typeB.longDescription,
            features: t.rooms.typeB.features,
            amenities: [
                {
                    name: t.rooms.typeB.amenities.ac.name,
                    icon: Snowflake,
                    description: t.rooms.typeB.amenities.ac.description,
                },
                {
                    name: t.rooms.typeB.amenities.bed.name,
                    icon: Bed,
                    description: t.rooms.typeB.amenities.bed.description,
                },
                {
                    name: t.rooms.typeB.amenities.wifi.name,
                    icon: Wifi,
                    description: t.rooms.typeB.amenities.wifi.description,
                },
                {
                    name: t.rooms.typeB.amenities.wardrobe.name,
                    icon: Users,
                    description: t.rooms.typeB.amenities.wardrobe.description,
                },
                {
                    name: t.rooms.typeB.amenities.table.name,
                    icon: Tv,
                    description: t.rooms.typeB.amenities.table.description,
                },
                {
                    name: t.rooms.typeB.amenities.area.name,
                    icon: Bath,
                    description: t.rooms.typeB.amenities.area.description,
                },
            ],
            images: ["/galeri/kamar_A/h1.JPG", "/galeri/kamar_A/h2.JPG"],
            availability: "limited" as const,
            type: "B" as const,
            units: 5,
            totalUnits: t.common.totalUnits,
            rating: t.common.rating,
            reviewCount: t.common.reviewCount,
            maxGuests: t.common.maxGuests,
            bedType: t.rooms.typeB.bedType,
            view: t.rooms.typeB.view,
            floor: t.rooms.typeB.floor,
            checkIn: t.rooms.typeB.checkIn,
            checkOut: t.rooms.typeB.checkOut,
            rentalPeriods: t.common.rentalPeriods,
            policies: t.policies,
            includedFacilities: t.facilities.included,
            excludedFacilities: t.facilities.excluded,
            sharedFacilities: t.facilities.shared,
            contact: t.contact,
        },
    };

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
                            {t.notFound.title}
                        </h1>
                        <Link
                            href="/kamar"
                            className="text-primary hover:underline"
                        >
                            {t.notFound.backLink}
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
                            {t.navigation.home}
                        </Link>
                        <span>/</span>
                        <Link href="/kamar" className="hover:text-primary">
                            {t.navigation.rooms}
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
                                        {t.roomInfo.maxGuests.replace('{count}', room.maxGuests.toString())}
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
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
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
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
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
                                        {room.includedFacilities.map((facility, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2 text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{facility}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Costs */}
                                <div>
                                    <h4 className="font-medium text-orange-600 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        {t.roomInfo.additionalCosts}
                                    </h4>
                                    <div className="space-y-2">
                                        {room.excludedFacilities.map((facility, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2 text-sm"
                                            >
                                                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span className="text-gray-700">{facility}</span>
                                            </div>
                                        ))}
                                        {t.facilities.additional.map((facility, index) => (
                                            <div
                                                key={`additional-${index}`}
                                                className="flex items-center space-x-2 text-sm"
                                            >
                                                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span className="text-gray-700">{facility}</span>
                                            </div>
                                        ))}
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

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    {t.booking.title}
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.booking.checkIn}
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
                                            {t.booking.checkOut}
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
                                            {t.booking.guestCount}
                                        </label>
                                        <Select
                                            value={guests.toString()}
                                            onValueChange={(value) =>
                                                setGuests(Number(value))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t.booking.selectGuests} />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                <SelectItem value="1">
                                                    1 {t.booking.guest}
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    2 {t.booking.guests}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-4">
                                    {t.booking.bookNow}
                                </Button>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">
                                        {t.booking.needHelp}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{room.contact.owner}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>{room.contact.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>{t.booking.customerService}</span>
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
