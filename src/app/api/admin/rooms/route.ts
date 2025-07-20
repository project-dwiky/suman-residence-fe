import { NextRequest, NextResponse } from 'next/server';
import { createRoom, getAllRooms } from '@/repositories/room.repository';
import { getCurrentUser } from '@/services/auth/auth.service';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const rooms = await getAllRooms();
    
    return NextResponse.json({
      success: true,
      rooms: rooms
    });
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rooms',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const price = formData.get('price') as string;
    const monthlyPrice = formData.get('monthlyPrice') as string;
    const description = formData.get('description') as string;
    const maxOccupancy = formData.get('maxOccupancy') as string;
    const size = formData.get('size') as string;
    const facilitiesStr = formData.get('facilities') as string;
    
    // Parse facilities
    let facilities: string[] = [];
    try {
      facilities = JSON.parse(facilitiesStr || '[]');
    } catch (e) {
      facilities = [];
    }

    // Validate required fields
    if (!name || !monthlyPrice || !size) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, monthlyPrice, size'
      }, { status: 400 });
    }

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    if (imageFiles && imageFiles.length > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'rooms');
      
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      for (const file of imageFiles) {
        if (file && file.size > 0) {
          // Generate unique filename
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 15);
          const fileExtension = file.name.split('.').pop() || 'jpg';
          const fileName = `${timestamp}_${randomStr}.${fileExtension}`;
          
          // Save file
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filePath = join(uploadsDir, fileName);
          
          await writeFile(filePath, buffer);
          
          // Store relative URL
          imageUrls.push(`/uploads/rooms/${fileName}`);
        }
      }
    }

    // Prepare room data for Firestore
    const roomData = {
      name: name.trim(),
      status: 'Available' as const,
      type: (type || 'Standard') as 'Standard' | 'Deluxe' | 'Premium',
      price: parseInt(monthlyPrice), // For compatibility
      monthlyPrice: parseInt(monthlyPrice),
      description: description || '',
      facilities,
      images: imageUrls,
      maxOccupancy: parseInt(maxOccupancy) || 1,
      size: parseFloat(size)
    };

    // Create room in Firestore
    const roomId = await createRoom(roomData);
    
    return NextResponse.json({
      success: true,
      message: 'Room created successfully',
      roomId: roomId,
      room: { id: roomId, ...roomData }
    });

  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create room',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
