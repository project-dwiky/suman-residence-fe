import { RentalData } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey';

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
      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        result = { error: text };
      }

      if (!response.ok) {
        throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        booking: result.booking
      };
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
      
      let url: string;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (userId) {
        // Use the backend user-specific endpoint
        url = `${BACKEND_URL}/api/bookings/user/${encodeURIComponent(userId)}`;
        console.log('📞 Calling backend URL:', url);
      } else {
        // Use the general backend endpoint with admin authorization
        url = `${BACKEND_URL}/api/bookings`;
        headers['Authorization'] = `Bearer ${BACKEND_API_KEY}`;
        console.log('📞 Calling admin backend URL:', url);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      console.log('📞 Response status:', response.status);
      console.log('📞 Response ok:', response.ok);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        result = { error: text };
      }

      console.log('📞 Response result:', result);

      if (!response.ok) {
        throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if bookings exist in the response
      if (!result.bookings || !Array.isArray(result.bookings)) {
        console.log('📞 No bookings found or bookings is not an array');
        return {
          success: true,
          bookings: []
        };
      }

      console.log('📞 Found', result.bookings.length, 'bookings');

      // Transform backend booking data to frontend RentalData format
      const transformedBookings: RentalData[] = result.bookings.map((booking: any) => ({
        id: booking.id,
        userId: booking.userId,
        room: {
          id: booking.room.id,
          roomNumber: booking.room.roomNumber || booking.room.name,
          type: booking.room.type,
          floor: booking.room.floor || 1,
          size: booking.room.size,
          description: booking.room.description,
          facilities: booking.room.facilities || [],
          imagesGallery: booking.room.imagesGallery || booking.room.images || []
        },
        rentalStatus: booking.rentalStatus,
        rentalPeriod: {
          startDate: booking.rentalPeriod.startDate,
          endDate: booking.rentalPeriod.endDate,
          durationType: booking.rentalPeriod.durationType
        },
        documents: booking.documents || [],
        notes: booking.notes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }));

      console.log('📞 Transformed bookings:', transformedBookings);

      return {
        success: true,
        bookings: transformedBookings
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
      const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to fetch booking');
      }

      if (!result.booking) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }

      // Transform backend booking data to frontend RentalData format
      const transformedBooking: RentalData = {
        id: result.booking.id,
        userId: result.booking.userId,
        room: {
          id: result.booking.room.id,
          roomNumber: result.booking.room.roomNumber,
          type: result.booking.room.type,
          floor: result.booking.room.floor,
          size: result.booking.room.size,
          description: result.booking.room.description,
          facilities: result.booking.room.facilities,
          imagesGallery: result.booking.room.imagesGallery
        },
        rentalStatus: result.booking.rentalStatus,
        rentalPeriod: {
          startDate: result.booking.rentalPeriod.startDate,
          endDate: result.booking.rentalPeriod.endDate,
          durationType: result.booking.rentalPeriod.durationType
        },
        documents: result.booking.documents || [],
        notes: result.booking.notes,
        createdAt: result.booking.createdAt,
        updatedAt: result.booking.updatedAt
      };

      return {
        success: true,
        booking: transformedBooking
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
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update booking');
      }

      return {
        success: true,
        booking: result.booking
      };
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
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${BACKEND_API_KEY}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to delete booking');
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete booking'
      };
    }
  }
}
