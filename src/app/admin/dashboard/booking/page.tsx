"use client";

import { useState } from "react";

interface NewBooking {
  id: string;
  roomId: string;
  roomName: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function BookingManagementPage() {
  const [bookings] = useState<NewBooking[]>([
    {
      id: "B001",
      roomId: "R003",
      roomName: "Kamar Deluxe A2",
      tenantName: "Andi Wijaya",
      tenantPhone: "081234567894",
      tenantEmail: "andi@email.com",
      checkIn: "2025-07-01",
      checkOut: "2026-01-01",
      totalAmount: 15000000,
      requestDate: "2025-06-25",
      status: "Pending"
    },
    {
      id: "B002",
      roomId: "R005",
      roomName: "Kamar Standard B2",
      tenantName: "Lisa Permata",
      tenantPhone: "081234567895",
      tenantEmail: "lisa@email.com",
      checkIn: "2025-08-01",
      checkOut: "2026-02-01",
      totalAmount: 10800000,
      requestDate: "2025-06-26",
      status: "Pending"
    },
    {
      id: "B003",
      roomId: "R006",
      roomName: "Kamar Premium C2",
      tenantName: "Dedi Setiawan",
      tenantPhone: "081234567896",
      tenantEmail: "dedi@email.com",
      checkIn: "2025-09-01",
      checkOut: "2026-03-01",
      totalAmount: 19200000,
      requestDate: "2025-06-27",
      status: "Approved"
    }
  ]);

  const [filter, setFilter] = useState<string>("all");

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

  const handleBookingAction = (bookingId: string, action: 'approve' | 'reject' | 'send_contract') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    switch (action) {
      case 'approve':
        alert(`Booking ${bookingId} telah disetujui. Invoice dan kontrak akan dikirim ke ${booking.tenantEmail}`);
        break;
      case 'reject':
        alert(`Booking ${bookingId} telah ditolak. Notifikasi akan dikirim ke ${booking.tenantEmail}`);
        break;
      case 'send_contract':
        alert(`Kontrak sewa untuk booking ${bookingId} telah dikirim ke ${booking.tenantEmail}`);
        break;
    }
  };

  const handleWhatsAppContact = (booking: NewBooking) => {
    const message = encodeURIComponent(
      `Halo ${booking.tenantName}, terima kasih atas minat Anda untuk menyewa ${booking.roomName} di Suman Residence. Tim kami akan segera memproses permintaan booking Anda.`
    );
    window.open(`https://wa.me/${booking.tenantPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kelola Booking</h1>
              <p className="text-gray-600 mt-1">Kelola permintaan booking baru dari calon penyewa</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <span>📊</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Booking</h3>
              <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Menunggu Persetujuan</h3>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Disetujui</h3>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Ditolak</h3>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Semua Booking', count: bookings.length },
              { key: 'pending', label: 'Menunggu', count: pendingCount },
              { key: 'approved', label: 'Disetujui', count: approvedCount },
              { key: 'rejected', label: 'Ditolak', count: rejectedCount },
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
        </div>

        {/* List Booking */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informasi Booking */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.id}</h3>
                      <p className="text-sm text-gray-600">Dibuat: {formatDate(booking.requestDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Informasi Kamar</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">ID:</span> {booking.roomId}</p>
                        <p><span className="text-gray-600">Nama:</span> {booking.roomName}</p>
                        <p><span className="text-gray-600">Total:</span> {formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Informasi Penyewa</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Nama:</span> {booking.tenantName}</p>
                        <p><span className="text-gray-600">Telepon:</span> {booking.tenantPhone}</p>
                        <p><span className="text-gray-600">Email:</span> {booking.tenantEmail}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Periode Sewa</h4>
                      <div className="text-sm">
                        <p>
                          <span className="text-gray-600">Dari:</span> {formatDate(booking.checkIn)} 
                          <span className="text-gray-600 ml-4">Sampai:</span> {formatDate(booking.checkOut)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Panel */}
                <div className="border-l-0 lg:border-l pl-0 lg:pl-6">
                  <h4 className="font-medium text-gray-900 mb-4">Aksi</h4>
                  <div className="space-y-3">
                    {booking.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleBookingAction(booking.id, 'approve')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <span>✅</span>
                          <span>Setujui Booking</span>
                        </button>
                        <button 
                          onClick={() => handleBookingAction(booking.id, 'reject')}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <span>❌</span>
                          <span>Tolak Booking</span>
                        </button>
                      </>
                    )}

                    {booking.status === 'Approved' && (
                      <button 
                        onClick={() => handleBookingAction(booking.id, 'send_contract')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <span>📄</span>
                        <span>Kirim Kontrak</span>
                      </button>
                    )}

                    <button 
                      onClick={() => handleWhatsAppContact(booking)}
                      className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <span>💬</span>
                      <span>Hubungi via WhatsApp</span>
                    </button>

                    <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2">
                      <span>👁️</span>
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Tidak ada booking yang ditemukan</h3>
              <p>Belum ada permintaan booking yang sesuai dengan filter yang dipilih.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
