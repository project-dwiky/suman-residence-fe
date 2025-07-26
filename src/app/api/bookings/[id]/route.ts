import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '@/repositories/booking.repository';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    console.log(`🔍 Fetching booking details for ID: ${id}`);
    
    // Get booking by ID
    const booking = await getBookingById(id);
    
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    console.log(`✅ Found booking: ${booking.id}`);

    return NextResponse.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('❌ Error fetching booking by ID:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch booking details'
    }, { status: 500 });
  }
}
