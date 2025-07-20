import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint allows manual triggering of the cron job for testing
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    console.log('🧪 Manual CRON trigger initiated...');

    // Call the actual cron endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/cron/reminders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Manual cron job trigger completed',
      cronResult: result,
      triggeredAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in manual cron trigger:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger cron job',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
