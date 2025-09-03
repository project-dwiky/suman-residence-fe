import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface BookingDocument {
  id: string;
  type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE' | 'BUKTI_TF';
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
  pricing?: {
    amount: number;
    currency: string;
    paidAmount?: number;
  };
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
      rentalStatus: 'PENDING',
      rentalPeriod: {
        ...bookingData.rentalPeriod,
        startDate: Timestamp.fromDate(new Date(bookingData.rentalPeriod.startDate)),
        endDate: Timestamp.fromDate(new Date(bookingData.rentalPeriod.endDate)),
      },
      documents: bookingData.documents?.map(doc => ({
        ...doc,
        createdAt: Timestamp.fromDate(new Date(doc.createdAt)),
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
        startDate: Timestamp.fromDate(new Date(updates.rentalPeriod.startDate)),
        endDate: Timestamp.fromDate(new Date(updates.rentalPeriod.endDate)),
      };
    }

    if (updates.documents) {
      updateData.documents = updates.documents.map(doc => ({
        ...doc,
        createdAt: Timestamp.fromDate(new Date(doc.createdAt)),
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
export async function getBookingsForNotification(testTrigger: boolean = false): Promise<{
  h1: Booking[];
  h7: Booking[];
  h15: Booking[];
  h30: Booking[];
}> {
  try {
    // Get all approved bookings
    const bookings = await getAllBookings();
    console.log(`Total bookings: ${bookings.length}`);
    const approvedBookings = bookings.filter(booking => booking.rentalStatus === 'APPROVED');
    
    // Use Indonesia timezone (WIB = UTC+7)
    const now = new Date();
    const result = {
      h1: [] as Booking[],
      h7: [] as Booking[],
      h15: [] as Booking[],
      h30: [] as Booking[]
    };
    
    for (const booking of approvedBookings) {
      // Parse endDate and set to end of day in Indonesia timezone
      const endDate = new Date(booking.rentalPeriod.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      
      const timeDiff = endDate.getTime() - now.getTime();
      // Use Math.floor for proper day calculation (kos-kosan business logic)
      const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // 🔍 DEBUG: Let's see what's happening
      console.log(`🔍 DEBUG Booking ${booking.id}:`, {
        endDate: endDate.toISOString(),
        now: now.toISOString(),
        timeDiff: timeDiff,
        daysRemaining: daysRemaining,
        durationType: booking.rentalPeriod.durationType,
        rentalStatus: booking.rentalStatus
      });
      
      // Skip if already expired or more than 30 days remaining
      if ((daysRemaining < 0 || daysRemaining > 30) && !testTrigger) {
        console.log(`⏭️  Skipping booking ${booking.id}: daysRemaining=${daysRemaining}`);
        continue;
      }
      
      // Business logic based on durationType (exact match to avoid duplicate notifications)
      switch (booking.rentalPeriod.durationType) {
        case 'WEEKLY':
          if (testTrigger) {
            console.log(`✅ Adding to H-1: ${booking.id}`);
            result.h1.push(booking);
            break;
          }
          

          // Mingguan = H-1 (notify exactly 1 day before)
          console.log(`📅 WEEKLY check: daysRemaining=${daysRemaining}, need exactly 1`);
          if (daysRemaining === 1) {
            console.log(`✅ Adding to H-1: ${booking.id}`);
            result.h1.push(booking);
          } else {
            console.log(`❌ Not H-1: daysRemaining=${daysRemaining}, need exactly 1`);
          }
          break;
          
        case 'MONTHLY':
          if (testTrigger) {
            console.log(`✅ Adding to H-7: ${booking.id}`);
            result.h7.push(booking);
            break;
          }

          // Bulanan = H-7 (notify exactly 7 days before)
          console.log(`📅 MONTHLY check: daysRemaining=${daysRemaining}, need exactly 7`);
          if (daysRemaining === 7) {
            console.log(`✅ Adding to H-7: ${booking.id}`);
            result.h7.push(booking);
          } else {
            console.log(`❌ Not H-7: daysRemaining=${daysRemaining}, need exactly 7`);
          }
          break;
          
        case 'SEMESTER':
          if (testTrigger) {
            console.log(`✅ Adding to H-15: ${booking.id}`);
            result.h15.push(booking);
            break;
          }

          // Semester = H-15 (notify exactly 15 days before)
          console.log(`📅 SEMESTER check: daysRemaining=${daysRemaining}, need exactly 15`);
          if (daysRemaining === 15) {
            console.log(`✅ Adding to H-15: ${booking.id}`);
            result.h15.push(booking);
          } else {
            console.log(`❌ Not H-15: daysRemaining=${daysRemaining}, need exactly 15`);
          }
          break;
          
        case 'YEARLY':
          if (testTrigger) {
            console.log(`✅ Adding to H-30: ${booking.id}`);
            result.h30.push(booking);
            break;
          }

          // Tahunan = H-30 (notify exactly 30 days before)
          console.log(`📅 YEARLY check: daysRemaining=${daysRemaining}, need exactly 30`);
          if (daysRemaining === 30) {
            console.log(`✅ Adding to H-30: ${booking.id}`);
            result.h30.push(booking);
          } else {
            console.log(`❌ Not H-30: daysRemaining=${daysRemaining}, need exactly 30`);
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
