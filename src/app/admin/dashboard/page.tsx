"use client";

import { useState } from "react";

// Mock data untuk demo
const mockRooms = [
  {
    id: "R001",
    name: "Kamar Deluxe A1",
    status: "Booked",
    type: "Deluxe", 
    price: 2500000,
    tenant: {
      id: "T001",
      name: "Ahmad Ridwan",
      phone: "081234567890",
      email: "ahmad@email.com",
      checkIn: "2025-01-15",
      checkOut: "2025-07-15",
      remainingDays: 169,
      paymentStatus: "Paid",
      totalAmount: 15000000,
      paidAmount: 15000000,
    }
  },
  {
    id: "R002",
    name: "Kamar Standard B1",
    status: "Booked",
    type: "Standard",
    price: 1800000,
    tenant: {
      id: "T002",
      name: "Siti Nurhaliza",
      phone: "081234567891", 
      email: "siti@email.com",
      checkIn: "2025-02-01",
      checkOut: "2025-08-01",
      remainingDays: 185,
      paymentStatus: "Not Paid",
      totalAmount: 10800000,
      paidAmount: 0,
    }
  },
  {
    id: "R003",
    name: "Kamar Deluxe A2",
    status: "Available",
    type: "Deluxe",
    price: 2500000,
  },
  {
    id: "R004",
    name: "Kamar Premium C1",
    status: "Booked",
    type: "Premium",
    price: 3200000,
    tenant: {
      id: "T003",
      name: "Budi Santoso",
      phone: "081234567892",
      email: "budi@email.com",
      checkIn: "2025-01-01",
      checkOut: "2025-06-01",
      remainingDays: 155,
      paymentStatus: "Partial",
      totalAmount: 16000000,
      paidAmount: 8000000,
    }
  },
  {
    id: "R005",
    name: "Kamar Standard B2",
    status: "Available",
    type: "Standard",
    price: 1800000,
  },
];

export default function AdminDashboardPage() {
  const [rooms] = useState(mockRooms);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAction = (action: string, roomId: string, tenantId?: string) => {
    console.log(`Action: ${action}, Room: ${roomId}, Tenant: ${tenantId}`);
    
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
        const room = rooms.find(r => r.id === roomId);
        if (room?.tenant) {
          const message = encodeURIComponent(
            `Halo ${room.tenant.name}, ini adalah pesan dari Admin Suman Residence mengenai kamar ${room.name}.`
          );
          window.open(`https://wa.me/${room.tenant.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        }
        break;
    }
  };

  const filteredRooms = rooms.filter(room => {
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
    }

    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  // Statistik
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const bookedRooms = rooms.filter(r => r.status === 'Booked').length;
  const notPaidCount = rooms.filter(r => r.tenant?.paymentStatus === 'Not Paid').length;
  const partialPaidCount = rooms.filter(r => r.tenant?.paymentStatus === 'Partial').length;
  const totalRevenue = rooms
    .filter(r => r.tenant?.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + (r.tenant?.paidAmount || 0), 0);

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
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                <span>📊</span>
                <span>Export Data</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <span>➕</span>
                <span>Tambah Kamar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Kamar</h3>
              <div className="text-2xl font-bold text-blue-600">{totalRooms}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Kamar Tersedia</h3>
              <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Kamar Terisi</h3>
              <div className="text-2xl font-bold text-orange-600">{bookedRooms}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Belum Bayar</h3>
              <div className="text-2xl font-bold text-red-600">{notPaidCount}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Bayar Sebagian</h3>
              <div className="text-2xl font-bold text-yellow-600">{partialPaidCount}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2 lg:col-span-5">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pendapatan Bulanan</h3>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Semua Kamar', count: totalRooms },
                { key: 'available', label: 'Tersedia', count: availableRooms },
                { key: 'booked', label: 'Terisi', count: bookedRooms },
                { key: 'not-paid', label: 'Belum Bayar', count: notPaidCount },
                { key: 'partial-paid', label: 'Bayar Sebagian', count: partialPaidCount },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                    filter === option.key 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{option.count}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari kamar atau nama penyewa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Kamar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.type}</p>
                  <p className="text-sm font-medium text-blue-600">{formatCurrency(room.price)}/bulan</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {room.status}
                </span>
              </div>

              {room.tenant && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">👤</span>
                    <span className="text-sm font-medium">{room.tenant.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📞</span>
                    <span className="text-sm text-gray-600">{room.tenant.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📧</span>
                    <span className="text-sm text-gray-600">{room.tenant.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📅</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(room.tenant.checkIn)} - {formatDate(room.tenant.checkOut)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">💰</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(room.tenant.paidAmount)} / {formatCurrency(room.tenant.totalAmount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Sisa: {room.tenant.remainingDays} hari</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.tenant.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      room.tenant.paymentStatus === 'Not Paid' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.tenant.paymentStatus}
                    </span>
                  </div>

                  {room.tenant.paymentStatus === 'Not Paid' && (
                    <div className="flex flex-col space-y-2 pt-3 border-t">
                      <button 
                        onClick={() => handleAction('approve', room.id, room.tenant?.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                      >
                        ACC Booking
                      </button>
                      <button 
                        onClick={() => handleAction('send_invoice', room.id, room.tenant?.id)}
                        className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium"
                      >
                        Kirim Invoice
                      </button>
                    </div>
                  )}

                  {room.tenant.paymentStatus === 'Paid' && (
                    <div className="flex flex-col space-y-2 pt-3 border-t">
                      <button 
                        onClick={() => handleAction('send_receipt', room.id, room.tenant?.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                      >
                        Kirim Receipt & SOP
                      </button>
                      <button 
                        onClick={() => handleAction('send_whatsapp', room.id, room.tenant?.id)}
                        className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <span>💬</span>
                        <span>Kirim ke WhatsApp</span>
                      </button>
                    </div>
                  )}

                  {room.tenant.paymentStatus === 'Partial' && (
                    <div className="flex flex-col space-y-2 pt-3 border-t">
                      <button 
                        onClick={() => handleAction('send_invoice', room.id, room.tenant?.id)}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                      >
                        Kirim Tagihan Sisa
                      </button>
                      <button 
                        onClick={() => handleAction('send_whatsapp', room.id, room.tenant?.id)}
                        className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <span>💬</span>
                        <span>Hubungi via WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Tidak ada kamar yang ditemukan</h3>
              <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
