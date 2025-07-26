import { RentalData, RentalStatus, RentalDuration } from '@/components/user-dashboard/types';
import { getRoomMainImage } from '@/utils/static-room-data';

export class UserBookingService {
  private baseUrl: string;

  constructor() {
    // Use local Next.js API routes
    this.baseUrl = '/api';
  }

  // Helper function to get room image based on room type
  private getRoomImage(roomType?: string): string {
    if (roomType === 'A') {
      return getRoomMainImage('A', 'id');
    } else if (roomType === 'B') {
      return getRoomMainImage('B', 'id');
    }
    // Default to Type A image if no specific type
    return getRoomMainImage('A', 'id');
  }

  // Get all bookings for current user
  async getUserBookings(userId?: string): Promise<RentalData[]> {
    try {
      // For now, we'll pass userId as parameter since auth is complex
      if (!userId) {
        console.warn('No user ID provided');
        return [];
      }

      console.log('🔍 UserBookingService: Fetching bookings for user:', userId);

      const response = await fetch(`${this.baseUrl}/bookings?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 UserBookingService: Response status:', response.status);

      if (!response.ok) {
        console.error('🔍 UserBookingService: Response not OK:', response.status, response.statusText);
        return [];
      }

      const result = await response.json();
      console.log('🔍 UserBookingService: Response result:', result);
      
      // Check if result exists and has proper structure
      if (!result) {
        console.warn('🔍 UserBookingService: No result object');
        return [];
      }

      // Check if result.bookings exists and is an array
      if (!result.bookings) {
        console.warn('🔍 UserBookingService: No bookings property in result');
        return [];
      }

      if (!Array.isArray(result.bookings)) {
        console.warn('🔍 UserBookingService: bookings is not an array:', typeof result.bookings);
        return [];
      }

      console.log('🔍 UserBookingService: Found', result.bookings.length, 'bookings');
      
      // Transform backend booking data to frontend RentalData format
      const transformedBookings = result.bookings.map((booking: any, index: number) => {
        try {
          return this.transformBookingToRentalData(booking);
        } catch (error) {
          console.error('🔍 UserBookingService: Error transforming booking', index, error, booking);
          // Return a default rental data object for failed transformations
          return {
            id: booking?.id || `error-${index}`,
            userId: booking?.userId || 'guest',
            room: {
              id: 'unknown',
              roomNumber: 'Unknown',
              type: 'Standard',
              floor: 1,
              imagesGallery: [this.getRoomImage()],
              size: 'Unknown',
              facilities: [],
              description: 'Data tidak tersedia'
            },
            rentalStatus: 'PENDING' as any,
            rentalPeriod: {
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              durationType: 'MONTHLY' as any
            },
            documents: [],
            notes: 'Data tidak lengkap',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      });

      console.log('🔍 UserBookingService: Transformed', transformedBookings.length, 'bookings');
      return transformedBookings;
    } catch (error) {
      console.error('🔍 UserBookingService: Error fetching user bookings:', error);
      return [];
    }
  }

  // Transform backend booking data to frontend RentalData format
  private transformBookingToRentalData(booking: any): RentalData {
    // Validate booking object
    if (!booking || !booking.room || !booking.rentalPeriod) {
      throw new Error('Invalid booking data: missing required fields');
    }

    // Calculate rental status based on dates and booking status - simplified to 3 statuses
    const today = new Date();
    const startDate = new Date(booking.rentalPeriod.startDate);
    const endDate = new Date(booking.rentalPeriod.endDate);
    
    let rentalStatus: RentalStatus;
    if (booking.rentalStatus === 'PENDING' || booking.status === 'Pending') {
      rentalStatus = RentalStatus.PENDING;
    } else if (booking.rentalStatus === 'APPROVED' || booking.status === 'Approved') {
      rentalStatus = RentalStatus.SETUJUI;
    } else if (booking.rentalStatus === 'CANCEL' || booking.status === 'Cancel' || booking.rentalStatus === 'CANCELLED') {
      rentalStatus = RentalStatus.CANCEL;
    } else {
      // Default to PENDING for any unknown status
      rentalStatus = RentalStatus.PENDING;
    }

    // Determine duration type from booking data or calculate from period
    let durationType: RentalDuration;
    if (booking.durationType) {
      switch (booking.durationType) {
        case 'weekly':
          durationType = RentalDuration.WEEKLY;
          break;
        case 'semester':
          durationType = RentalDuration.SEMESTER;
          break;
        case 'yearly':
          durationType = RentalDuration.YEARLY;
          break;
        default:
          durationType = RentalDuration.MONTHLY;
      }
    } else {
      // Calculate from date difference
      const diffMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (diffMonths < 1) {
        durationType = RentalDuration.WEEKLY;
      } else if (diffMonths <= 1) {
        durationType = RentalDuration.MONTHLY;
      } else if (diffMonths <= 6) {
        durationType = RentalDuration.SEMESTER;
      } else {
        durationType = RentalDuration.YEARLY;
      }
    }

    return {
      id: booking.id || 'unknown',
      userId: booking.userId || 'guest',
      room: {
        id: booking.room?.id || 'unknown',
        roomNumber: booking.room?.roomNumber || 'Unknown',
        type: booking.room?.type || 'Standard',
        floor: booking.room?.floor || 1,
        imagesGallery: booking.room?.imagesGallery || [this.getRoomImage(booking.room?.type)],
        size: booking.room?.size || 'Unknown',
        facilities: booking.room?.facilities || [],
        description: booking.room?.description || 'Kamar nyaman dengan fasilitas lengkap'
      },
      rentalStatus,
      rentalPeriod: {
        startDate: booking.rentalPeriod?.startDate || new Date().toISOString().split('T')[0],
        endDate: booking.rentalPeriod?.endDate || new Date().toISOString().split('T')[0],
        durationType
      },
      documents: booking.documents || [], // Will be populated if needed
      notes: booking.notes || '',
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: booking.updatedAt || new Date().toISOString()
    };
  }

  // Extract floor number from room name (e.g., "Kamar A1" -> 1, "Kamar B2" -> 2)
  private extractFloorFromRoomName(roomName: string): number {
    const match = roomName.match(/[A-Z](\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  // Get specific booking details
  async getBookingDetails(bookingId: string): Promise<RentalData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const result = await response.json();
      
      // Check if result.booking exists
      if (!result.booking) {
        console.warn('No booking found in response:', result);
        return null;
      }
      
      return this.transformBookingToRentalData(result.booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      return null;
    }
  }

  // Create a new booking
  async createBooking(bookingData: any): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create booking');
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
}

export const userBookingService = new UserBookingService();
