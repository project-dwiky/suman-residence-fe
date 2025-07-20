import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'IsaGantengBangetSoAmazing';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bookingId = formData.get('bookingId') as string;
    const documentType = formData.get('documentType') as string;

    if (!file || !bookingId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, bookingId, documentType' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('bookingId', bookingId);
    backendFormData.append('documentType', documentType);

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/admin/bookings/upload-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BACKEND_API_KEY}`
      },
      body: backendFormData
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to upload document to backend', details: error },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', message: error.message },
      { status: 500 }
    );
  }
}
