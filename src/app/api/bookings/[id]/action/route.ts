import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking } from '@/repositories/booking.repository';
import { RoomRepository } from '@/repositories/room.repository';

const roomRepository = new RoomRepository();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action } = await request.json();
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    if (!action || !['approve', 'reject', 'confirm'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: approve, reject, or confirm' },
        { status: 400 }
      );
    }

    // Get current booking
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    let newRentalStatus: 'PENDING' | 'APPROVED' | 'CANCEL';

    switch (action) {
      case 'approve':
        if (booking.rentalStatus !== 'PENDING') {
          return NextResponse.json(
            { error: 'Only pending bookings can be approved' },
            { status: 400 }
          );
        }
        newRentalStatus = 'APPROVED';
        break;

      case 'reject':
      case 'cancel':
        if (booking.rentalStatus !== 'PENDING') {
          return NextResponse.json(
            { error: 'Only pending bookings can be rejected or canceled' },
            { status: 400 }
          );
        }
        newRentalStatus = 'CANCEL';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Only approve, reject, or cancel allowed.' },
          { status: 400 }
        );
    }

    // Update booking status
    await updateBooking(bookingId, {
      rentalStatus: newRentalStatus,
      updatedAt: new Date()
    });

    // Get updated booking
    const updatedBooking = await getBookingById(bookingId);

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
