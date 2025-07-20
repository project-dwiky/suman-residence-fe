"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  status: 'Available' | 'Booked' | 'Maintenance';
  type: string;
  price: number;
  tenant?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    remainingDays: number;
    paymentStatus: 'Paid' | 'Not Paid' | 'Partial';
    totalAmount: number;
    paidAmount: number;
  };
}

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoomData();
  }, [params.id]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      
      // Fetch room data from backend
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const response = await fetch(`${BACKEND_URL}/api/rooms/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Room not found');
      }
      
      const roomData = await response.json();
      
      // Transform the data
      const transformedRoom: Room = {
        id: roomData.room.id,
        name: roomData.room.name,
        status: roomData.room.status || 'Available',
        type: roomData.room.type,
        price: roomData.room.monthlyPrice,
        // tenant data would come from booking data if room is booked
        tenant: undefined // For now, we'll implement this when we have booking-room relationships
      };

      setRoom(transformedRoom);
    } catch (err: any) {
      console.error('Error fetching room:', err);
      setError(err.message || 'Failed to fetch room data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAction = (action: string) => {
    if (!room) return;
    
    switch (action) {
      case 'approve':
        alert(`Booking untuk kamar ${room.name} telah di-ACC. Booking slip akan dikirim.`);
        break;
      case 'send_invoice':
        alert(`Invoice untuk kamar ${room.name} telah dikirim ke tenant.`);
        break;
      case 'send_receipt':
        alert(`Receipt dan SOP untuk kamar ${room.name} telah dikirim ke tenant.`);
        break;
      case 'send_whatsapp':
        if (room.tenant) {
          let phoneNumber = room.tenant.phone.replace(/[^0-9]/g, '');
          
          // Ensure the number starts with 62 (Indonesia country code)
          if (phoneNumber.startsWith('0')) {
            phoneNumber = '62' + phoneNumber.substring(1);
          } else if (!phoneNumber.startsWith('62')) {
            phoneNumber = '62' + phoneNumber;
          }

          const message = encodeURIComponent(
            `Halo ${room.tenant.name}, ini adalah pesan dari Admin Suman Residence mengenai kamar ${room.name}.`
          );
          window.open(`https://wa.me/+${phoneNumber}?text=${message}`, '_blank');
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Kembali
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Memuat Detail Kamar...</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat data kamar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Kembali
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Error</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-red-500">
              <h3 className="text-lg font-medium mb-2">Kamar Tidak Ditemukan</h3>
              <p>{error || 'Kamar tidak dapat dimuat'}</p>
              <button 
                onClick={fetchRoomData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Kembali
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detail Kamar</h1>
                <p className="text-gray-600 mt-1">{room.name}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              room.status === 'Available' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {room.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informasi Kamar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Informasi Kamar</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">ID Kamar:</span>
                <span className="font-medium">{room.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Kamar:</span>
                <span className="font-medium">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipe:</span>
                <span className="font-medium">{room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga:</span>
                <span className="font-medium">{formatCurrency(room.price)}/bulan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  room.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {room.status}
                </span>
              </div>
            </div>
          </div>

          {/* Informasi Penyewa */}
          {room.tenant && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Informasi Penyewa</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium">{room.tenant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telepon:</span>
                  <span className="font-medium">{room.tenant.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{room.tenant.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{formatDate(room.tenant.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{formatDate(room.tenant.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sisa Hari:</span>
                  <span className="font-medium">{room.tenant.remainingDays} hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status Pembayaran:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    room.tenant.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    room.tenant.paymentStatus === 'Not Paid' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.tenant.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rincian Pembayaran */}
          {room.tenant && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Rincian Pembayaran</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tagihan:</span>
                  <span className="font-medium">{formatCurrency(room.tenant.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sudah Dibayar:</span>
                  <span className="font-medium text-green-600">{formatCurrency(room.tenant.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Sisa Tagihan:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(room.tenant.totalAmount - room.tenant.paidAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Panel */}
          {room.tenant && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Aksi Admin</h2>
              <div className="space-y-3">
                {room.tenant.paymentStatus === 'Not Paid' && (
                  <>
                    <button 
                      onClick={() => handleAction('approve')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2"
                    >
                      <span>✅</span>
                      <span>ACC Booking</span>
                    </button>
                    <button 
                      onClick={() => handleAction('send_invoice')}
                      className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2"
                    >
                      <span>📄</span>
                      <span>Kirim Invoice</span>
                    </button>
                  </>
                )}

                {room.tenant.paymentStatus === 'Paid' && (
                  <button 
                    onClick={() => handleAction('send_receipt')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2"
                  >
                    <span>📊</span>
                    <span>Kirim Receipt & SOP</span>
                  </button>
                )}

                {room.tenant.paymentStatus === 'Partial' && (
                  <button 
                    onClick={() => handleAction('send_invoice')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2"
                  >
                    <span>📄</span>
                    <span>Kirim Tagihan Sisa</span>
                  </button>
                )}

                <button 
                  onClick={() => handleAction('send_whatsapp')}
                  className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
