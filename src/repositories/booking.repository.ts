import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface BookingDocument {
  id: string;
  type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE';
  fileName: string;
  fileUrl: string;
  createdAt: Date;
}

export interface BookingRoom {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  size: string;
  description: string;
  facilities: string[];
  imagesGallery: string[];
}

export interface BookingPeriod {
  startDate: Date;
  endDate: Date;
  durationType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
}

export interface Booking {
  id: string;
  userId: string;
  room: BookingRoom;
  rentalStatus: 'PENDING' | 'APPROVED' | 'CANCEL';
  rentalPeriod: BookingPeriod;
  documents: BookingDocument[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Contact info for manual booking
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
}

const bookingsCollection = db.collection('bookings');

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const snapshot = await bookingsCollection.orderBy('createdAt', 'desc').get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        rentalPeriod: {
          ...data.rentalPeriod,
          startDate: data.rentalPeriod?.startDate?.toDate() || new Date(),
          endDate: data.rentalPeriod?.endDate?.toDate() || new Date(),
        },
        documents: data.documents?.map((doc: any) => ({
          ...doc,
          createdAt: doc.createdAt?.toDate() || new Date(),
        })) || []
      } as Booking;
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const doc = await bookingsCollection.doc(bookingId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      rentalPeriod: {
        ...data.rentalPeriod,
        startDate: data.rentalPeriod?.startDate?.toDate() || new Date(),
        endDate: data.rentalPeriod?.endDate?.toDate() || new Date(),
      },
      documents: data.documents?.map((doc: any) => ({
        ...doc,
        createdAt: doc.createdAt?.toDate() || new Date(),
      })) || []
    } as Booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw new Error('Failed to fetch booking');
  }
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    const docRef = await bookingsCollection.add({
      ...bookingData,
      rentalPeriod: {
        ...bookingData.rentalPeriod,
        startDate: Timestamp.fromDate(bookingData.rentalPeriod.startDate),
        endDate: Timestamp.fromDate(bookingData.rentalPeriod.endDate),
      },
      documents: bookingData.documents?.map(doc => ({
        ...doc,
        createdAt: Timestamp.fromDate(doc.createdAt),
      })) || [],
      createdAt: now,
      updatedAt: now
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
}

export async function updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const docRef = bookingsCollection.doc(id);
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    // Convert dates to Timestamps if present
    if (updates.rentalPeriod) {
      updateData.rentalPeriod = {
        ...updates.rentalPeriod,
        startDate: Timestamp.fromDate(updates.rentalPeriod.startDate),
        endDate: Timestamp.fromDate(updates.rentalPeriod.endDate),
      };
    }

    if (updates.documents) {
      updateData.documents = updates.documents.map(doc => ({
        ...doc,
        createdAt: Timestamp.fromDate(doc.createdAt),
      }));
    }

    await docRef.update(updateData);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw new Error('Failed to update booking');
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    await bookingsCollection.doc(id).delete();
    console.log(`Booking ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

/**
 * Get bookings that need notification based on business logic:
 * - WEEKLY (Mingguan) = H-1 (1 day before expiry)
 * - MONTHLY (Bulanan) = H-7 (7 days before expiry)
 * - SEMESTER = H-15 (15 days before expiry) 
 * - YEARLY (Tahunan) = H-30 (30 days before expiry)
 */
export async function getBookingsForNotification(): Promise<{
  h1: Booking[];
  h7: Booking[];
  h15: Booking[];
  h30: Booking[];
}> {
  try {
    // Get all approved bookings
    const bookings = await getAllBookings();
    const approvedBookings = bookings.filter(booking => booking.rentalStatus === 'APPROVED');
    
    const now = new Date();
    const result = {
      h1: [] as Booking[],
      h7: [] as Booking[],
      h15: [] as Booking[],
      h30: [] as Booking[]
    };
    
    for (const booking of approvedBookings) {
      const endDate = new Date(booking.rentalPeriod.endDate);
      const timeDiff = endDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      // Skip if already expired or more than 30 days remaining
      if (daysRemaining < 0 || daysRemaining > 30) {
        continue;
      }
      
      // Business logic based on durationType
      switch (booking.rentalPeriod.durationType) {
        case 'WEEKLY':
          // Mingguan = H-1 (notify 1 day before)
          if (daysRemaining === 1) {
            result.h1.push(booking);
          }
          break;
          
        case 'MONTHLY':
          // Bulanan = H-7 (notify 7 days before)
          if (daysRemaining === 7) {
            result.h7.push(booking);
          }
          break;
          
        case 'SEMESTER':
          // Semester = H-15 (notify 15 days before)
          if (daysRemaining === 15) {
            result.h15.push(booking);
          }
          break;
          
        case 'YEARLY':
          // Tahunan = H-30 (notify 30 days before)
          if (daysRemaining === 30) {
            result.h30.push(booking);
          }
          break;
      }
    }
    
    console.log('📋 Bookings for notification:', {
      h1: result.h1.length,
      h7: result.h7.length, 
      h15: result.h15.length,
      h30: result.h30.length
    });
    
    return result;
    
  } catch (error) {
    console.error('Error getting bookings for notification:', error);
    throw error;
  }
}
