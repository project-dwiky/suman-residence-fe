"use client";

import { useState, useEffect } from "react";
import { BookingService } from "@/components/user-dashboard/services/booking.service";
import { adminBookingService } from "@/services/admin-booking.service";

interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  remainingDays: number;
  paymentStatus: 'Paid' | 'Not Paid' | 'Partial';
  totalAmount: number;
  paidAmount: number;
  lastPayment: string | null;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      setLoading(true);
      
      // Use admin booking service to get full booking data with contact info
      const result = await adminBookingService.getAllBookings();
      
      if (result.success && result.bookings) {
        // Transform bookings to tenant format
        const activeBookings = result.bookings
          .filter(booking => booking.rentalStatus === 'ACTIVE' || booking.rentalStatus === 'SETUJUI' || booking.rentalStatus === 'CONFIRMATION')
          .map(booking => {
            const checkInDate = new Date(booking.rentalPeriod.startDate);
            const checkOutDate = new Date(booking.rentalPeriod.endDate);
            const today = new Date();
            const remainingDays = Math.max(0, Math.floor((checkOutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
            
            // Get payment status from booking status
            let paymentStatus: 'Paid' | 'Not Paid' | 'Partial' = 'Not Paid';
            if (booking.rentalStatus === 'ACTIVE' || booking.rentalStatus === 'CONFIRMATION') {
              paymentStatus = 'Paid';
            } else if (booking.rentalStatus === 'SETUJUI') {
              paymentStatus = 'Not Paid';
            }

            return {
              id: booking.id,
              name: booking.contactInfo?.name || booking.userId, // Use contact name if available
              phone: booking.contactInfo?.phone || '', // Get phone from contact info
              email: booking.contactInfo?.email || '', // Get email from contact info
              roomId: booking.room.id,
              roomName: booking.room.roomNumber,
              checkIn: booking.rentalPeriod.startDate,
              checkOut: booking.rentalPeriod.endDate,
              remainingDays,
              paymentStatus,
              totalAmount: 0, // Price management removed
              paidAmount: paymentStatus === 'Paid' ? 0 : 0, // Price management removed
              lastPayment: paymentStatus === 'Paid' ? booking.rentalPeriod.startDate : null,
            };
          });

        setTenants(activeBookings);
      } else {
        setError(result.error || 'Failed to fetch tenants');
      }
    } catch (err: any) {
      console.error('Error fetching tenants:', err);
      setError(err.message || 'Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAction = (action: string, tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    switch (action) {
      case 'send_reminder':
        alert(`Pengingat pembayaran telah dikirim ke ${tenant.name} (${tenant.email})`);
        break;
      case 'send_invoice':
        alert(`Invoice telah dikirim ke ${tenant.name} (${tenant.email})`);
        break;
      case 'extend_stay':
        alert(`Formulir perpanjangan sewa telah dikirim ke ${tenant.name}`);
        break;
      case 'terminate':
        if (confirm(`Apakah Anda yakin ingin mengakhiri sewa untuk ${tenant.name}?`)) {
          alert(`Proses terminasi sewa untuk ${tenant.name} telah dimulai`);
        }
        break;
      case 'whatsapp':
        let phoneNumber = tenant.phone.replace(/[^0-9]/g, '');
        
        // Ensure the number starts with 62 (Indonesia country code)
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62')) {
          phoneNumber = '62' + phoneNumber;
        }

        const message = encodeURIComponent(
          `Halo ${tenant.name}, ini adalah pesan dari Admin Suman Residence mengenai kamar ${tenant.roomName}.`
        );
        window.open(`https://wa.me/+${phoneNumber}?text=${message}`, '_blank');
        break;
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    let matchesFilter = true;
    switch (filter) {
      case 'paid':
        matchesFilter = tenant.paymentStatus === 'Paid';
        break;
      case 'not-paid':
        matchesFilter = tenant.paymentStatus === 'Not Paid';
        break;
      case 'partial':
        matchesFilter = tenant.paymentStatus === 'Partial';
        break;
      case 'expiring':
        matchesFilter = tenant.remainingDays <= 30;
        break;
    }

    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const paidCount = tenants.filter(t => t.paymentStatus === 'Paid').length;
  const notPaidCount = tenants.filter(t => t.paymentStatus === 'Not Paid').length;
  const partialCount = tenants.filter(t => t.paymentStatus === 'Partial').length;
  const expiringCount = tenants.filter(t => t.remainingDays <= 30).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Penyewa Aktif</h1>
            <p className="text-gray-600 mt-1">Memuat data penyewa...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Memuat data penyewa...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Penyewa Aktif</h1>
            <p className="text-gray-600 mt-1">Error memuat data</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-red-500">
              <h3 className="text-lg font-medium mb-2">Error</h3>
              <p>{error}</p>
              <button 
                onClick={fetchActiveBookings}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Penyewa Aktif</h1>
              <p className="text-gray-600 mt-1">Kelola semua penyewa yang sedang menyewa kamar</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <span>📊</span>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Penyewa</h3>
              <div className="text-2xl font-bold text-blue-600">{tenants.length}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Lunas</h3>
              <div className="text-2xl font-bold text-green-600">{paidCount}</div>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">Segera Berakhir</h3>
              <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
            </div>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Semua Penyewa', count: tenants.length },
                { key: 'paid', label: 'Lunas', count: paidCount },
                { key: 'not-paid', label: 'Belum Bayar', count: notPaidCount },
                { key: 'partial', label: 'Bayar Sebagian', count: partialCount },
                { key: 'expiring', label: 'Segera Berakhir', count: expiringCount },
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
              <input
                type="text"
                placeholder="Cari nama penyewa atau kamar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute ml-3 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Tabel Penyewa */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penyewa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kamar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Sewa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.email}</div>
                        <div className="text-sm text-gray-500">{tenant.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tenant.roomName}</div>
                      <div className="text-sm text-gray-500">ID: {tenant.roomId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(tenant.checkIn)} - {formatDate(tenant.checkOut)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Sisa: {tenant.remainingDays} hari
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(tenant.paidAmount)} / {formatCurrency(tenant.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Terakhir: {formatDate(tenant.lastPayment)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tenant.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        tenant.paymentStatus === 'Not Paid' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tenant.paymentStatus}
                      </span>
                      {tenant.remainingDays <= 30 && (
                        <div className="mt-1">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            Segera Berakhir
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction('whatsapp', tenant.id)}
                          className="text-green-600 hover:text-green-900"
                          title="WhatsApp"
                        >
                          💬
                        </button>
                        
                        {tenant.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => handleAction('send_invoice', tenant.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Kirim Invoice"
                          >
                            📄
                          </button>
                        )}
                        
                        {tenant.remainingDays <= 60 && (
                          <button
                            onClick={() => handleAction('extend_stay', tenant.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Perpanjang Sewa"
                          >
                            📅
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleAction('terminate', tenant.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Akhiri Sewa"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTenants.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Tidak ada penyewa yang ditemukan</h3>
              <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
