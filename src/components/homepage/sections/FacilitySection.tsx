"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AmenityCard from './facilities/AmenityCard';
import { IconWifi, IconWater, IconParking, IconLounge, IconKitchen, IconLaundry, IconBalcony, IconSecurity } from './facilities/FacilityIcons';
import RentalOption from './facilities/RentalOption';
import RoomTypeCard, { RoomTypeProps } from './facilities/RoomTypeCard';


const FacilitySection = () => {
  // Room types data
  const roomTypes: RoomTypeProps[] = [
    {
      title: "Kamar Premium Tipe A",
      size: "4 x 4 meter",
      price: "Rp 1.500.000",
      description: "Kamar nyaman dengan ukuran compact, ideal untuk mahasiswi atau profesional muda.",
      features: ["AC", "Kasur Queen Bed", "Wi-Fi", "Lemari Pakaian", "Meja Nakas", "Tempat Sampah"],
      image: "/galeri/kamar_A/1.png",
      availability: "available" as const,
      type: "A" as const,
      units: 35
    },
    {
      title: "Suite Executive Tipe B",
      size: "4 x 5,5 meter",
      price: "Rp 2.100.000",
      description: "Kamar luas dengan ruang yang lebih fleksibel untuk kebutuhan Anda.",
      features: ["AC", "Kasur Queen Bed", "Wi-Fi", "Lemari Pakaian Besar", "Meja Nakas", "Area Kerja"],
      image: "/galeri/kamar_B/1.png",
      availability: "limited" as const,
      type: "B" as const,
      units: 5
    }
  ];

  // Building amenities
  const buildingAmenities = [
    {
      icon: <IconWifi />,
      title: "Wi-Fi Berkecepatan Tinggi",
      description: "Akses internet gratis di seluruh area residence dengan kecepatan premium"
    },
    {
      icon: <IconWater />,
      title: "Air PDAM 24 Jam",
      description: "Supply air bersih tanpa terputus untuk kenyamanan maksimal"
    },
    {
      icon: <IconParking />,
      title: "Area Parkir Luas",
      description: "Parkir aman dan gratis untuk kendaraan roda dua dan roda empat"
    },
    {
      icon: <IconLounge />,
      title: "Lounge Area Eksklusif",
      description: "Ruang santai modern dengan desain interior premium untuk bersantai"
    },
    {
      icon: <IconKitchen />,
      title: "Dapur Berkonsep Modern",
      description: "Dapur bersama dengan peralatan lengkap untuk kebutuhan memasak"
    },
    {
      icon: <IconLaundry />,
      title: "Layanan Laundry",
      description: "Layanan antar-jemput laundry untuk memudahkan kebutuhan harian Anda"
    },
    {
      icon: <IconBalcony />,
      title: "Balkon Pemandangan Bagus",
      description: "Nikmati pemandangan bagus dari balkon dengan desain minimalis modern"
    },
    {
      icon: <IconSecurity />,
      title: "Keamanan 24 Jam",
      description: "Sistem keamanan dan staff security yang menjaga residence sepanjang hari"
    }
  ];

  // Rental options
  const rentalOptions = [
    {
      title: "Mingguan",
      period: "Fleksibilitas maksimal",
      benefits: [
        "Tanpa kontrak jangka panjang",
        "Fleksibel untuk kebutuhan singkat",
        "Semua fasilitas termasuk"
      ]
    },
    {
      title: "Bulanan",
      period: "Paling populer",
      benefits: [
        "Harga lebih ekonomis",
        "Cocok untuk kebutuhan menengah",
        "Fleksibilitas perpanjangan",
        "Semua fasilitas termasuk"
      ],
      recommended: true
    },
    {
      title: "Semester",
      period: "Untuk periode akademik",
      benefits: [
        "Diskon khusus",
        "Pengajuan deposit lebih rendah",
        "Prioritas perpanjangan",
        "Semua fasilitas termasuk"
      ]
    },
    {
      title: "Tahunan",
      period: "Value terbaik",
      benefits: [
        "Harga terendah per bulan",
        "Terjamin ketersediaan kamar",
        "Prioritas pemilihan kamar",
        "Semua fasilitas termasuk"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
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
          <h2 className="text-4xl font-bold text-primary mb-5">Fasilitas Eksklusif</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nikmati berbagai fasilitas modern yang dirancang untuk memberikan pengalaman tinggal setara bintang 5.
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
              <h3 className="text-2xl font-bold text-primary mb-4">Pilihan Kamar Premium</h3>
              <p className="text-muted-foreground">
                Dirancang dengan mengedepankan kenyamanan dan keindahan, setiap kamar kami dilengkapi dengan fasilitas modern untuk memenuhi kebutuhan gaya hidup Anda.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-4 py-1 bg-primary text-white rounded-full text-sm font-medium">
                39 Total Unit
              </div>
              <div className="bg-white px-4 py-1 rounded-full text-sm font-medium border">
                Khusus Wanita
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
            <h3 className="text-2xl font-bold text-primary mb-2">Fasilitas Umum</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Berbagai fasilitas premium yang didesain untuk meningkatkan kualitas hidup Anda selama tinggal di Suman Residence.
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
            <h3 className="text-2xl font-bold text-primary mb-2">Pilihan Durasi Sewa</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami menawarkan fleksibilitas dalam durasi sewa untuk menyesuaikan dengan kebutuhan Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalOptions.map((option, index) => (
              <RentalOption key={index} {...option} />
            ))}
          </div>
        </div>

        {/* End of Rental Options */}
      </div>
    </section>
  );
};

export default FacilitySection;
