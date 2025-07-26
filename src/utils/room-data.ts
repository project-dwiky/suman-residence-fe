// Simple room fetcher - only gets room information, no status
import { RoomService } from '@/services/room.service';

export interface SimpleRoom {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  amenities: string[];
  size?: string;
  type?: string;
  maxOccupancy?: number;
  monthlyPrice?: number;
  pricing?: {
    weekly: number;
    monthly: number;
    semester: number;
    yearly: number;
  };
}

const roomService = new RoomService();

export async function fetchRoomData(roomId: string): Promise<SimpleRoom | null> {
  try {
    const result = await roomService.getRoomById(roomId);
    
    if (!result.success || !result.room) {
      throw new Error('Room not found');
    }
    
    const room = result.room;
    
    // Transform room data to simple format
    return {
      id: room.id,
      name: room.name,
      price: `Rp ${room.pricing.monthly?.toLocaleString('id-ID')}/bulan` || 'Hubungi Admin',
      description: room.description || 'Kamar nyaman dengan fasilitas lengkap',
      images: room.images && room.images.length > 0 ? room.images : ['/galeri/default.jpg'],
      amenities: room.facilities || ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Lemari'],
      size: room.size ? `${room.size}m²` : 'Standard',
      type: room.type,
      maxOccupancy: room.maxOccupancy,
      monthlyPrice: room.pricing.monthly,
      pricing: room.pricing
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function fetchAllRooms(): Promise<SimpleRoom[]> {
  try {
    const result = await roomService.getAllRooms();
    
    if (!result.success || !result.rooms) {
      throw new Error('Failed to fetch rooms');
    }
    
    const rooms = result.rooms;
    
    // Transform rooms data to simple format
    return rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      price: `Rp ${room.pricing.monthly?.toLocaleString('id-ID')}/bulan` || 'Hubungi Admin',
      description: room.description || 'Kamar nyaman dengan fasilitas lengkap',
      images: room.images && room.images.length > 0 ? room.images : ['/galeri/default.jpg'],
      amenities: room.facilities || ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Lemari'],
      size: room.size ? `${room.size}m²` : 'Standard',
      type: room.type,
      maxOccupancy: room.maxOccupancy,
      monthlyPrice: room.pricing.monthly,
      pricing: room.pricing
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}


