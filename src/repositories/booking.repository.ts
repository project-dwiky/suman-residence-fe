import { db } from '@/lib/firebase-admin';
import { Booking, Room, Tenant } from '@/models';
import * as admin from 'firebase-admin';

export interface BookingWithDetails extends Booking {
  room?: Room;
  tenant?: Tenant;
}

export class BookingRepository {
  private collectionName = 'bookings';

  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsRef = db.collection(this.collectionName);
      const snapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkIn: doc.data().checkIn?.toDate(),
        checkOut: doc.data().checkOut?.toDate(),
        bookingDate: doc.data().bookingDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        checkIn: data.checkIn?.toDate(),
        checkOut: data.checkOut?.toDate(),
        bookingDate: data.bookingDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking');
    }
  }

  async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    try {
      const bookingsRef = db.collection(this.collectionName);
      const snapshot = await bookingsRef
        .where('status', '==', status)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkIn: doc.data().checkIn?.toDate(),
        checkOut: doc.data().checkOut?.toDate(),
        bookingDate: doc.data().bookingDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw new Error('Failed to fetch bookings by status');
    }
  }

  async getBookingsByTenant(tenantId: string): Promise<Booking[]> {
    try {
      const bookingsRef = db.collection(this.collectionName);
      const snapshot = await bookingsRef
        .where('tenantId', '==', tenantId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkIn: doc.data().checkIn?.toDate(),
        checkOut: doc.data().checkOut?.toDate(),
        bookingDate: doc.data().bookingDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings by tenant:', error);
      throw new Error('Failed to fetch bookings by tenant');
    }
  }

  async getActiveBookingByRoom(roomId: string): Promise<Booking | null> {
    try {
      const bookingsRef = db.collection(this.collectionName);
      const snapshot = await bookingsRef
        .where('roomId', '==', roomId)
        .where('status', '==', 'Active')
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkIn: data.checkIn?.toDate(),
        checkOut: data.checkOut?.toDate(),
        bookingDate: data.bookingDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Booking;
    } catch (error) {
      console.error('Error fetching active booking by room:', error);
      throw new Error('Failed to fetch active booking by room');
    }
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = admin.firestore.Timestamp.now();
      const docRef = await db.collection(this.collectionName).add({
        ...bookingData,
        checkIn: admin.firestore.Timestamp.fromDate(bookingData.checkIn),
        checkOut: admin.firestore.Timestamp.fromDate(bookingData.checkOut),
        bookingDate: admin.firestore.Timestamp.fromDate(bookingData.bookingDate),
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      
      const updateData: any = {
        ...updates,
        updatedAt: admin.firestore.Timestamp.now()
      };

      // Convert dates to Timestamps if present
      if (updates.checkIn) {
        updateData.checkIn = admin.firestore.Timestamp.fromDate(updates.checkIn);
      }
      if (updates.checkOut) {
        updateData.checkOut = admin.firestore.Timestamp.fromDate(updates.checkOut);
      }
      if (updates.bookingDate) {
        updateData.bookingDate = admin.firestore.Timestamp.fromDate(updates.bookingDate);
      }

      await docRef.update(updateData);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      await docRef.update({
        status,
        updatedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      await docRef.update({
        paymentStatus,
        updatedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  async addDocument(id: string, documentType: keyof NonNullable<Booking['documents']>, filePath: string): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const booking = await this.getBookingById(id);
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      const updatedDocuments = {
        ...booking.documents,
        [documentType]: filePath
      };

      await docRef.update({
        documents: updatedDocuments,
        updatedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document');
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  }

  async getExpiringBookings(daysFromNow: number): Promise<Booking[]> {
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysFromNow);
      
      const bookingsRef = db.collection(this.collectionName);
      const snapshot = await bookingsRef
        .where('status', '==', 'Active')
        .where('checkOut', '<=', admin.firestore.Timestamp.fromDate(targetDate))
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkIn: doc.data().checkIn?.toDate(),
        checkOut: doc.data().checkOut?.toDate(),
        bookingDate: doc.data().bookingDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching expiring bookings:', error);
      throw new Error('Failed to fetch expiring bookings');
    }
  }

  async getAllBookingsWithDetails(): Promise<BookingWithDetails[]> {
    try {
      // Instead of using the frontend repository, we should call the backend API
      // This frontend repository was meant for mock data
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey'}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings from backend');
      }

      const result = await response.json();
      
      // Transform the backend booking data to frontend BookingWithDetails format
      const bookingsWithDetails: BookingWithDetails[] = result.bookings.map((booking: any) => {
        // Simple status mapping
        const statusMap: { [key: string]: string } = {
          'PENDING': 'Pending',
          'CONFIRMED': 'Confirmed', 
          'ACTIVE': 'Active',
          'CANCELLED': 'Cancelled',
          'EXPIRED': 'Completed'
        };

        return {
          id: booking.id,
          bookingDate: new Date(booking.createdAt),
          checkIn: new Date(booking.rentalPeriod.startDate),
          checkOut: new Date(booking.rentalPeriod.endDate),
          totalAmount: booking.room.totalPrice,
          status: statusMap[booking.rentalStatus] || 'Pending',
          roomId: booking.room.id,
          tenantId: booking.userId,
          // Room data is already embedded in booking
          room: {
            id: booking.room.id,
            name: booking.room.roomNumber,
            type: booking.room.type,
            price: booking.room.totalPrice,
            monthlyPrice: booking.room.totalPrice, // Add required field
            floor: booking.room.floor,
            size: booking.room.size,
            description: booking.room.description,
            facilities: booking.room.facilities,
            images: booking.room.imagesGallery,
            status: 'Available', // Add required field
            maxOccupancy: 1, // Add required field
            createdAt: new Date(),
            updatedAt: new Date()
          } as Room,
          // Contact info serves as tenant data
          tenant: {
            id: booking.userId,
            name: booking.contactInfo?.name || 'Unknown',
            email: booking.contactInfo?.email || '',
            phone: booking.contactInfo?.phone || '',
            whatsapp: booking.contactInfo?.whatsapp || booking.contactInfo?.phone || '',
            createdAt: new Date(),
            updatedAt: new Date()
          } as Tenant
        } as BookingWithDetails;
      });

      return bookingsWithDetails;
    } catch (error) {
      console.error('Error fetching bookings with details:', error);
      throw new Error('Failed to fetch bookings with details');
    }
  }
}
