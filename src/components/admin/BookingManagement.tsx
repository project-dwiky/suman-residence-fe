"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  MessageCircle,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  Upload,
  File,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../user-dashboard/utils/dateUtils';
import { adminBookingService } from '@/services/admin-booking.service';

interface BookingDocument {
  id: string;
  type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Booking {
  id: string;
  userId: string;
  rentalStatus: 'PENDING' | 'APPROVED' | 'CANCEL';
  room: {
    id: string;
    roomNumber: string;
    type: string;
    size: string;
    facilities: string[];
    imagesGallery: string[];
  };
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    durationType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
  };
  documents: BookingDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await adminBookingService.getAllBookings();
      
      if (result.success) {
        setBookings(result.bookings || []);
      } else {
        throw new Error(result.error || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (
    bookingId: string, 
    action: 'approve' | 'reject' | 'cancel'
  ) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      const result = await adminBookingService.updateBookingStatus(bookingId, action);
      
      if (result.success) {
        toast.success(result.message || `Booking ${action}d successfully`);
        // Refresh bookings list
        await fetchBookings();
      } else {
        throw new Error(result.error || `Failed to ${action} booking`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(error.message || `Gagal ${action} booking`);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Yakin ingin menghapus booking ini?')) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      const result = await adminBookingService.deleteBooking(bookingId);
      
      if (result.success) {
        toast.success('Booking berhasil dihapus');
        await fetchBookings();
      } else {
        throw new Error(result.error || 'Failed to delete booking');
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast.error(error.message || 'Gagal menghapus booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleWhatsAppContact = (booking: Booking) => {
    try {
      adminBookingService.openWhatsAppToCustomer(booking);
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuka WhatsApp');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      CANCEL: { color: 'bg-red-100 text-red-800', label: 'Canceled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    const matchesFilter = activeFilter === 'all' || booking.rentalStatus === activeFilter;
    
    // Filter by search query (booking ID, user ID, room number, contact info)
    const matchesSearch = !searchQuery || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.phone?.includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });

  const getActionButtons = (booking: Booking) => {
    const isLoading = actionLoading[booking.id];
    
    switch (booking.rentalStatus) {
      case 'PENDING':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleBookingAction(booking.id, 'approve')}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Disetujui
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBookingAction(booking.id, 'reject')}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Tolak
            </Button>
          </div>
        );
      
      case 'APPROVED':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBookingAction(booking.id, 'cancel')}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Batalkan
            </Button>
          </div>
        );
        
      case 'CANCEL':
        return (
          <span className="text-sm text-gray-500">Booking dibatalkan</span>
        );
      
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDurationLabel = (durationType: string) => {
    switch (durationType) {
      case 'WEEKLY': return 'Mingguan';
      case 'MONTHLY': return 'Bulanan';
      case 'SEMESTER': return 'Semester';
      case 'YEARLY': return 'Tahunan';
      default: return durationType;
    }
  };

    const handleFileUpload = async (bookingId: string, documentType: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE', file: File) => {
    setUploadingFile(`${bookingId}-${documentType}`);
    
    // Placeholder implementation - Isa akan kerjakan :D
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`✨ Placeholder: File ${file.name} akan diupload untuk ${documentType}. Isa akan kerjakan fitur ini! 🚀`);
      
      // For now, just refresh the bookings to simulate update
      await fetchBookings();
    } catch (error: any) {
      console.error('Placeholder file upload:', error);
      toast.error('📄 Fitur upload file sedang dalam pengembangan - Isa akan kerjakan! 💪');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleFileSelect = (bookingId: string, documentType: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(bookingId, documentType, file);
      }
    };
    input.click();
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'BOOKING_SLIP': return 'Booking Slip (DP)';
      case 'RECEIPT': return 'Receipt (Lunas)';
      case 'SOP': return 'SOP';
      case 'INVOICE': return 'Invoice (Tagihan)';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
          <p className="text-gray-600">Kelola semua booking dari customer</p>
        </div>
        <Button onClick={fetchBookings} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Cari booking ID, user ID, kamar, nama, email, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
            onClick={() => setActiveFilter('all')}
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
                onClick={() => setActiveFilter(status)}
                size="default"
                className="h-10 px-4"
              >
                {statusLabel} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  {searchQuery ? 'Tidak ada booking yang sesuai dengan pencarian' : 'Tidak ada booking'}
                </p>
                <p className="text-sm text-gray-400">
                  {searchQuery 
                    ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                    : activeFilter === 'all' 
                      ? 'Belum ada booking yang masuk' 
                      : `Tidak ada booking dengan status ${activeFilter}`
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="mt-3"
                  >
                    Hapus Pencarian
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Booking ID: {highlightSearchTerm(booking.id.substring(0, 8) + '...', searchQuery)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(booking.rentalStatus)}
                          <span className="text-sm text-gray-500">
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Customer</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{highlightSearchTerm(booking.contactInfo?.name || booking.userId, searchQuery)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{highlightSearchTerm(booking.contactInfo?.phone || '-', searchQuery)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{highlightSearchTerm(booking.contactInfo?.email || '-', searchQuery)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Kamar</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{highlightSearchTerm(booking.room.roomNumber, searchQuery)}</span>
                          </div>
                          <div>Tipe: {booking.room.type}</div>
                          <div>Ukuran: {booking.room.size}</div>
                        </div>
                      </div>

                      {/* Rental Period */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Periode Sewa</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {formatDate(booking.rentalPeriod.startDate)} - {formatDate(booking.rentalPeriod.endDate)}
                            </span>
                          </div>
                          <div>Durasi: {getDurationLabel(booking.rentalPeriod.durationType)}</div>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">Catatan</h4>
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}

                    {/* Document Management Section */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        Dokumen Booking
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Preview - Isa akan kerjakan 🚀
                        </span>
                      </h4>
                      
                      {/* Existing Documents */}
                      {booking.documents && booking.documents.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {booking.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{getDocumentTypeLabel(doc.type)}</span>
                                <span className="text-xs text-gray-500">({doc.fileName})</span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(doc.fileUrl, '_blank')}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileSelect(booking.id, 'BOOKING_SLIP')}
                          disabled={uploadingFile === `${booking.id}-BOOKING_SLIP`}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingFile === `${booking.id}-BOOKING_SLIP` ? 'Uploading...' : 'Upload Booking Slip'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileSelect(booking.id, 'RECEIPT')}
                          disabled={uploadingFile === `${booking.id}-RECEIPT`}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingFile === `${booking.id}-RECEIPT` ? 'Uploading...' : 'Upload Receipt'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileSelect(booking.id, 'SOP')}
                          disabled={uploadingFile === `${booking.id}-SOP`}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingFile === `${booking.id}-SOP` ? 'Uploading...' : 'Upload SOP'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileSelect(booking.id, 'INVOICE')}
                          disabled={uploadingFile === `${booking.id}-INVOICE`}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingFile === `${booking.id}-INVOICE` ? 'Uploading...' : 'Upload Invoice'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {getActionButtons(booking)}
                    
                    {booking.contactInfo?.whatsapp && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppContact(booking)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBooking(booking.id)}
                      disabled={actionLoading[booking.id]}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
