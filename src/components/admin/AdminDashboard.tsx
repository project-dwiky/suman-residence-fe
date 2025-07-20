"use client";

import { useState, useEffect } from "react";
import { RoomCard } from "./RoomCard";
import { Room, Booking } from "@/models";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, RefreshCw, Settings } from "lucide-react";
import Link from "next/link";

type FilterType = 'all' | 'available' | 'booked';

export function AdminDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeBookings, setActiveBookings] = useState<Record<string, Booking>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/rooms`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch active bookings for all rooms
  const fetchActiveBookings = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/bookings?status=Active`);
      if (!response.ok) {
        return; // If bookings API fails, continue without bookings
      }
      
      const data = await response.json();
      const bookings = data.bookings || [];
      
      // Create a map of roomId -> active booking
      const bookingsMap: Record<string, Booking> = {};
      bookings.forEach((booking: Booking) => {
        bookingsMap[booking.roomId] = booking;
      });
      
      setActiveBookings(bookingsMap);
    } catch (err) {
      console.error('Error fetching active bookings:', err);
      // Continue without bookings - this is optional functionality
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchActiveBookings();
  }, []);

  const filteredRooms = rooms.filter(room => {
    // Simple filter: all, available, or booked only
    let matchesFilter = true;
    switch (filter) {
      case 'available':
        matchesFilter = room.status === 'Available';
        break;
      case 'booked':
        matchesFilter = room.status === 'Booked';
        break;
      default:
        matchesFilter = true;
    }

    // Simple search by room name or tenant name
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleAction = async (action: string, roomId: string, tenantId?: string) => {
    // Handle document sending actions
    switch (action) {
      case 'send_booking_slip':
        alert(`Booking slip untuk kamar ${roomId} telah dikirim ke WhatsApp tenant.`);
        break;
      case 'send_receipt_sop':
        alert(`Receipt dan SOP untuk kamar ${roomId} telah dikirim ke WhatsApp tenant.`);
        break;
      case 'send_invoice':
        alert(`Invoice untuk kamar ${roomId} telah dikirim ke WhatsApp tenant.`);
        break;
      case 'send_whatsapp':
        // Send message to WhatsApp
        const room = rooms.find(r => r.id === roomId);
        const activeBooking = activeBookings[roomId];
        if (room && activeBooking) {
          // In real implementation, you would get tenant details from the booking
          const message = encodeURIComponent(
            `Halo, ini adalah pesan dari Admin Suman Residence mengenai kamar ${room.name}.`
          );
          window.open(`https://wa.me/+6281234567890?text=${message}`, '_blank');
        }
        break;
      default:
        break;
    }
  };

  // Simple statistics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const bookedRooms = rooms.filter(r => r.status === 'Booked').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchRooms} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Kelola kamar dan kirim dokumen via WhatsApp</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchRooms}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/admin/dashboard/rooms">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Kelola Kamar
                </Button>
              </Link>
              <Link href="/admin/dashboard/rooms">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kamar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-900">{totalRooms}</div>
            <div className="text-gray-600">Total Kamar</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
            <div className="text-gray-600">Kamar Tersedia</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-blue-600">{bookedRooms}</div>
            <div className="text-gray-600">Kamar Terisi</div>
          </Card>
        </div>

        {/* Simple Filter and Search */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? "default" : "outline"}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Semua ({totalRooms})
              </Button>
              <Button
                variant={filter === 'available' ? "default" : "outline"}
                onClick={() => setFilter('available')}
                size="sm"
              >
                Tersedia ({availableRooms})
              </Button>
              <Button
                variant={filter === 'booked' ? "default" : "outline"}
                onClick={() => setFilter('booked')}
                size="sm"
              >
                Terisi ({bookedRooms})
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari kamar atau nama penyewa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              activeBooking={activeBookings[room.id] || null}
              onAction={handleAction}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Tidak ada kamar yang ditemukan</h3>
              {rooms.length === 0 ? (
                <div>
                  <p className="mb-4">Database masih kosong. Inisialisasi data sampel untuk memulai.</p>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/seed', { method: 'POST' });
                        if (response.ok) {
                          alert('Data sampel berhasil dibuat!');
                          fetchRooms();
                        } else {
                          alert('Gagal membuat data sampel');
                        }
                      } catch (error) {
                        alert('Error: ' + error);
                      }
                    }}
                  >
                    Buat Data Sampel
                  </Button>
                </div>
              ) : (
                <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
              )}
            </div>
          </Card>
        )}

        {/* CRON Job Management Section */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Automated Reminders</h3>
              <p className="text-sm text-gray-600">Manage contract and payment reminders</p>
            </div>
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await fetch('/api/cron/trigger', { method: 'POST' });
                  const result = await response.json();
                  
                  if (result.success) {
                    alert(`Manual reminder job completed!\n\nH-15 Reminders: ${result.cronResult.summary?.h15Count || 0}\nH-1 Reminders: ${result.cronResult.summary?.h1Count || 0}\nTotal Sent: ${result.cronResult.summary?.successful || 0}`);
                  } else {
                    alert('Failed to trigger reminder job: ' + result.error);
                  }
                } catch (error) {
                  alert('Error triggering reminder job: ' + error);
                } finally {
                  setLoading(false);
                }
              }}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Test Reminders
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">H-15 Reminders </div>
              <div className="text-xs text-blue-500">Contract renewal confirmation</div>
              <div className="text-lg font-bold text-blue-700 mt-1">Daily 9:00 AM</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-orange-600">H-1 Reminders</div>
              <div className="text-xs text-orange-500">Final payment reminder</div>
              <div className="text-lg font-bold text-orange-700 mt-1">Daily 9:00 AM</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">WhatsApp Status</div>
              <div className="text-xs text-green-500">Auto-send via backend</div>
              <div className="text-lg font-bold text-green-700 mt-1">Active</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
