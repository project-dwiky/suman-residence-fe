"use client";

import React, { useState, useEffect } from 'react';
import { RentalData } from '../types';
import RentalListSection from '../sections/RentalListSection';
import Footer from '@/components/core/Footer';
import Link from 'next/link';
import { BookingService } from '../services/booking.service';
import { useRouter } from 'next/navigation';
import { Language } from '@/translations';

interface UserDashboardPageProps {
  language?: Language;
}

function UserDashboardPage({ language = 'id' }: UserDashboardPageProps) {
  const router = useRouter();
  const [rentalDataList, setRentalDataList] = useState<RentalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get the current user
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error('User not authenticated');
        }
        
        const user = await userResponse.json();
        console.log('🔍 Current user from auth:', user);
        setCurrentUser(user);
        
        // Then fetch bookings for the authenticated user
        console.log('🔍 Fetching bookings for user ID:', user.id);
        console.log('🔍 Also trying with email:', user.email);
        
        // Try fetching by user ID first
        let result = await BookingService.getUserBookings(user.id);
        console.log('🔍 Result from getUserBookings by ID:', result);
        
        // If no bookings found by ID and user.id is different from email, try by email
        if ((!result.success || !result.bookings || result.bookings.length === 0) && user.id !== user.email) {
          console.log('🔍 No bookings found by ID, trying with email...');
          result = await BookingService.getUserBookings(user.email);
          console.log('🔍 Result from getUserBookings by email:', result);
        }
        
        console.log('🔍 Final booking fetch result:', result);
        
        if (result.success && result.bookings && Array.isArray(result.bookings)) {
          console.log('🔍 Setting rental data:', result.bookings.length, 'bookings');
          setRentalDataList(result.bookings);
        } else {
          console.warn('🔍 No valid bookings found, setting empty array');
          setRentalDataList([]);
        }
      } catch (err: any) {
        console.error("Error loading user data or bookings:", err);
        if (err.message === 'User not authenticated') {
          setError("Anda harus login untuk melihat data booking.");
          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push('/auth/login?redirectTo=/user/dashboard');
          }, 2000);
        } else {
          setError("Gagal memuat data sewa. Silakan coba lagi nanti.");
        }
        setRentalDataList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data booking...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error handling dengan desain premium
  if (error) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA]">
        <div className="pt-8">
          {/* Hero section dengan background gradient */}
          <div className="bg-primary text-white">
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
                {error.includes('login') ? (
                  <Link 
                    href="/auth/login?redirectTo=/user/dashboard" 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Login Sekarang
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Muat Ulang
                  </Link>
                )}
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
      {/* Hero section premium - Improved for mobile */}
      <div className=""> {/* Increased padding top for mobile to prevent navbar overlap */}
        <div className="bg-primary text-white relative overflow-hidden">
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
                href="/kamar" 
                className="flex items-center justify-center  px-4 md:px-5 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition shadow-md hover:shadow-lg group w-full md:w-auto"
              >
                <span className="text-sm text-center">Sewa Properti Baru</span>
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
            <RentalListSection rentalDataList={rentalDataList} language={language} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserDashboardPage;
