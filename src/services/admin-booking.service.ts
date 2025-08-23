import { RentalData } from '@/components/user-dashboard/types';

const BASE_URL = '/api';

export interface AdminBookingResponse {
  success: boolean;
  booking?: any;
  bookings?: any[];
  error?: string;
  message?: string;
}

export class AdminBookingService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Get all bookings for admin
  static async getAllBookings(): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'GET',
        headers: AdminBookingService.getHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to fetch bookings');
      }

      return {
        success: true,
        bookings: result.bookings || []
      };
    } catch (error: any) {
      console.error('Error fetching all bookings:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch bookings'
      };
    }
  }

  // Approve, reject, cancel, or reactivate a booking - simplified actions
  static async updateBookingStatus(
    bookingId: string, 
    action: 'approve' | 'reject' | 'cancel' | 'reactivate'
  ): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BASE_URL}/admin/bookings/${bookingId}/action`, {
        method: 'POST',
        headers: AdminBookingService.getHeaders(),
        body: JSON.stringify({ action })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || `Failed to ${action} booking`);
      }

      return {
        success: true,
        booking: result.booking,
        message: result.message
      };
    } catch (error: any) {
      console.error(`Error ${action}ing booking:`, error);
      return {
        success: false,
        error: error.message || `Failed to ${action} booking`
      };
    }
  }

  static async uploadBookingDocument(documentData: {
    bookingId: string;
    type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE';
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
  }): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BASE_URL}/admin/bookings/${documentData.bookingId}/documents`, {
        method: 'POST',
        headers: AdminBookingService.getHeaders(),
        body: JSON.stringify({
          type: documentData.type,
          fileName: documentData.fileName,
          fileUrl: documentData.fileUrl,
          uploadedBy: documentData.uploadedBy
        }),
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save document');
      }
  
      return {
        success: true,
        message: result.message || 'Document uploaded successfully',
        booking: result.booking
      };
    } catch (error: any) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload document'
      };
    }
  }

  // Update booking details
  static async updateBooking(bookingId: string, updateData: any): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BASE_URL}/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: AdminBookingService.getHeaders(),
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update booking');
      }

      return {
        success: true,
        booking: result.booking,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to update booking'
      };
    }
  }

  // Delete a booking
  static async deleteBooking(bookingId: string): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BASE_URL}/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: AdminBookingService.getHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to delete booking');
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete booking'
      };
    }
  }

  // Generate WhatsApp message for customer contact
  static generateCustomerWhatsAppMessage(booking: any): string {
    const startDate = new Date(booking.rentalPeriod.startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });

    const endDate = new Date(booking.rentalPeriod.endDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const totalPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(booking.room.totalPrice);

    const durationType = booking.rentalPeriod.durationType === 'MONTHLY' ? 'Bulanan' : 
                         booking.rentalPeriod.durationType === 'SEMESTER' ? 'Semester' : 'Tahunan';

    let statusInfo = '';
    switch (booking.rentalStatus) {
      case 'CONFIRMED':
      case 'APPROVED':
        statusInfo = '✅ Booking Anda telah DIKONFIRMASI! Silakan lakukan pembayaran sesuai instruksi berikut:';
        break;
      case 'CANCELLED':
      case 'CANCEL':
        statusInfo = '❌ Mohon maaf, booking Anda tidak dapat kami proses karena alasan tertentu.';
        break;
      default:
        statusInfo = 'ℹ️ Update status booking Anda:';
    }

    return `🏠 *SUMAN RESIDENCE* 🏠
📋 *UPDATE BOOKING*

${statusInfo}

🆔 *ID Booking:* ${booking.id}

👤 *Detail Penyewa:*
• Nama: ${booking.contactInfo?.name || booking.userId}
• WhatsApp: ${booking.contactInfo?.whatsapp || booking.contactInfo?.phone || '-'}

🏠 *Detail Kamar:*
• Kamar: ${booking.room.roomNumber}
• Tipe: ${booking.room.type}
• Harga: ${totalPrice}

📅 *Periode Sewa:*
• Mulai: ${startDate}
• Berakhir: ${endDate}
• Durasi: ${durationType}

⚡ *STATUS: ${booking.rentalStatus}*

📞 *Hubungi Admin:*
wa.me/6281234567890

⏰ Update: ${new Date().toLocaleString('id-ID')}`;
  }

  // Open WhatsApp to customer
  static openWhatsAppToCustomer(booking: any) {
    const message = AdminBookingService.generateCustomerWhatsAppMessage(booking);
    let phoneNumber = booking.contactInfo?.whatsapp?.replace(/\D/g, '') || 
                     booking.contactInfo?.phone?.replace(/\D/g, '') || '';
    
    if (!phoneNumber) {
      throw new Error('No phone number available for this booking');
    }

    // Ensure the number starts with 62 (Indonesia country code)
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('62')) {
      phoneNumber = '62' + phoneNumber;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  // Continue booking by creating a new booking with same details but extended dates
  static async continueBooking(originalBooking: any): Promise<AdminBookingResponse> {
    
    try {
      // Validate required fields
      if (!originalBooking.rentalPeriod?.startDate || !originalBooking.rentalPeriod?.endDate || !originalBooking.rentalPeriod?.durationType) {
        throw new Error('Invalid booking data: missing rental period information');
      }

      if (!originalBooking.userId || !originalBooking.room?.roomNumber) {
        throw new Error('Invalid booking data: missing user or room information');
      }

      // Calculate new start date (end date of original booking)
      const originalEndDate = new Date(originalBooking.rentalPeriod.endDate);
      const newStartDate = new Date(originalEndDate);
      
      // Ensure we're working with valid dates
      if (isNaN(newStartDate.getTime())) {
        throw new Error('Invalid end date in original booking');
      }
      
      // Calculate new end date based on duration type
      let newEndDate = new Date(newStartDate);
      switch (originalBooking.rentalPeriod.durationType) {
        case 'WEEKLY':
          newEndDate.setDate(newStartDate.getDate() + 7);
          break;
        case 'MONTHLY':
          newEndDate.setDate(newStartDate.getDate() + 30);
          break;
        case 'SEMESTER':
          newEndDate.setDate(newStartDate.getDate() + (30 * 6));
          break;
        case 'YEARLY':
          newEndDate.setDate(newStartDate.getDate() + 365);
          break;
        default:
          newEndDate.setDate(newStartDate.getDate() + 30);
      }

      // Validate new end date
      if (isNaN(newEndDate.getTime())) {
        throw new Error('Failed to calculate new end date');
      }

      // Prepare new booking data
      const newBookingData = {
        userId: originalBooking.userId,
        room: {
          roomNumber: originalBooking.room.roomNumber,
          type: originalBooking.room.type,
        },
        contactInfo: originalBooking.contactInfo,
        rentalPeriod: {
          startDate: newStartDate,
          endDate: newEndDate,
          durationType: originalBooking.rentalPeriod.durationType
        },
        pricing: {
          amount: originalBooking.pricing?.amount || 0,
          currency: originalBooking.pricing?.currency || 'IDR',
          paidAmount: 0 // Reset paid amount for new booking
        },
        notes: `Lanjutan dari booking ${originalBooking.id} - ${originalBooking.rentalPeriod.startDate} s/d ${originalBooking.rentalPeriod.endDate}`,
        rentalStatus: 'PENDING' // Start as pending for admin approval
      };

      console.log('🔄 Creating continuation booking:', {
        originalId: originalBooking.id,
        newStartDate: newStartDate.toISOString(),
        newEndDate: newEndDate.toISOString(),
        durationType: originalBooking.rentalPeriod.durationType
      });

      // Create new booking via API
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: AdminBookingService.getHeaders(),
        body: JSON.stringify(newBookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to continue booking');
      }

      return {
        success: true,
        booking: result.booking,
        message: `Booking berhasil dilanjutkan dengan ID: ${result.bookingId}`
      };
    } catch (error: any) {
      console.error('Error continuing booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to continue booking'
      };
    }
  }
}

export const adminBookingService = AdminBookingService;
