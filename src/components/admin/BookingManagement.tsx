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
  rentalStatus: 'PENDING' | 'SETUJUI' | 'CANCEL';
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
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchBookings();
  }, []);

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
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu' },
      SETUJUI: { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      CANCEL: { color: 'bg-red-100 text-red-800', label: 'Dibatalkan' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.rentalStatus === activeFilter;
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
              Setujui
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
      
      case 'SETUJUI':
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
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookingId', bookingId);
      formData.append('documentType', documentType);

      const response = await fetch('/api/admin/bookings/upload-document', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Dokumen ${documentType} berhasil diupload`);
        fetchBookings(); // Refresh bookings to show new document
      } else {
        const error = await response.json();
        toast.error(error.message || 'Gagal mengupload dokumen');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Gagal mengupload dokumen');
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('all')}
          size="sm"
        >
          <Filter className="w-4 h-4 mr-1" />
          Semua ({bookings.length})
        </Button>
        {['PENDING', 'SETUJUI', 'CONFIRMATION', 'ACTIVE', 'COMPLETED', 'CANCEL'].map(status => {
          const count = bookings.filter(b => b.rentalStatus === status).length;
          return (
            <Button
              key={status}
              variant={activeFilter === status ? 'default' : 'outline'}
              onClick={() => setActiveFilter(status)}
              size="sm"
            >
              {getStatusBadge(status)} ({count})
            </Button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Tidak ada booking</p>
                <p className="text-sm text-gray-400">
                  {activeFilter === 'all' 
                    ? 'Belum ada booking yang masuk' 
                    : `Tidak ada booking dengan status ${activeFilter}`
                  }
                </p>
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
                          Booking ID: {booking.id.substring(0, 8)}...
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
                            <span>{booking.contactInfo?.name || booking.userId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{booking.contactInfo?.phone || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{booking.contactInfo?.email || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Kamar</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{booking.room.roomNumber}</span>
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
                      <h4 className="font-medium text-gray-900 mb-3">Dokumen Booking</h4>
                      
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
