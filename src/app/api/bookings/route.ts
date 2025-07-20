import { NextRequest, NextResponse } from 'next/server';
import { BookingRepository } from '@/repositories/booking.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { RoomRepository } from '@/repositories/room.repository';

const bookingRepository = new BookingRepository();
const tenantRepository = new TenantRepository();
const roomRepository = new RoomRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');
    const userId = searchParams.get('userId'); // Add userId support
    const withDetails = searchParams.get('withDetails') === 'true';

    let bookings;

    if (withDetails) {
      // Get bookings with populated room and tenant data
      bookings = await bookingRepository.getAllBookingsWithDetails();
      
      // Filter by status if provided
      if (status) {
        bookings = bookings.filter(booking => booking.status === status);
      }
      
      // Filter by tenant if provided
      if (tenantId) {
        bookings = bookings.filter(booking => booking.tenantId === tenantId);
      }

      // Filter by userId if provided (userId should match tenantId in this system)
      if (userId) {
        bookings = bookings.filter(booking => booking.tenantId === userId);
      }
    } else {
      // Get basic bookings
      if (status) {
        bookings = await bookingRepository.getBookingsByStatus(status as any);
      } else if (tenantId) {
        bookings = await bookingRepository.getBookingsByTenant(tenantId);
      } else if (userId) {
        // Handle userId filtering - use the dedicated function from backend
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        const response = await fetch(`${backendUrl}/api/bookings/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey'}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          bookings = result.bookings || [];
        } else {
          bookings = [];
        }
      } else {
        bookings = await bookingRepository.getAllBookings();
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
    
    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || result.message || 'Failed to create booking' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
