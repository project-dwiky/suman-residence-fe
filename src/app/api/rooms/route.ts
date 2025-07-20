import { NextRequest, NextResponse } from 'next/server';
import { RoomRepository } from '@/repositories/room.repository';

const roomRepository = new RoomRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    let rooms;

    if (status) {
      rooms = await roomRepository.getRoomsByStatus(status as any);
    } else if (checkIn && checkOut) {
      rooms = await roomRepository.getAvailableRooms(
        new Date(checkIn),
        new Date(checkOut)
      );
    } else {
      rooms = await roomRepository.getAllRooms();
    }

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const roomData = {
      name: body.name,
      type: body.type,
      price: body.price,
      monthlyPrice: body.monthlyPrice,
      status: body.status || 'Available',
      description: body.description || '',
      facilities: body.facilities || [],
      images: body.images || [],
      maxOccupancy: body.maxOccupancy || 1,
      size: body.size || 0
    };

    const roomId = await roomRepository.createRoom(roomData);

    return NextResponse.json({ 
      message: 'Room created successfully',
      roomId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
