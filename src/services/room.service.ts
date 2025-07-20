import { Room } from '@/models';

export class RoomService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    this.apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey';
  }

  // Get all rooms
  async getAllRooms(): Promise<{ success: boolean; rooms?: Room[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const result = await response.json();
      
      if (!result.rooms || !Array.isArray(result.rooms)) {
        return { success: false, error: 'Invalid response format' };
      }

      // Transform backend data to frontend format
      const transformedRooms = result.rooms.map((room: any) => this.transformRoomData(room));
      
      return { success: true, rooms: transformedRooms };
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return { success: false, error: 'Failed to fetch rooms' };
    }
  }

  // Get room by ID
  async getRoomById(id: string): Promise<{ success: boolean; room?: Room; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Room not found');
      }

      const result = await response.json();
      
      if (!result.room) {
        return { success: false, error: 'Room not found' };
      }

      const transformedRoom = this.transformRoomData(result.room);
      
      return { success: true, room: transformedRoom };
    } catch (error) {
      console.error('Error fetching room:', error);
      return { success: false, error: 'Failed to fetch room' };
    }
  }

  // Get available rooms for booking
  async getAvailableRooms(): Promise<{ success: boolean; rooms?: Room[]; error?: string }> {
    try {
      const result = await this.getAllRooms();
      
      if (!result.success || !result.rooms) {
        return result;
      }

      // Filter only available rooms
      const availableRooms = result.rooms.filter(room => room.status === 'Available');
      
      return { success: true, rooms: availableRooms };
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return { success: false, error: 'Failed to fetch available rooms' };
    }
  }

  // Transform backend room data to frontend format
  private transformRoomData(room: any): Room {
    // Calculate pricing if not provided
    const monthlyPrice = room.monthlyPrice || room.price || 0;
    const pricing = room.pricing || {
      weekly: Math.round(monthlyPrice * 0.3), // ~30% of monthly for weekly
      monthly: monthlyPrice,
      semester: Math.round(monthlyPrice * 5.5), // ~5.5 months for semester discount
      yearly: Math.round(monthlyPrice * 10.5) // ~10.5 months for yearly discount
    };

    return {
      id: room.id || 'unknown',
      name: room.name || 'Unknown Room',
      type: room.type || 'Standard',
      price: room.price || pricing.monthly, // legacy field
      pricing,
      status: room.status || 'Available',
      description: room.description || 'Kamar nyaman dengan fasilitas lengkap',
      facilities: Array.isArray(room.facilities) ? room.facilities : [],
      images: Array.isArray(room.images) ? room.images : ['/images/room-placeholder.jpg'],
      maxOccupancy: room.maxOccupancy || 1,
      size: room.size || 0,
      floor: room.floor || 1,
      createdAt: room.createdAt ? new Date(room.createdAt) : new Date(),
      updatedAt: room.updatedAt ? new Date(room.updatedAt) : new Date()
    };
  }
}

export const roomService = new RoomService();
