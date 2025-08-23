import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking } from '@/repositories/booking.repository';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { 
      dibayar, 
      paymentStatus, 
      tanggal2ndPayment
    } = await request.json();
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    // Validate input
    if (typeof dibayar !== 'number' || dibayar < 0) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    if (!['Not Paid', 'Partial', 'Paid'].includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
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

    // Ensure booking is approved
    if (booking.rentalStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Can only update payment info for approved bookings' },
        { status: 400 }
      );
    }

    // Get current pricing information
    const currentPricing = (booking as any).pricing || {};
    const totalPrice = currentPricing.amount || 0;
    const remainingAmount = Math.max(0, totalPrice - dibayar);

    // Update booking with payment information using the new pricing.paidAmount field
    const updateData = {
      pricing: {
        ...currentPricing,
        paidAmount: dibayar
      },
      updatedAt: new Date()
    };

    await updateBooking(bookingId, updateData);

    // Get updated booking
    const updatedBooking = await getBookingById(bookingId);

    return NextResponse.json({
      success: true,
      message: 'Payment information updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating cashflow entry:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update payment information' 
      },
      { status: 500 }
    );
  }
}
