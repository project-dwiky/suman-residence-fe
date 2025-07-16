"use client";

import { useState } from "react";
import { RoomCard } from "./RoomCard";
import { mockRooms } from "./mockData";
import { Room } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type FilterType = 'all' | 'available' | 'booked';

export function AdminDashboard() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  const handleAction = (action: string, roomId: string, tenantId?: string) => {
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
        if (room?.tenant) {
          const message = encodeURIComponent(
            `Halo ${room.tenant.name}, ini adalah pesan dari Admin Suman Residence mengenai kamar ${room.name}.`
          );
          window.open(`https://wa.me/${room.tenant.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
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
              onAction={handleAction}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Tidak ada kamar yang ditemukan</h3>
              <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
