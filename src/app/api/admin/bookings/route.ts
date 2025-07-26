import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/repositories/booking.repository';

export async function GET(request: NextRequest) {
  try {
    const bookings = await getAllBookings();

    return NextResponse.json({ 
      success: true, 
      bookings 
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bookings' 
      },
      { status: 500 }
    );
  }
}
