import React from 'react';
import { getRentalDataById } from '../actions/mockData';
import { RentalData } from '../types';
import RentalInfoSection from '../sections/RentalInfoSection';
import DocumentsSection from '../sections/DocumentsSection';
import GallerySection from '../sections/GallerySection';
import Link from 'next/link';

interface RentalDetailPageProps {
  rentalId: string;
}

async function getRentalData(id: string): Promise<RentalData | null> {
  try {
    const data = await getRentalDataById(id);
    return data || null;
  } catch (error) {
    console.error('Failed to fetch rental data:', error);
    return null;
  }
}

const RentalDetailPage = async ({ rentalId }: RentalDetailPageProps) => {
  const rentalData = await getRentalData(rentalId);

  if (!rentalData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-8 bg-background text-center">
          <h3 className="text-xl font-medium text-gray-900">Data penyewaan tidak ditemukan</h3>
          <p className="mt-3 text-gray-500">Silakan kembali ke halaman dashboard dan coba lagi.</p>
          <div className="mt-6">
            <Link 
              href="/dashboard/user"
              className="inline-flex items-center px-6 py-2 text-sm font-medium rounded-full text-white bg-primary hover:bg-primary/90 focus:outline-none shadow-sm"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link 
          href="/dashboard/user"
          className="inline-flex items-center px-4 py-2 text-primary hover:bg-gray-100 transition-colors rounded-md font-medium text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Sewa
        </Link>
      </div>

      {/* Main Layout */}
      <div className="space-y-6 md:space-y-0">
        {/* Top Grid Layout for Gallery and Info */}
        <div className="md:grid md:grid-cols-12 md:gap-8 p-5 bg-background rounded-lg shadow-sm border border-border/40">
          {/* Gallery Section - takes 7 columns on md screens and above */}
          <div className="md:col-span-6 mb-6 md:mb-0">
            <GallerySection rentalData={rentalData} />
          </div>
          
          {/* Rental Information - takes 5 columns on md screens and above */}
          <div className="md:col-span-6">
            <RentalInfoSection rentalData={rentalData} />
          </div>
        </div>
        
        {/* Documents */}
        <DocumentsSection rentalData={rentalData} />

        {/* Contact Admin Button */}
        <div className="flex justify-center pt-8">
          <a 
            href="https://wa.me/+6281265945003?text=Halo,%20saya%20ingin%20bertanya%20tentang%20penyewaan%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RentalDetailPage;
