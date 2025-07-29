import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking } from '@/repositories/booking.repository';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/services/auth/auth.service';


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from request
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, fileName, fileUrl } = await request.json();
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    // Validate required fields
    if (!type || !fileName || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: type, fileName, fileUrl' },
        { status: 400 }
      );
    }

    // Get existing booking
    const existingBooking = await getBookingById(bookingId);
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Create new document object with user info
    const newDocument = {
      id: uuidv4(),
      type,
      fileName,
      fileUrl,
      createdAt: new Date()
    };

    // Add document to existing documents array
    const currentDocuments = existingBooking.documents || [];
    const updatedDocuments = [...currentDocuments, newDocument];

    // Update booking with new document
    await updateBooking(bookingId, {
      documents: updatedDocuments,
      updatedAt: new Date()
    });

    // Get updated booking
    const updatedBooking = await getBookingById(bookingId);

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      booking: updatedBooking,
      document: newDocument
    });

  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json(
      { error: 'Failed to save document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}