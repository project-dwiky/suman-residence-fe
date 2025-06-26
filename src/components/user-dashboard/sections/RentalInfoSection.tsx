"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RentalData, RentalStatus, PaymentStatus, RentalDuration } from '../types';
import { formatIDR } from '../utils/currencyUtils';

interface RentalInfoSectionProps {
  rentalData: RentalData;
}

const RentalInfoSection: React.FC<RentalInfoSectionProps> = ({ rentalData }) => {
  const { room, rentalStatus, rentalPeriod, payment } = rentalData;
  
  // Calculate days left
  const today = new Date();
  const endDate = new Date(rentalPeriod.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Status badge styles - konsisten dengan RentalListSection
  const getStatusBadge = (status: RentalStatus) => {
    switch (status) {
      case RentalStatus.ACTIVE:
        return { 
          color: 'bg-green-50 border border-green-200 text-green-700', 
          text: 'Aktif'
        };
      case RentalStatus.EXPIRED:
        return { 
          color: 'bg-red-50 border border-red-200 text-red-700', 
          text: 'Masa Sewa Habis'
        };
      case RentalStatus.NOT_RENEWED:
        return { 
          color: 'bg-orange-50 border border-orange-200 text-orange-700', 
          text: 'Tidak Diperpanjang'
        };
      case RentalStatus.PENDING:
        return { 
          color: 'bg-amber-50 border border-amber-200 text-amber-700', 
          text: 'Dalam Pengajuan'
        };
      default:
        return { 
          color: 'bg-gray-50 border border-gray-200 text-gray-700', 
          text: status
        };
    }
  };
  
  const paymentStatusColors = {
    [PaymentStatus.PAID]: 'text-accent border-accent/20',
    [PaymentStatus.UNPAID]: 'text-destructive border-destructive/20',
    [PaymentStatus.PARTIALLY_PAID]: 'text-secondary border-secondary/20',
  };
  
  const paymentStatusDotColors = {
    [PaymentStatus.PAID]: 'bg-accent',
    [PaymentStatus.UNPAID]: 'bg-destructive',
    [PaymentStatus.PARTIALLY_PAID]: 'bg-secondary',
  };
  
  const durationNames = {
    [RentalDuration.WEEKLY]: 'Mingguan',
    [RentalDuration.MONTHLY]: 'Bulanan',
    [RentalDuration.SEMESTER]: 'Semester',
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
            {room.facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{facility}</span>
              </div>
            ))}
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
        
        
        
        {/* Payment Information Section */}
        <motion.div variants={itemVariants}>
          <h3 className="font-semibold text-lg mb-2">Informasi Pembayaran</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Status Pembayaran</p>
              <p className="font-medium">
                {payment.status === PaymentStatus.PAID ? 'Lunas' : 
                 payment.status === PaymentStatus.PARTIALLY_PAID ? 'Dibayar Sebagian' : 'Belum Dibayar'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total Biaya</p>
              <p className="font-medium">
                Rp {room.totalPrice.toLocaleString('id-ID')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tanggal Pembayaran Terakhir</p>
              <p className="font-medium">
                {payment.lastPaymentDate ? 
                  new Date(payment.lastPaymentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                  '-'}
              </p>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default RentalInfoSection;
