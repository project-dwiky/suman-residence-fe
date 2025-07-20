import { NextRequest, NextResponse } from 'next/server';

// This endpoint has been disabled to prevent mock data creation
// All data should come from real Firebase sources only

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Seed endpoint disabled - Use real Firebase data only',
    message: 'This endpoint has been disabled to ensure only real data is used'
  }, { status: 405 });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Seed endpoint disabled - Use real Firebase data only',
    message: 'This endpoint has been disabled to ensure only real data is used'
  }, { status: 405 });
}
