"use client";

import React from "react";
import { motion } from "framer-motion";
import AmenityCard from "./facilities/AmenityCard";
import {
    IconWifi,
    IconWater,
    IconParking,
    IconLounge,
    IconKitchen,
    IconLaundry,
    IconBalcony,
    IconSecurity,
} from "./facilities/FacilityIcons";
import RentalOption from "./facilities/RentalOption";
import RoomTypeCard, { RoomTypeProps } from "./facilities/RoomTypeCard";
import { Language, getFacilityTranslation } from "@/translations";

interface FacilitySectionProps {
    language: Language;
}

const FacilitySection = ({ language }: FacilitySectionProps) => {
    const t = getFacilityTranslation(language);

    // Room types data
    const roomTypes: RoomTypeProps[] = [
        {
            title: t.roomTypes.rooms.typeA.title,
            size: t.roomTypes.rooms.typeA.size,
            price: t.roomTypes.rooms.typeA.price,
            description: t.roomTypes.rooms.typeA.description,
            features: t.roomTypes.rooms.typeA.features,
            image: "/galeri/kamar_A/h2.JPG",
            availability: "available" as const,
            type: "A" as const,
            units: 35,
            id: "1",
            language: language,
        },
        {
            title: t.roomTypes.rooms.typeB.title,
            size: t.roomTypes.rooms.typeB.size,
            price: t.roomTypes.rooms.typeB.price,
            description: t.roomTypes.rooms.typeB.description,
            features: t.roomTypes.rooms.typeB.features,
            image: "/galeri/kamar_A/h1.JPG",
            availability: "limited" as const,
            type: "B" as const,
            units: 5,
            id: "2",
            language: language,
        },
    ];

    // Building amenities
    const buildingAmenities = [
        {
            icon: <IconWifi />,
            title: t.amenities.items.wifi.title,
            description: t.amenities.items.wifi.description,
        },
        {
            icon: <IconWater />,
            title: t.amenities.items.water.title,
            description: t.amenities.items.water.description,
        },
        {
            icon: <IconParking />,
            title: t.amenities.items.parking.title,
            description: t.amenities.items.parking.description,
        },
        {
            icon: <IconLounge />,
            title: t.amenities.items.lounge.title,
            description: t.amenities.items.lounge.description,
        },
        {
            icon: <IconKitchen />,
            title: t.amenities.items.kitchen.title,
            description: t.amenities.items.kitchen.description,
        },
        {
            icon: <IconLaundry />,
            title: t.amenities.items.laundry.title,
            description: t.amenities.items.laundry.description,
        },
        {
            icon: <IconBalcony />,
            title: t.amenities.items.balcony.title,
            description: t.amenities.items.balcony.description,
        },
        {
            icon: <IconSecurity />,
            title: t.amenities.items.security.title,
            description: t.amenities.items.security.description,
        },
    ];

    // Rental options
    const rentalOptions = [
        {
            title: t.rentalOptions.options.weekly.title,
            period: t.rentalOptions.options.weekly.period,
            benefits: t.rentalOptions.options.weekly.benefits,
        },
        {
            title: t.rentalOptions.options.monthly.title,
            period: t.rentalOptions.options.monthly.period,
            benefits: t.rentalOptions.options.monthly.benefits,
            recommended: true,
        },
        {
            title: t.rentalOptions.options.semester.title,
            period: t.rentalOptions.options.semester.period,
            benefits: t.rentalOptions.options.semester.benefits,
        },
        {
            title: t.rentalOptions.options.yearly.title,
            period: t.rentalOptions.options.yearly.period,
            benefits: t.rentalOptions.options.yearly.benefits,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <section className="py-6 md:py-16 bg-background" id="facility-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header with animation */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-primary mb-5">
                        {t.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </motion.div>

                {/* Room Types Section */}
                <div className="mb-20">
                    <motion.div
                        className="flex flex-col md:flex-row items-center justify-between mb-10 gap-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="max-w-xl">
                            <h3 className="text-2xl font-bold text-primary mb-4">
                                {t.roomTypes.title}
                            </h3>
                            <p className="text-muted-foreground">
                                {t.roomTypes.description}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="px-4 py-1 bg-primary text-white rounded-full text-sm font-medium">
                                39 {t.roomTypes.badges.totalUnits}
                            </div>
                            <div className="bg-white px-4 py-1 rounded-full text-sm font-medium border">
                                {t.roomTypes.badges.womenOnly}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {roomTypes.map((room, index) => (
                            <RoomTypeCard
                                key={index}
                                title={room.title}
                                size={room.size}
                                price={room.price}
                                description={room.description}
                                features={room.features}
                                image={room.image}
                                availability={room.availability}
                                type={room.type}
                                units={room.units}
                                id={room.id}
                                language={language}
                            />
                        ))}
                    </div>
                </div>

                {/* Common Amenities */}
                <div className="mb-20">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold text-primary mb-2">
                            {t.amenities.title}
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.amenities.description}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {buildingAmenities.map((amenity, index) => (
                            <AmenityCard key={index} {...amenity} />
                        ))}
                    </motion.div>
                </div>

                {/* Rental Options */}
                <div className="mb-12">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold text-primary mb-2">
                            {t.rentalOptions.title}
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.rentalOptions.description}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rentalOptions.map((option, index) => (
                            <RentalOption key={index} {...option} language={language} />
                        ))}
                    </div>
                </div>

                {/* End of Rental Options */}
            </div>
        </section>
    );
};

export default FacilitySection;
