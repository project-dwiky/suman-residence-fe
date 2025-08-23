import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/repositories/booking.repository';

export async function GET(request: NextRequest) {
  try {
    // Get all bookings from the repository
    const bookings = await getAllBookings();
    
    // Filter only approved bookings
    const approvedBookings = bookings.filter(booking => booking.rentalStatus === 'APPROVED');
    
    // Transform bookings into cashflow entries
    const entries = approvedBookings.map(booking => {
      // Get booking price and paid amount from pricing field
      const pricing = (booking as any).pricing;
      const actualPrice = pricing?.amount || 0;
      const paidAmount = pricing?.paidAmount || 0;
      
      let dibayar = paidAmount;
      let sisa = actualPrice - dibayar;
      
      // Determine payment status based on paid amount
      let paymentStatus: "Not Paid" | "Partial" | "Paid";
      if (dibayar === 0) {
        paymentStatus = 'Not Paid';
      } else if (dibayar >= actualPrice) {
        paymentStatus = 'Paid';
      } else {
        paymentStatus = 'Partial';
      }
      
      let status: "Income" | "Pending" = paymentStatus === 'Paid' ? "Income" : "Pending";

      return {
        id: booking.id,
        content: booking.contactInfo?.name || 'Unknown Guest',
        harga: actualPrice,
        dibayar: dibayar,
        sisa: sisa,
        status: status,
        tanggal1stPayment: booking.rentalPeriod?.startDate 
          ? new Date(booking.rentalPeriod.startDate).toISOString().split('T')[0]
          : '-',
        tanggal2ndPayment: '-', // Can be updated later if needed
        roomNumber: booking.room?.roomNumber || 'N/A',
        roomType: booking.room?.type || 'N/A',
        checkIn: booking.rentalPeriod?.startDate 
          ? new Date(booking.rentalPeriod.startDate).toLocaleDateString('id-ID')
          : 'N/A',
        checkOut: booking.rentalPeriod?.endDate 
          ? new Date(booking.rentalPeriod.endDate).toLocaleDateString('id-ID')
          : 'N/A',
        durationType: booking.rentalPeriod?.durationType || 'N/A',
        paymentStatus: paymentStatus
      };
    });

    // Calculate statistics
    const stats = {
      totalIncome: entries
        .filter(entry => entry.status === "Income")
        .reduce((sum, entry) => sum + entry.dibayar, 0),
      pendingAmount: entries
        .filter(entry => entry.status === "Pending")
        .reduce((sum, entry) => sum + entry.sisa, 0),
      completedBookings: entries.filter(entry => entry.status === "Income").length,
      partialPayments: entries.filter(entry => entry.paymentStatus === "Partial").length
    };

    return NextResponse.json({
      success: true,
      entries: entries,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching cashflow data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cashflow data',
        entries: [],
        stats: {
          totalIncome: 0,
          pendingAmount: 0,
          completedBookings: 0,
          partialPayments: 0
        }
      },
      { status: 500 }
    );
  }
}
