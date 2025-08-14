"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  Upload,
  File,
  FileText,
  Edit2,
  Save,
  X,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../user-dashboard/utils/dateUtils';
import { adminBookingService } from '@/services/admin-booking.service';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import ReceiptGeneratorModal from './ReceiptGeneratorModal';
import BookingSlipGeneratorModal from './BookingSlipGeneratorModal';

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
  pricing?: {
    amount: number;
    currency: string;
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
  const [showInvoiceModal, setShowInvoiceModal] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<string | null>(null);
  const [showBookingSlipModal, setShowBookingSlipModal] = useState<string | null>(null);
  
  // Inline editing state
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    roomNumber?: string;
    roomType?: string;
    startDate?: Date;
    endDate?: Date;
    durationType?: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
    price?: number;
  }>({});

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

  // Calculate end date based on start date and duration type
  const calculateEndDate = (startDate: Date, durationType: string): Date => {
    const end = new Date(startDate);
    
    switch (durationType) {
      case 'WEEKLY':
        end.setDate(startDate.getDate() + 7);
        break;
      case 'MONTHLY':
        end.setDate(startDate.getDate() + 30); // Exactly 30 days
        break;
      case 'SEMESTER':
        end.setDate(startDate.getDate() + (30 * 6)); // 6 months = 180 days
        break;
      case 'YEARLY':
        end.setDate(startDate.getDate() + 365); // Exactly 365 days
        break;
      default:
        end.setDate(startDate.getDate() + 30); // Default to 30 days
    }
    
    return end;
  };

  // Handle inline editing
  const handleStartEdit = (booking: Booking) => {
    setEditingBooking(booking.id);
    setEditedValues({
      roomNumber: booking.room.roomNumber,
      roomType: booking.room.type,
      startDate: new Date(booking.rentalPeriod.startDate),
      endDate: new Date(booking.rentalPeriod.endDate),
      durationType: booking.rentalPeriod.durationType,
      price: booking.pricing?.amount || 0
    });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedValues({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedValues(prev => {
      const newValues = { ...prev, [field]: value };
      
      // Auto-calculate end date when start date or duration changes
      if (field === 'startDate' || field === 'durationType') {
        const startDate = field === 'startDate' ? value : prev.startDate;
        const durationType = field === 'durationType' ? value : prev.durationType;
        
        if (startDate && durationType) {
          newValues.endDate = calculateEndDate(startDate, durationType);
        }
      }
      
      return newValues;
    });
  };

  const handleSaveEdit = async (bookingId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`save-${bookingId}`]: true }));
      
      // Prepare update data
      const updateData = {
        room: {
          roomNumber: editedValues.roomNumber,
          type: editedValues.roomType
        },
        rentalPeriod: {
          startDate: editedValues.startDate?.toISOString().split('T')[0],
          endDate: editedValues.endDate?.toISOString().split('T')[0],
          durationType: editedValues.durationType
        },
        pricing: {
          amount: editedValues.price || 0,
          currency: 'IDR'
        }
      };
      
      // Call API to update booking
      const result = await adminBookingService.updateBooking(bookingId, updateData);
      
      if (result.success) {
        // Update local state with the response
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? {
                  ...booking,
                  room: {
                    ...booking.room,
                    roomNumber: editedValues.roomNumber || booking.room.roomNumber,
                    type: editedValues.roomType || booking.room.type
                  },
                  rentalPeriod: {
                    ...booking.rentalPeriod,
                    startDate: editedValues.startDate?.toISOString().split('T')[0] || booking.rentalPeriod.startDate,
                    endDate: editedValues.endDate?.toISOString().split('T')[0] || booking.rentalPeriod.endDate,
                    durationType: editedValues.durationType || booking.rentalPeriod.durationType
                  },
                  pricing: {
                    amount: editedValues.price || booking.pricing?.amount || 0,
                    currency: 'IDR'
                  }
                }
              : booking
          )
        );
        
        setEditingBooking(null);
        setEditedValues({});
        toast.success('Booking berhasil diupdate!');
      } else {
        throw new Error(result.error || 'Failed to update booking');
      }
      
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error(error.message || 'Gagal mengupdate booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [`save-${bookingId}`]: false }));
    }
  };

  const handleFileUpload = async (bookingId: string, documentType: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE', file: File) => {
    setUploadingFile(`${bookingId}-${documentType}`);
    
    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File terlalu besar. Maksimal 10MB.');
      }
  
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOCX.');
      }
  
      // Upload file to MinIO
      const formData = new FormData();
      formData.append('file', file);
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Gagal upload file ke storage');
      }
  
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload gagal');
      }
  
      // Save document metadata to Firebase via admin booking service
      const documentData = {
        bookingId,
        type: documentType,
        fileName: file.name,
        fileUrl: uploadResult.url
      };
  
      const saveResult = await adminBookingService.uploadBookingDocument(documentData as any);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Gagal menyimpan metadata dokumen');
      }
  
      toast.success(`📄 ${getDocumentTypeLabel(documentType)} berhasil diupload!`);
      
      // Refresh bookings to show updated documents
      await fetchBookings();
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Gagal upload file');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleFileSelect = (bookingId: string, documentType: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE') => {
    // Special handling for INVOICE - show modal instead of file picker
    if (documentType === 'INVOICE') {
      setShowInvoiceModal(bookingId);
      return;
    }
    
    // Special handling for RECEIPT - show modal instead of file picker
    if (documentType === 'RECEIPT') {
      setShowReceiptModal(bookingId);
      return;
    }
    
    // Special handling for BOOKING_SLIP - show modal instead of file picker
    if (documentType === 'BOOKING_SLIP') {
      setShowBookingSlipModal(bookingId);
      return;
    }
    
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

  const handleInvoiceGenerated = async (bookingId: string, file: File) => {
    try {
      // Use the existing handleFileUpload function for the generated invoice
      await handleFileUpload(bookingId, 'INVOICE', file);
    } catch (error: any) {
      console.error('Error uploading generated invoice:', error);
      toast.error(error.message || 'Gagal upload invoice yang dibuat');
    }
  };

  const handleReceiptGenerated = async (bookingId: string, file: File) => {
    try {
      // Use the existing handleFileUpload function for the generated receipt
      await handleFileUpload(bookingId, 'RECEIPT', file);
    } catch (error: any) {
      console.error('Error uploading generated receipt:', error);
      toast.error(error.message || 'Gagal upload receipt yang dibuat');
    }
  };

  const handleBookingSlipGenerated = async (bookingId: string, file: File) => {
    try {
      // Use the existing handleFileUpload function for the generated booking slip
      await handleFileUpload(bookingId, 'BOOKING_SLIP', file);
    } catch (error: any) {
      console.error('Error uploading generated booking slip:', error);
      toast.error(error.message || 'Gagal upload booking slip yang dibuat');
    }
  };

  const handleDocumentDownload = async (document: any) => {
    try {
      if (!document.fileUrl) {
        toast.error('Document URL not available');
        return;
      }

      // Fetch the file as blob to avoid popup blockers
      const response = await fetch(document.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element for download
      const link = window.document.createElement('a');
      link.href = blobUrl;
      
      // Set the download filename
      const fileName = document.fileName || `document-${document.id}.${getFileExtension(blob.type)}`;
      link.download = fileName;
      
      // Append to body (required for Firefox)
      window.document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      window.document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error(error.message || 'Failed to download document');
    }
  };

  // Helper function to get file extension from MIME type
  const getFileExtension = (mimeType: string): string => {
    const mimeToExt: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'text/plain': 'txt',
    };
    return mimeToExt[mimeType] || 'file';
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
    <div className="space-y-6 p-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <span className="text-gray-600">No. Kamar:</span>
                            {editingBooking === booking.id ? (
                              <Input
                                value={editedValues.roomNumber || ''}
                                onChange={(e) => handleFieldChange('roomNumber', e.target.value)}
                                className="h-6 text-xs flex-1"
                                placeholder="Contoh: A1, B2, etc"
                              />
                            ) : (
                              <span className={`font-medium ${booking.room.roomNumber === 'Belum diset' ? 'text-orange-600' : ''}`}>
                                {highlightSearchTerm(booking.room.roomNumber, searchQuery)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Tipe:</span>
                            {editingBooking === booking.id ? (
                              <Input
                                value={editedValues.roomType || ''}
                                onChange={(e) => handleFieldChange('roomType', e.target.value)}
                                className="h-6 text-xs flex-1"
                                placeholder="Tipe kamar"
                              />
                            ) : (
                              <span>{booking.room.type}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rental Period */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Periode Sewa</h4>
                        <div className="space-y-2 text-sm">
                          {editingBooking === booking.id ? (
                            <>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-600">Tanggal Mulai:</label>
                                <DatePicker
                                  date={editedValues.startDate}
                                  onSelect={(date) => handleFieldChange('startDate', date)}
                                  placeholder="Pilih tanggal mulai"
                                  className="h-6 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-600">Durasi:</label>
                                <Select 
                                  value={editedValues.durationType} 
                                  onValueChange={(value) => handleFieldChange('durationType', value)}
                                >
                                  <SelectTrigger className="h-6 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="WEEKLY">Mingguan</SelectItem>
                                    <SelectItem value="MONTHLY">Bulanan</SelectItem>
                                    <SelectItem value="SEMESTER">Semester</SelectItem>
                                    <SelectItem value="YEARLY">Tahunan</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-600">Tanggal Berakhir (otomatis):</label>
                                <DatePicker
                                  date={editedValues.endDate}
                                  onSelect={() => {}} // Read-only
                                  placeholder="Dihitung otomatis"
                                  disabled={true}
                                  className="h-6 text-xs bg-gray-50"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  {formatDate(booking.rentalPeriod.startDate)} - {formatDate(booking.rentalPeriod.endDate)}
                                </span>
                              </div>
                              <div>Durasi: {getDurationLabel(booking.rentalPeriod.durationType)}</div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Pricing Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Harga</h4>
                        <div className="space-y-2 text-sm">
                          {editingBooking === booking.id ? (
                            <div className="space-y-1">
                              <label className="text-xs text-gray-600">Harga Sewa (IDR):</label>
                              <Input
                                type="number"
                                value={editedValues.price || ''}
                                onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                                className="h-6 text-xs"
                                placeholder="Masukkan harga (contoh: 1500000)"
                                min="0"
                                step="50000"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className={`font-medium ${(booking.pricing?.amount || 0) > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                {(booking.pricing?.amount || 0) > 0 ? formatPrice(booking.pricing?.amount || 0) : 'Belum diset'}
                              </span>
                            </div>
                          )}
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
                      <h4 className="font-medium text-gray-900 mb-3">
                        Dokumen Booking
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
                                  onClick={() => handleDocumentDownload(doc)}
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
                          {uploadingFile === `${booking.id}-BOOKING_SLIP` ? 'Uploading...' : 'Generate Booking Slip'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileSelect(booking.id, 'RECEIPT')}
                          disabled={uploadingFile === `${booking.id}-RECEIPT`}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingFile === `${booking.id}-RECEIPT` ? 'Uploading...' : 'Generate Receipt'}
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
                          {uploadingFile === `${booking.id}-INVOICE` ? 'Uploading...' : 'Generate Invoice'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {editingBooking === booking.id ? (
                      // Edit mode buttons
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(booking.id)}
                          disabled={actionLoading[`save-${booking.id}`]}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {actionLoading[`save-${booking.id}`] ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="text-gray-600 border-gray-600 hover:bg-gray-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Batal
                        </Button>
                      </>
                    ) : (
                      // Normal mode buttons
                      <>
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
                          onClick={() => handleStartEdit(booking)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        
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
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Invoice Generator Modal */}
      {showInvoiceModal && (
        <InvoiceGeneratorModal
          bookingId={showInvoiceModal}
          initialData={{
            guestName: bookings.find(b => b.id === showInvoiceModal)?.contactInfo?.name || '',
            description: 'Sewa Kamar Kost - ' + (bookings.find(b => b.id === showInvoiceModal)?.room.roomNumber || ''),
            startDate: bookings.find(b => b.id === showInvoiceModal)?.rentalPeriod?.startDate || '',
            endDate: bookings.find(b => b.id === showInvoiceModal)?.rentalPeriod?.endDate || '',
            priceIdr: bookings.find(b => b.id === showInvoiceModal)?.pricing?.amount || 0,
          }}
          onClose={() => setShowInvoiceModal(null)}
          onInvoiceGenerated={handleInvoiceGenerated}
        />
      )}

      {/* Receipt Generator Modal */}
      {showReceiptModal && (
        <ReceiptGeneratorModal
          bookingId={showReceiptModal}
          initialData={{
            guestName: bookings.find(b => b.id === showReceiptModal)?.contactInfo?.name || '',
            description: 'Sewa Kamar Kost - ' + (bookings.find(b => b.id === showReceiptModal)?.room.roomNumber || ''),
            startDate: bookings.find(b => b.id === showReceiptModal)?.rentalPeriod?.startDate || '',
            endDate: bookings.find(b => b.id === showReceiptModal)?.rentalPeriod?.endDate || '',
            priceIdr: bookings.find(b => b.id === showReceiptModal)?.pricing?.amount || 0,
          }}
          onClose={() => setShowReceiptModal(null)}
          onReceiptGenerated={handleReceiptGenerated}
        />
      )}

      {/* Booking Slip Generator Modal */}
      {showBookingSlipModal && (
        <BookingSlipGeneratorModal
          bookingId={showBookingSlipModal}
          initialData={{
            guestName: bookings.find(b => b.id === showBookingSlipModal)?.contactInfo?.name || '',
            renterPhoneNumber: bookings.find(b => b.id === showBookingSlipModal)?.contactInfo?.phone || '',
            roomNumber: bookings.find(b => b.id === showBookingSlipModal)?.room.roomNumber === 'Belum diset' ? '' : bookings.find(b => b.id === showBookingSlipModal)?.room.roomNumber || '',
          }}
          onClose={() => setShowBookingSlipModal(null)}
          onBookingSlipGenerated={handleBookingSlipGenerated}
        />
      )}
    </div>
  );
};

export default BookingManagement;