import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking } from '@/repositories/booking.repository';

// Get specific booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const booking = await getBookingById(resolvedParams.id);

    if (!booking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      booking 
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch booking' 
      },
      { status: 500 }
    );
  }
}

// Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updateData = await request.json();
    const resolvedParams = await params;
    
    // Update booking in Firebase
    await updateBooking(resolvedParams.id, updateData);
    
    // Fetch updated booking to return
    const updatedBooking = await getBookingById(resolvedParams.id);
    
    if (!updatedBooking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found after update' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update booking' 
      },
      { status: 500 }
    );
  }
}

// Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Delete booking from Firebase
    await deleteBooking(resolvedParams.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete booking' 
      },
      { status: 500 }
    );
  }
}
