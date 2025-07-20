import { db } from '@/lib/firebase-admin';
import { Room } from '@/models';
import * as admin from 'firebase-admin';

export class RoomRepository {
  private collectionName = 'rooms';

  async getAllRooms(): Promise<Room[]> {
    try {
      const roomsRef = db.collection(this.collectionName);
      const snapshot = await roomsRef.orderBy('name').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        currentBooking: doc.data().currentBooking ? {
          ...doc.data().currentBooking,
          checkIn: doc.data().currentBooking.checkIn?.toDate(),
          checkOut: doc.data().currentBooking.checkOut?.toDate(),
        } : undefined
      })) as Room[];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error('Failed to fetch rooms');
    }
  }

  async getRoomById(id: string): Promise<Room | null> {
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
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        currentBooking: data.currentBooking ? {
          ...data.currentBooking,
          checkIn: data.currentBooking.checkIn?.toDate(),
          checkOut: data.currentBooking.checkOut?.toDate(),
        } : undefined
      } as Room;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw new Error('Failed to fetch room');
    }
  }

  async getAvailableRooms(checkIn?: Date, checkOut?: Date): Promise<Room[]> {
    try {
      const roomsRef = db.collection(this.collectionName);
      let queryRef = roomsRef.where('status', '==', 'Available');
      
      const snapshot = await queryRef.get();
      let rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        currentBooking: doc.data().currentBooking ? {
          ...doc.data().currentBooking,
          checkIn: doc.data().currentBooking.checkIn?.toDate(),
          checkOut: doc.data().currentBooking.checkOut?.toDate(),
        } : undefined
      })) as Room[];

      // Additional filtering for date availability if needed
      if (checkIn && checkOut) {
        rooms = rooms.filter(room => {
          if (!room.currentBooking) return true;
          
          // Check if the requested period overlaps with current booking
          const bookingStart = room.currentBooking.checkIn;
          const bookingEnd = room.currentBooking.checkOut;
          
          return checkOut <= bookingStart || checkIn >= bookingEnd;
        });
      }

      return rooms;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw new Error('Failed to fetch available rooms');
    }
  }

  async createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = admin.firestore.Timestamp.now();
      const docRef = await db.collection(this.collectionName).add({
        ...roomData,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Failed to create room');
    }
  }

  async updateRoom(id: string, updates: Partial<Omit<Room, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      await docRef.update({
        ...updates,
        updatedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating room:', error);
      throw new Error('Failed to update room');
    }
  }

  async updateRoomBooking(
    roomId: string, 
    bookingInfo: { bookingId: string; tenantId: string; checkIn: Date; checkOut: Date } | null
  ): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(roomId);
      
      if (bookingInfo) {
        await docRef.update({
          status: 'Booked',
          currentBooking: {
            ...bookingInfo,
            checkIn: admin.firestore.Timestamp.fromDate(bookingInfo.checkIn),
            checkOut: admin.firestore.Timestamp.fromDate(bookingInfo.checkOut)
          },
          updatedAt: admin.firestore.Timestamp.now()
        });
      } else {
        await docRef.update({
          status: 'Available',
          currentBooking: null,
          updatedAt: admin.firestore.Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating room booking:', error);
      throw new Error('Failed to update room booking');
    }
  }

  async deleteRoom(id: string): Promise<void> {
    try {
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      console.error('Error deleting room:', error);
      throw new Error('Failed to delete room');
    }
  }

  async getRoomsByStatus(status: Room['status']): Promise<Room[]> {
    try {
      const roomsRef = db.collection(this.collectionName);
      const snapshot = await roomsRef.where('status', '==', status).get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        currentBooking: doc.data().currentBooking ? {
          ...doc.data().currentBooking,
          checkIn: doc.data().currentBooking.checkIn?.toDate(),
          checkOut: doc.data().currentBooking.checkOut?.toDate(),
        } : undefined
      })) as Room[];
    } catch (error) {
      console.error('Error fetching rooms by status:', error);
      throw new Error('Failed to fetch rooms by status');
    }
  }
}

// Create repository instance
const roomRepository = new RoomRepository();

// Export individual functions for easier usage
export const getAllRooms = () => roomRepository.getAllRooms();
export const getRoomById = (id: string) => roomRepository.getRoomById(id);
export const getAvailableRooms = (checkIn?: Date, checkOut?: Date) => roomRepository.getAvailableRooms(checkIn, checkOut);
export const createRoom = (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => roomRepository.createRoom(roomData);
export const updateRoom = (id: string, updates: Partial<Omit<Room, 'id' | 'createdAt'>>) => roomRepository.updateRoom(id, updates);
export const updateRoomBooking = (roomId: string, bookingInfo: { bookingId: string; tenantId: string; checkIn: Date; checkOut: Date } | null) => roomRepository.updateRoomBooking(roomId, bookingInfo);
export const deleteRoom = (id: string) => roomRepository.deleteRoom(id);
export const getRoomsByStatus = (status: Room['status']) => roomRepository.getRoomsByStatus(status);

// Export the repository class as default
export default roomRepository;
