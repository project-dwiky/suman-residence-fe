import { NextRequest, NextResponse } from 'next/server';
import { BookingRepository } from '@/repositories/booking.repository';
import { RoomRepository } from '@/repositories/room.repository';

const bookingRepository = new BookingRepository();
const roomRepository = new RoomRepository();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const bookingId = params.id;

    if (!action || !['approve', 'reject', 'confirm'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: approve, reject, or confirm' },
        { status: 400 }
      );
    }

    // Get current booking
    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    let newStatus: string;
    let updateRoomStatus = false;

    switch (action) {
      case 'approve':
        if (booking.status !== 'Pending') {
          return NextResponse.json(
            { error: 'Only pending bookings can be approved' },
            { status: 400 }
          );
        }
        newStatus = 'Confirmed';
        break;

      case 'reject':
        if (booking.status !== 'Pending') {
          return NextResponse.json(
            { error: 'Only pending bookings can be rejected' },
            { status: 400 }
          );
        }
        newStatus = 'Cancelled';
        break;

      case 'confirm':
        if (booking.status !== 'Confirmed') {
          return NextResponse.json(
            { error: 'Only confirmed bookings can be activated' },
            { status: 400 }
          );
        }
        newStatus = 'Active';
        updateRoomStatus = true;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update booking status
    const updatedBooking = await bookingRepository.updateBooking(bookingId, {
      status: newStatus as any,
      updatedAt: new Date()
    });

    // Update room status if needed
    if (updateRoomStatus) {
      await roomRepository.updateRoom(booking.roomId, {
        status: 'Booked',
        currentBooking: {
          bookingId: bookingId,
          tenantId: booking.tenantId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut
        },
        updatedAt: new Date()
      });
    }

    // If rejecting, make sure room is available
    if (action === 'reject') {
      const room = await roomRepository.getRoomById(booking.roomId);
      if (room && room.currentBooking?.bookingId === bookingId) {
        await roomRepository.updateRoom(booking.roomId, {
          status: 'Available',
          currentBooking: undefined,
          updatedAt: new Date()
        });
      }
    }

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
