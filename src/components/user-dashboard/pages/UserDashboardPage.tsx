import React from 'react';
import { RentalData } from '../types';
import RentalListSection from '../sections/RentalListSection';
import { getRentalDataList } from '../actions/mockData';
import Navbar from '@/components/core/Navbar';
import Footer from '@/components/core/Footer';
import Link from 'next/link';

async function UserDashboardPage() {
  // Fetch rental data list using async/await on the server
  let rentalDataList: RentalData[] = [];
  let error: string | null = null;
  
  try {
    rentalDataList = await getRentalDataList();
  } catch (err) {
    console.error("Error loading rental data list:", err);
    error = "Gagal memuat data sewa. Silakan coba lagi nanti.";
  }

  // Error handling dengan desain premium
  if (error) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA]">
        <Navbar />
        <div className="pt-8 md:pt-12">
          {/* Hero section dengan background gradient */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Penghuni</h1>
              <p className="text-white/80">Kelola properti Anda di Suman Residence</p>
            </div>
          </div>
          
          {/* Content area */}
          <div className="max-w-7xl mx-auto px-4 -mt-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="py-8 px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link 
                  href="/dashboard/user" 
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Muat Ulang
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero section premium - Improved for mobile */}
      <div className="pt-16 md:pt-20"> {/* Increased padding top for mobile to prevent navbar overlap */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
          {/* Decorative elements - adjusted for better mobile display */}
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-secondary/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl md:blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-24 md:w-48 h-24 md:h-48 bg-secondary/10 rounded-full translate-y-1/3 md:translate-y-1/2 blur-xl md:blur-2xl"></div>
          
          {/* Content - Improved responsive design */}
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-5 md:mb-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard Penghuni</h1>
                <p className="text-white/80 text-sm md:text-base mt-1">Properti yang Anda sewa di Suman Residence</p>
              </div>
              
              <Link 
                href="/booking" 
                className="flex items-center justify-center md:justify-start px-4 md:px-5 py-2 md:py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition shadow-md hover:shadow-lg group w-full md:w-auto"
              >
                <span className="text-sm md:text-base">Sewa Properti Baru</span>
                <svg className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 mt-6 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
            <RentalListSection rentalDataList={rentalDataList} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserDashboardPage;
