"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RentalData, RentalStatus, RentalDuration } from '../types';

interface RentalInfoSectionProps {
  rentalData: RentalData;
}

const RentalInfoSection: React.FC<RentalInfoSectionProps> = ({ rentalData }) => {
  const { room, rentalStatus, rentalPeriod } = rentalData;
  
  // Calculate days left
  const today = new Date();
  const endDate = new Date(rentalPeriod.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Status badge styles - simplified to 3 statuses only
  const getStatusBadge = (status: RentalStatus) => {
    switch (status) {
      case RentalStatus.PENDING:
        return { 
          color: 'bg-yellow-50 border border-yellow-200 text-yellow-700', 
          text: 'Dalam Pengajuan'
        };
      case RentalStatus.SETUJUI:
        return { 
          color: 'bg-green-50 border border-green-200 text-green-700', 
          text: 'Disetujui'
        };
      case RentalStatus.CANCEL:
        return { 
          color: 'bg-red-50 border border-red-200 text-red-700', 
          text: 'Dibatalkan'
        };
      default:
        return { 
          color: 'bg-gray-50 border border-gray-200 text-gray-700', 
          text: status
        };
    }
  };
  
  const durationNames = {
    [RentalDuration.WEEKLY]: 'Mingguan',
    [RentalDuration.MONTHLY]: 'Bulanan',
    [RentalDuration.SEMESTER]: 'Semester (6 Bulan)',
    [RentalDuration.YEARLY]: 'Tahunan',
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
              <p className="font-medium">{room.roomNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lantai</p>
              <p className="font-medium">{room.floor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ukuran</p>
              <p className="font-medium">{room.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipe</p>
              <p className="font-medium">{room.type}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500">Deskripsi</p>
            <p className="">{room.description}</p>
          </div>
        </motion.div>

        {/* Facilities Section */}
        <motion.div className="mb-4" variants={itemVariants}>
          <h3 className="font-semibold text-lg mb-2">Fasilitas Kamar</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(room.facilities && Array.isArray(room.facilities)) ? room.facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{facility}</span>
              </div>
            )) : (
              <div className="text-sm text-gray-500">Tidak ada data fasilitas</div>
            )}
          </div>
        </motion.div>
        
        {/* Rental Period Section */}
        <motion.div className="mb-4" variants={itemVariants}>
          <h3 className="font-semibold text-lg mb-2">Periode Sewa</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Jenis Periode</p>
              <p className="font-medium">{durationNames[rentalPeriod.durationType]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mulai</p>
              <p className="font-medium">{new Date(rentalPeriod.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Berakhir</p>
              <p className="font-medium">{new Date(rentalPeriod.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Sewa</p>
              <div className="mt-1">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${getStatusBadge(rentalStatus).color}`}>
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
