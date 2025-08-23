"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Booking, BookingDocument } from '../types';
import { BookingValidation } from './BookingValidation';
import BookingFilters from './BookingFilters';
import BookingCard from './BookingCard';
import { adminBookingService } from '@/services/admin-booking.service';
import { DocumentGenerationService } from '@/services/document-generation.service';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [generatingDocuments, setGeneratingDocuments] = useState<string | null>(null);
  
  // Inline editing state
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    roomNumber?: string;
    roomType?: string;
    startDate?: Date;
    endDate?: Date;
    durationType?: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
    price?: number;
    paidAmount?: number;
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
    action: 'approve' | 'reject' | 'cancel' | 'reactivate'
  ) => {
    try {
      // Validation for approve action
      if (action === 'approve') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          const validation = BookingValidation.validateRequiredFields(booking);
          if (!validation.isValid) {
            toast.error(
              `Tidak bisa approve booking! ${validation.message}`,
              { duration: 5000 }
            );
            return;
          }
        }
      }

      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      const result = await adminBookingService.updateBookingStatus(bookingId, action);
      
      if (result.success) {
        toast.success(result.message || `Booking ${action}d successfully`);
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

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.rentalStatus === activeFilter;
    
    const matchesSearch = !searchQuery || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactInfo?.phone?.includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });

  // Calculate end date based on start date and duration type
  const calculateEndDate = (startDate: Date, durationType: string): Date => {
    const end = new Date(startDate);
    
    switch (durationType) {
      case 'WEEKLY':
        end.setDate(startDate.getDate() + 7);
        break;
      case 'MONTHLY':
        end.setDate(startDate.getDate() + 30);
        break;
      case 'SEMESTER':
        end.setDate(startDate.getDate() + (30 * 6));
        break;
      case 'YEARLY':
        end.setDate(startDate.getDate() + 365);
        break;
      default:
        end.setDate(startDate.getDate() + 30);
    }
    
    return end;
  };

  const handleStartEdit = (booking: Booking) => {
    setEditingBooking(booking.id);
    setEditedValues({
      roomNumber: booking.room.roomNumber,
      roomType: booking.room.type,
      startDate: new Date(booking.rentalPeriod.startDate),
      endDate: new Date(booking.rentalPeriod.endDate),
      durationType: booking.rentalPeriod.durationType,
      price: booking.pricing?.amount || 0,
      paidAmount: booking.pricing?.paidAmount || 0
    });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedValues({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedValues(prev => {
      const newValues = { ...prev, [field]: value };
      
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
          currency: 'IDR',
          paidAmount: editedValues.paidAmount || 0
        }
      };
      
      const result = await adminBookingService.updateBooking(bookingId, updateData);
      
      if (result.success) {
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
                    currency: 'IDR',
                    paidAmount: editedValues.paidAmount || booking.pricing?.paidAmount || 0
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
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File terlalu besar. Maksimal 10MB.');
      }
  
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOCX.');
      }
  
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
  
      toast.success(`📄 Document berhasil diupload!`);
      await fetchBookings();
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Gagal upload file');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleFileSelect = (bookingId: string, documentType: 'SOP') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(bookingId, documentType, file);
      }
    };
    input.click();
  };



  const handleGenerateAllDocuments = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      toast.error('Booking tidak ditemukan');
      return;
    }

    // Validate required data
    const validation = BookingValidation.validateDocumentGeneration(booking);
    if (!validation.isValid) {
      toast.error(validation.message, { duration: 6000 });
      return;
    }

    setGeneratingDocuments(bookingId);
    
    try {
      toast.info('🔄 Generating semua dokumen...', { duration: 3000 });
      
      // Generate all documents using the service
      const result = await DocumentGenerationService.generateAllDocuments(booking);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate documents');
      }

      if (!result.files) {
        throw new Error('No files generated');
      }

      // Upload all documents
      const uploadPromises = [
        handleFileUpload(bookingId, 'BOOKING_SLIP', result.files.bookingSlip),
        handleFileUpload(bookingId, 'RECEIPT', result.files.receipt),
        handleFileUpload(bookingId, 'INVOICE', result.files.invoice),
      ];

      await Promise.all(uploadPromises);
      
      toast.success('🎉 Semua dokumen berhasil dibuat dan diupload!', { duration: 4000 });
      
    } catch (error: any) {
      console.error('Error generating documents:', error);
      toast.error(error.message || 'Gagal generate dokumen');
    } finally {
      setGeneratingDocuments(null);
    }
  };



  const handleDocumentDownload = async (document: BookingDocument) => {
    try {
      if (!document.fileUrl) {
        toast.error('Document URL not available');
        return;
      }

      const response = await fetch(document.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = blobUrl;
      
      const fileName = document.fileName || `document-${document.id}.pdf`;
      link.download = fileName;
      
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error(error.message || 'Failed to download document');
    }
  };

  const handleContinueBooking = async (booking: Booking) => {
    try {
      setActionLoading(prev => ({ ...prev, [`continue-${booking.id}`]: true }));

      console.log('Booking to continue:', booking);
      const result = await adminBookingService.continueBooking(booking);
      
      if (result.success) {
        toast.success(result.message || 'Booking berhasil dilanjutkan!');
        await fetchBookings(); // Refresh the list to show the new booking
      } else {
        throw new Error(result.error || 'Failed to continue booking');
      }
    } catch (error: any) {
      console.error('Error continuing booking:', error);
      toast.error(error.message || 'Gagal melanjutkan booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [`continue-${booking.id}`]: false }));
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
      <BookingFilters
        bookings={bookings}
        filteredBookings={filteredBookings}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        loading={loading}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
        onRefresh={fetchBookings}
      />

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
            <BookingCard
              key={booking.id}
              booking={booking}
              isEditing={editingBooking === booking.id}
              editedValues={editedValues}
              actionLoading={actionLoading}
              uploadingFile={uploadingFile}
              generatingDocuments={generatingDocuments}
              searchQuery={searchQuery}
              onFieldChange={handleFieldChange}
              onBookingAction={handleBookingAction}
              onWhatsAppContact={handleWhatsAppContact}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDeleteBooking={handleDeleteBooking}
              onFileSelect={handleFileSelect}
              onGenerateAllDocuments={handleGenerateAllDocuments}
              onDocumentDownload={handleDocumentDownload}
              onContinueBooking={handleContinueBooking}
            />
          ))
        )}
      </div>


    </div>
  );
};

export default BookingManagement;
