"use client";

import { useState } from "react";
import { RoomCard } from "./RoomCard";
import { DashboardStats } from "./DashboardStats";
import { mockRooms } from "./mockData";
import { Room } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Download, Plus } from "lucide-react";

type FilterType = 'all' | 'available' | 'booked' | 'not-paid' | 'partial-paid';

export function AdminDashboard() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room => {
    // Filter berdasarkan tipe
    let matchesFilter = true;
    switch (filter) {
      case 'available':
        matchesFilter = room.status === 'Available';
        break;
      case 'booked':
        matchesFilter = room.status === 'Booked';
        break;
      case 'not-paid':
        matchesFilter = room.tenant?.paymentStatus === 'Not Paid';
        break;
      case 'partial-paid':
        matchesFilter = room.tenant?.paymentStatus === 'Partial';
        break;
      default:
        matchesFilter = true;
    }

    // Filter berdasarkan pencarian
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  const handleAction = (action: string, roomId: string, tenantId?: string) => {
    console.log(`Action: ${action}, Room: ${roomId}, Tenant: ${tenantId}`);
    
    // Simulasi aksi yang akan dilakukan
    switch (action) {
      case 'approve':
        alert(`Booking untuk kamar ${roomId} telah di-ACC. Booking slip akan dikirim.`);
        break;
      case 'send_invoice':
        alert(`Invoice untuk kamar ${roomId} telah dikirim ke tenant.`);
        break;
      case 'send_receipt':
        alert(`Receipt dan SOP untuk kamar ${roomId} telah dikirim ke tenant.`);
        break;
      case 'send_whatsapp':
        // Simulasi redirect ke WhatsApp
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

  // Statistik
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const bookedRooms = rooms.filter(r => r.status === 'Booked').length;
  const notPaidCount = rooms.filter(r => r.tenant?.paymentStatus === 'Not Paid').length;
  const partialPaidCount = rooms.filter(r => r.tenant?.paymentStatus === 'Partial').length;
  const totalRevenue = rooms
    .filter(r => r.tenant?.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + (r.tenant?.paidAmount || 0), 0);

  const filterOptions = [
    { key: 'all', label: 'Semua Kamar', count: totalRooms },
    { key: 'available', label: 'Tersedia', count: availableRooms },
    { key: 'booked', label: 'Terisi', count: bookedRooms },
    { key: 'not-paid', label: 'Belum Bayar', count: notPaidCount },
    { key: 'partial-paid', label: 'Bayar Sebagian', count: partialPaidCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Kelola semua kamar dan penyewa Suman Residence</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Tambah Kamar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik Dashboard */}
        <DashboardStats
          totalRooms={totalRooms}
          availableRooms={availableRooms}
          bookedRooms={bookedRooms}
          notPaidCount={notPaidCount}
          partialPaidCount={partialPaidCount}
          totalRevenue={totalRevenue}
        />

        {/* Filter dan Pencarian */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? "default" : "outline"}
                  onClick={() => setFilter(option.key as FilterType)}
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <span>{option.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {option.count}
                  </Badge>
                </Button>
              ))}
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Grid Kamar */}
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
