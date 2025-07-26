import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking } from '@/repositories/booking.repository';

// Handle booking actions (approve, reject, cancel)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action } = await request.json();
    const resolvedParams = await params;

    if (!['approve', 'reject', 'cancel'].includes(action)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid action. Must be approve, reject, or cancel' 
        },
        { status: 400 }
      );
    }

    // Get current booking
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

    // Map action to rentalStatus - only PENDING, APPROVED, CANCEL allowed
    let newRentalStatus: 'PENDING' | 'APPROVED' | 'CANCEL';
    
    switch (action) {
      case 'approve':
        newRentalStatus = 'APPROVED';
        break;
      case 'reject':
      case 'cancel':
        newRentalStatus = 'CANCEL';
        break;
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Only approve, reject, or cancel allowed.' 
          },
          { status: 400 }
        );
    }

    // Update booking in Firebase
    await updateBooking(resolvedParams.id, {
      rentalStatus: newRentalStatus,
      updatedAt: new Date()
    });

    // Fetch updated booking
    const updatedBooking = await getBookingById(resolvedParams.id);

    return NextResponse.json({ 
      success: true, 
      message: `Booking ${action}d successfully`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error processing booking action:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process booking action' 
      },
      { status: 500 }
    );
  }
}
