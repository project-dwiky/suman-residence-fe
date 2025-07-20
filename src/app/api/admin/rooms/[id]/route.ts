import { NextRequest, NextResponse } from 'next/server';
import { deleteRoom, getRoomById, updateRoom } from '@/repositories/room.repository';
import { getCurrentUser } from '@/services/auth/auth.service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if room exists
    const existingRoom = await getRoomById(id);
    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room is currently booked
    if (existingRoom.status === 'Booked') {
      return NextResponse.json(
        { error: 'Cannot delete room that is currently booked' },
        { status: 400 }
      );
    }

    // Delete the room
    await deleteRoom(id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Room deleted successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error deleting room:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Failed to delete room'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if room exists
    const existingRoom = await getRoomById(id);
    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Prepare update data (remove id, createdAt, updatedAt from updates)
    const { id: _, createdAt, updatedAt, ...updateData } = body;

    // Update the room
    await updateRoom(id, updateData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Room updated successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating room:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Failed to update room'
      },
      { status: 500 }
    );
  }
}
