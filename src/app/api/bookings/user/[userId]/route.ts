import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, Booking } from '@/repositories/booking.repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching bookings for user: ${userId}`);

    // Get all bookings from Firebase and filter by userId
    const allBookings = await getAllBookings();
    const userBookings = allBookings.filter((booking: Booking) => booking.userId === userId);

    console.log(`✅ Found ${userBookings.length} bookings for user ${userId}`);
    
    return NextResponse.json({
      success: true,
      bookings: userBookings
    });
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch user bookings' 
      },
      { status: 500 }
    );
  }
}
