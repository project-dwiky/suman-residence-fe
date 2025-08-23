"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, XCircle, RefreshCw } from 'lucide-react';
import { Booking } from '../types';

interface BookingFiltersProps {
  bookings: Booking[];
  filteredBookings: Booking[];
  searchQuery: string;
  activeFilter: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onRefresh: () => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  bookings,
  filteredBookings,
  searchQuery,
  activeFilter,
  loading,
  onSearchChange,
  onFilterChange,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
          <p className="text-gray-600">Kelola semua booking dari customer</p>
        </div>
        <Button onClick={onRefresh} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Cari booking ID, user ID, kamar, nama, email, atau telepon..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <XCircle className="h-6 w-6" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Menampilkan {filteredBookings.length} dari {bookings.length} booking
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">Filter Status:</span>
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
          size="default"
          className="h-10 px-4"
        >
          <Filter className="w-4 h-4 mr-2" />
          Semua ({bookings.length})
        </Button>
        {['PENDING', 'APPROVED', 'CANCEL'].map(status => {
          const count = bookings.filter(b => b.rentalStatus === status).length;
          const statusLabel = status === 'PENDING' ? 'Pending' : 
                             status === 'APPROVED' ? 'Disetujui' : 
                             status === 'CANCEL' ? 'Canceled' : status;
          return (
            <Button
              key={status}
              variant={activeFilter === status ? 'default' : 'outline'}
              onClick={() => onFilterChange(status)}
              size="default"
              className="h-10 px-4"
            >
              {statusLabel} ({count})
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingFilters;
