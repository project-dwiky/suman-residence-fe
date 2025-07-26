import { RentalData } from '../types';
import { UserBookingService } from '@/services/user-booking.service';
import { AdminBookingService } from '@/services/admin-booking.service';

const userBookingService = new UserBookingService();
const adminBookingService = new AdminBookingService();

export interface BookingRequest {
  room: {
    id: string;
    name?: string;
    roomNumber?: string;
    type?: string;
    floor?: number;
    size?: string;
    description?: string;
    facilities?: string[];
    images?: string[];
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    durationType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  notes?: string;
  userId?: string;
}

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: BookingRequest): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const result = await userBookingService.createBooking(bookingData);
      
      if (result.success) {
        return {
          success: true,
          booking: result.booking
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create booking'
        };
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to create booking'
      };
    }
  }

  // Get all bookings for a user
  static async getUserBookings(userId?: string): Promise<{ success: boolean; bookings?: RentalData[]; error?: string }> {
    try {
      console.log('📞 BookingService.getUserBookings called with userId:', userId);
      
      const bookings = await userBookingService.getUserBookings(userId);
      
      console.log('📞 Found', bookings.length, 'bookings');

      return {
        success: true,
        bookings: bookings
      };
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch bookings'
      };
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<{ success: boolean; booking?: RentalData; error?: string }> {
    try {
      const booking = await userBookingService.getBookingDetails(bookingId);

      if (!booking) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }

      return {
        success: true,
        booking: booking
      };
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch booking'
      };
    }
  }

  // Update booking (admin only)
  static async updateBooking(bookingId: string, updateData: any): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const result = await AdminBookingService.updateBooking(bookingId, updateData);

      if (result.success) {
        return {
          success: true,
          booking: result.booking
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to update booking'
        };
      }
    } catch (error: any) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to update booking'
      };
    }
  }

  // Delete booking (admin only)
  static async deleteBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await AdminBookingService.deleteBooking(bookingId);

      if (result.success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to delete booking'
        };
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete booking'
      };
    }
  }
}
