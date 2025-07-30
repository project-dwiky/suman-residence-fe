import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/cron/status`, {
      headers: {
        'x-api-key': process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cron status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cron status',
        message: 'Backend connection failed - make sure backend server is running'
      },
      { status: 500 }
    );
  }
}
