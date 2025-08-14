"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RentalData } from '../types';
import { formatDate } from '../utils/dateUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/translations';
import { getRoomMainImage, getStaticRoomByType } from '@/utils/static-room-data';

interface RentalListSectionProps {
  rentalDataList: RentalData[];
  language?: Language;
}

const RentalListSection: React.FC<RentalListSectionProps> = ({ rentalDataList, language = 'id' }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRentals, setFilteredRentals] = useState<RentalData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const router = useRouter();
  
  // Helper function to get room image based on room type
  const getRoomImage = (room: any): string => {
    // Priority 1: Use static room images based on type
    const staticRoom = getStaticRoomByType(room.type, 'id' as Language);
    if (staticRoom && staticRoom.images && staticRoom.images.length > 0) {
      return staticRoom.images[0];
    }
    
    // Priority 2: Use database images if available
    if (room.imagesGallery && room.imagesGallery.length > 0) {
      return room.imagesGallery[0];
    }
    
    // Priority 3: Fallback to main image based on room type
    if (room.type === 'A') {
      return getRoomMainImage('A', 'id');
    } else if (room.type === 'B') {
      return getRoomMainImage('B', 'id');
    }
    
    // Default to Type A image
    return getRoomMainImage('A', 'id');
  };
  
  // Initialize filteredRentals when rentalDataList changes
  useEffect(() => {
    if (rentalDataList && Array.isArray(rentalDataList)) {
      setFilteredRentals(rentalDataList);
    } else {
      setFilteredRentals([]);
    }
  }, [rentalDataList]);
  
  // Filter data berdasarkan pencarian dan filter status - simplified
  useEffect(() => {
    // Ensure rentalDataList is an array
    const dataList = Array.isArray(rentalDataList) ? rentalDataList : [];
    
    const filtered = dataList.filter(rental => {
      // Safety check for rental object
      if (!rental || !rental.room) return false;
      
      const matchSearch = searchTerm === '' || 
        (rental.room.roomNumber && rental.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rental.room.type && rental.room.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rental.room.floor && rental.room.floor.toString().includes(searchTerm));
      
      const matchFilter = activeFilter === 'all' || 
        (activeFilter === 'pending' && rental.rentalStatus === 'PENDING') ||
        (activeFilter === 'setujui' && rental.rentalStatus === 'APPROVED') ||
        (activeFilter === 'cancel' && rental.rentalStatus === 'CANCEL');
      
      return matchSearch && matchFilter;
    });
    
    setFilteredRentals(filtered);
  }, [searchTerm, rentalDataList, activeFilter]);

  // Simplified status badge styling - only 3 statuses
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { 
          color: 'bg-yellow-50 border border-yellow-200 text-yellow-700', 
          text: 'Dalam Pengajuan'
        };
      case 'APPROVED':
        return { 
          color: 'bg-green-50 border border-green-200 text-green-700', 
          text: 'Disetujui'
        };
      case 'CANCEL':
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
  
  // Safety check to prevent runtime errors
  const safeFilteredRentals = Array.isArray(filteredRentals) ? filteredRentals : [];
  
  return (
    <section className="">
      {/* Header dan Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
        <h2 className="text-2xl font-bold items-center text-primary ">
          Daftar Properti
        </h2>
        {safeFilteredRentals.length > 0 && (
            <p className="text-sm font-normal text-gray-500 ml-2">
              ({safeFilteredRentals.length} properti)
            </p>
          )}
        </div>
        
        {/* Search - Improved for desktop */}
        <div className="relative w-full md:w-80 lg:w-96 xl:w-[400px] transition-all duration-200">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari properti berdasarkan nomor, tipe, atau lantai"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm hover:shadow transition-shadow duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filter Tabs - Tanpa underline dan scrollbar */}
      <div className="mb-6 border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <motion.button
            onClick={() => setActiveFilter("all")}
            className={`pb-2 px-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeFilter === "all"
                ? "text-secondary font-semibold"
                : "text-gray-500 hover:text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Semua Properti
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter("pending")}
            className={`pb-2 px-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeFilter === "pending"
                ? "text-secondary font-semibold"
                : "text-gray-500 hover:text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dalam Pengajuan
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter("setujui")}
            className={`pb-2 px-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeFilter === "setujui"
                ? "text-secondary font-semibold"
                : "text-gray-500 hover:text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Disetujui
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter("cancel")}
            className={`pb-2 px-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeFilter === "cancel"
                ? "text-secondary font-semibold"
                : "text-gray-500 hover:text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dibatalkan
          </motion.button>
        </div>
      </div>

      {/* Empty State - Lebih Menarik */}
      {safeFilteredRentals.length === 0 && (
        <div className="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
          {searchTerm || activeFilter !== 'all' ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">Tidak Ada Hasil</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Tidak ada properti yang cocok dengan kriteria pencarian Anda. Coba ubah kata kunci pencarian atau filter.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveFilter('all');}}
                className="mt-4 inline-block px-6 py-2 border border-gray-200 text-primary rounded-md hover:bg-primary hover:text-white transition"
              >
                Reset Pencarian
              </button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">Belum Ada Properti</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Anda belum menyewa properti apapun di Suman Residence. Temukan properti yang sesuai dengan kebutuhan Anda.
              </p>
              <Link 
                href="/kamar" 
                className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:shadow-lg transition"
              >
                Lihat Properti
              </Link>
            </>
          )}
        </div>
      )}

      {/* Property List - Tampilan Premium dengan animasi */}
      {safeFilteredRentals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safeFilteredRentals.map((rental, index) => {
            const { room, rentalPeriod, rentalStatus } = rental;
            const statusBadge = getStatusBadge(rentalStatus);
            
            return (
              <Link key={index} href={`/dashboard/detail/${rental.id}`}>
                <motion.div 
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                {/* Room Image dengan Hover Effect */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={getRoomImage(room)} 
                    alt={`Kamar ${room.roomNumber}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    className="bg-gray-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Gradient removed as requested */}
                  
                  {/* Status Badge - Lighter bg dengan border di Pojok Kanan Atas */}
                  <div className="absolute top-3 right-3">
                    <div className={`flex items-center px-3 py-1.5 rounded-full ${statusBadge.color}`}>
                      <span className="text-xs font-medium">
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content - Simplified */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-xl text-primary group-hover:text-secondary transition-colors">Kamar {room.roomNumber}</span>
                      <p className="text-gray-600">
                        {room.type} • Lantai {room.floor}
                      </p>
                    </div>
                  </div>
                  
                  {/* Periode & Durasi Sewa - Lebih Konsisten */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Periode</div>
                    <div className="text-sm">
                      {formatDate(rentalPeriod.startDate)} - {formatDate(rentalPeriod.endDate)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Durasi Sewa */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Durasi sewa</div>
                      <div className="text-sm">
                        {rentalPeriod.durationType === 'MONTHLY' ? 'Bulanan' : rentalPeriod.durationType === 'SEMESTER' ? 'Semester' : 'Tahunan'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents Section */}
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-500">Dokumen</span>
                      <span className="text-sm text-gray-600">
                        {rental.documents?.length || 0} file
                      </span>
                    </div>
                    {rental.documents && rental.documents.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600">
                        Dokumen tersedia - klik untuk melihat detail
                      </div>
                    )}
                  </div>
                </div>
                </motion.div>
              </Link>
            );
          })}

        </div>
      )}
    </section>
  );
};

export default RentalListSection;
