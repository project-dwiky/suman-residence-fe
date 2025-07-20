// Simple room fetcher - only gets room information, no status
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

export async function fetchRoomData(roomId: string): Promise<SimpleRoom | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error('Room not found');
    }
    
    const data = await response.json();
    const room = data.room;
    
    // Transform room data to simple format
    return {
      id: room.id,
      name: room.name,
      price: `Rp ${room.monthlyPrice?.toLocaleString('id-ID')}/bulan` || 'Hubungi Admin',
      description: room.description || 'Kamar nyaman dengan fasilitas lengkap',
      images: room.images && room.images.length > 0 ? room.images : ['/galeri/default.jpg'],
      amenities: room.facilities || ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Lemari'],
      size: room.size ? `${room.size}m²` : 'Standard',
      type: room.type,
      maxOccupancy: room.maxOccupancy,
      monthlyPrice: room.monthlyPrice,
      pricing: room.pricing || {
        weekly: room.monthlyPrice ? Math.round(room.monthlyPrice * 0.3) : 0,
        monthly: room.monthlyPrice || 0,
        semester: room.monthlyPrice ? Math.round(room.monthlyPrice * 5.5) : 0, // 6 months with discount
        yearly: room.monthlyPrice ? Math.round(room.monthlyPrice * 10) : 0 // 12 months with discount
      }
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function fetchAllRooms(): Promise<SimpleRoom[]> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    
    const data = await response.json();
    const rooms = data.rooms;
    
    // Transform rooms data to simple format
    return rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      price: `Rp ${room.monthlyPrice?.toLocaleString('id-ID')}/bulan` || 'Hubungi Admin',
      description: room.description || 'Kamar nyaman dengan fasilitas lengkap',
      images: room.images && room.images.length > 0 ? room.images : ['/galeri/default.jpg'],
      amenities: room.facilities || ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Lemari'],
      size: room.size ? `${room.size}m²` : 'Standard',
      type: room.type,
      maxOccupancy: room.maxOccupancy,
      monthlyPrice: room.monthlyPrice,
      pricing: room.pricing || {
        weekly: room.monthlyPrice ? Math.round(room.monthlyPrice * 0.3) : 0,
        monthly: room.monthlyPrice || 0,
        semester: room.monthlyPrice ? Math.round(room.monthlyPrice * 5.5) : 0, // 6 months with discount
        yearly: room.monthlyPrice ? Math.round(room.monthlyPrice * 10) : 0 // 12 months with discount
      }
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}


