import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, getBookingById, Booking } from '@/repositories/booking.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');
    const userId = searchParams.get('userId'); // Add userId support
    const withDetails = searchParams.get('withDetails') === 'true';

    let bookings;

    if (withDetails) {
      // Get bookings with populated room and tenant data - for now just get all bookings
      bookings = await getAllBookings();
      
      // Filter by status if provided
      if (status) {
        bookings = bookings.filter((booking: Booking) => booking.rentalStatus === status);
      }
      
      // Filter by tenant if provided
      if (tenantId) {
        bookings = bookings.filter((booking: Booking) => booking.userId === tenantId);
      }

      // Filter by userId if provided (userId should match tenantId in this system)
      if (userId) {
        bookings = bookings.filter((booking: Booking) => booking.userId === userId);
      }
    } else {
      // Get basic bookings
      if (status) {
        const allBookings = await getAllBookings();
        bookings = allBookings.filter((booking: Booking) => booking.rentalStatus === status);
      } else if (tenantId) {
        const allBookings = await getAllBookings();
        bookings = allBookings.filter((booking: Booking) => booking.userId === tenantId);
      } else if (userId) {
        // Filter bookings by userId (using local repository)
        const allBookings = await getAllBookings();
        bookings = allBookings.filter((booking: Booking) => booking.userId === userId);
      } else {
        bookings = await getAllBookings();
      }
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Creating new booking:', body);
    
    // Import the booking repository to create booking directly in Firebase
    const { createBooking, getBookingById } = await import('@/repositories/booking.repository');
    
    // Create booking directly in Firebase
    const bookingId = await createBooking(body);

    console.log('✅ Booking created successfully with ID:', bookingId);

    // Get the full booking object to return
    const newBooking = await getBookingById(bookingId);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      bookingId: bookingId,
      message: 'Booking created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create booking',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
