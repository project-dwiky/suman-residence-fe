import { RentalData } from '@/components/user-dashboard/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey';

export interface AdminBookingResponse {
  success: boolean;
  booking?: any;
  bookings?: any[];
  error?: string;
  message?: string;
}

export class AdminBookingService {
  private static getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BACKEND_API_KEY}`
    };
  }

  // Get all bookings for admin
  static async getAllBookings(): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'GET',
        headers: AdminBookingService.getAuthHeaders()
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

  // Approve, reject, confirm, or cancel a booking
  static async updateBookingStatus(
    bookingId: string, 
    action: 'approve' | 'confirm' | 'cancel'
  ): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}/action`, {
        method: 'POST',
        headers: AdminBookingService.getAuthHeaders(),
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

  // Update booking details
  static async updateBooking(bookingId: string, updateData: any): Promise<AdminBookingResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: AdminBookingService.getAuthHeaders(),
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
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: AdminBookingService.getAuthHeaders()
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
        statusInfo = '✅ Booking Anda telah DIKONFIRMASI! Silakan lakukan pembayaran sesuai instruksi berikut:';
        break;
      case 'CANCELLED':
        statusInfo = '❌ Mohon maaf, booking Anda tidak dapat kami proses karena alasan tertentu.';
        break;
      case 'ACTIVE':
        statusInfo = '🎉 Selamat! Kamar Anda sudah siap ditempati.';
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
}

export const adminBookingService = AdminBookingService;
