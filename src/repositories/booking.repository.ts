import { db } from '@/lib/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

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
  durationType: 'MONTHLY' | 'SEMESTER' | 'YEARLY';
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
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
}
