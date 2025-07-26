import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadakey';

export async function POST(request: NextRequest) {
  try {
    // Verify this is coming from an authorized source (Vercel Cron or your backend)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Running automated contract expiry reminders...');

    // Call the backend H-15 reminder system (simplified approach)
    const response = await fetch(`${BACKEND_URL}/api/cron/h15-reminders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BACKEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Reminder cron job completed:', result);
      
      return NextResponse.json({
        success: true,
        message: 'Reminder cron job completed successfully',
        processed: result.processed || 0,
        sent: result.sent || 0,
        errors: result.errors || 0,
        details: result.details || [],
        timestamp: new Date().toISOString()
      });
    } else {
      const error = await response.text();
      console.error('❌ Backend reminder check failed:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to process reminders',
          details: error
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Cron job failed',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow manual triggering of the cron job for testing
  return POST(request);
}
