"use client";

import React from "react";
import { motion } from "framer-motion";
import { RentalData, RentalStatus, RentalDuration } from "../types";
import { getStaticRoomByType } from "@/utils/static-room-data";
import { Language } from "@/translations";
import {
    Wifi,
    Snowflake,
    Tv,
    Bath,
    Users,
    Building2,
    Star,
    Bed,
} from "lucide-react";

interface RentalInfoSectionProps {
    rentalData: RentalData;
}

const RentalInfoSection: React.FC<RentalInfoSectionProps> = ({
    rentalData,
}) => {
    const { room, rentalStatus, rentalPeriod } = rentalData;

    // Get static room data based on room type
    const staticRoom = getStaticRoomByType(room.type, "id" as Language);

    // Calculate days left
    const today = new Date();
    const endDate = new Date(rentalPeriod.endDate);
    const daysLeft = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Status badge styles - simplified to 3 statuses only
    const getStatusBadge = (status: RentalStatus) => {
        switch (status) {
            case RentalStatus.PENDING:
                return {
                    color: "bg-yellow-50 border border-yellow-200 text-yellow-700",
                    text: "Dalam Pengajuan",
                };
            case RentalStatus.SETUJUI:
                return {
                    color: "bg-green-50 border border-green-200 text-green-700",
                    text: "Disetujui",
                };
            case RentalStatus.CANCEL:
                return {
                    color: "bg-red-50 border border-red-200 text-red-700",
                    text: "Dibatalkan",
                };
            default:
                return {
                    color: "bg-gray-50 border border-gray-200 text-gray-700",
                    text: status,
                };
        }
    };

    const durationNames = {
        [RentalDuration.WEEKLY]: "Mingguan",
        [RentalDuration.MONTHLY]: "Bulanan",
        [RentalDuration.SEMESTER]: "Semester (6 Bulan)",
        [RentalDuration.YEARLY]: "Tahunan",
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            className="mt-4 md:mt-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
        >
            {/* Room Info Section */}
            <motion.div className="mb-4" variants={itemVariants}>
                <h3 className="font-semibold text-lg mb-2">Informasi Kamar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                    <div>
                        <p className="text-sm text-gray-500">Nomor Kamar</p>
                        <p
                            className={`font-medium ${
                                room.roomNumber === "Belum diset"
                                    ? "text-orange-600"
                                    : ""
                            }`}
                        >
                            {room.roomNumber}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Lantai</p>
                        <p className="font-medium">{room.floor}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ukuran</p>
                        <p className="font-medium">
                            {staticRoom?.size || room.size}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tipe</p>
                        <p className="font-medium">
                            {staticRoom?.title || room.type}
                        </p>
                    </div>
                    {staticRoom && (
                        <>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Kapasitas
                                </p>
                                <p className="font-medium">
                                    {staticRoom.maxGuests} orang
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Tempat Tidur
                                </p>
                                <p className="font-medium">
                                    {staticRoom.bedType}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Room amenities - prioritize static room data */}
                {staticRoom &&
                staticRoom.amenities &&
                staticRoom.amenities.length > 0 ? (
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-3">
                            Fasilitas Kamar
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {staticRoom.amenities.map((amenity, index) => {
                                const IconComponent = amenity.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                                    >
                                        <IconComponent className="w-4 h-4 text-primary" />
                                        <span className="text-sm">
                                            {amenity.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    room.facilities &&
                    room.facilities.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-3">
                                Fasilitas Kamar
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {room.facilities.map((facility, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                                    >
                                        <Wifi className="w-4 h-4 text-primary" />
                                        <span className="text-sm">
                                            {facility}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </motion.div>

            {/* Facilities Section */}
            <motion.div className="mb-4" variants={itemVariants}>
                {/* Show enhanced facilities if static room data available */}
                {staticRoom ? (
                    <div className="space-y-4"></div>
                ) : (
                    /* Fallback to basic facilities display */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {room.facilities && Array.isArray(room.facilities) ? (
                            room.facilities.map((facility, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>{facility}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">
                                Tidak ada data fasilitas
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Rental Period Section */}
            <motion.div className="mb-4" variants={itemVariants}>
                <h3 className="font-semibold text-lg mb-2">Periode Sewa</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                        <p className="text-sm text-gray-500">Jenis Periode</p>
                        <p className="font-medium">
                            {durationNames[rentalPeriod.durationType]}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Mulai</p>
                        <p className="font-medium">
                            {new Date(
                                rentalPeriod.startDate
                            ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Berakhir</p>
                        <p className="font-medium">
                            {new Date(rentalPeriod.endDate).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status Sewa</p>
                        <div className="mt-1">
                            <div
                                className={`inline-flex items-center px-3 py-1.5 rounded-full ${
                                    getStatusBadge(rentalStatus).color
                                }`}
                            >
                                <span className="text-xs font-medium">
                                    {getStatusBadge(rentalStatus).text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RentalInfoSection;
