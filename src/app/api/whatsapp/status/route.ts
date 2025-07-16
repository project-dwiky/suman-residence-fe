import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/auth/auth.service";
import whatsAppService from "@/services/whatsapp.service";
import { WhatsAppStatus } from "@/types/whatsapp";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getCurrentUser(request);
    
    // If no user found, return unauthorized
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You are not logged in or your session has expired'
      }, { status: 401 });
    }
    
    // Only allow admin or staff to access WhatsApp API
    if (user.role !== 'admin') {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'You do not have permission to access WhatsApp features'
      }, { status: 403 });
    }
    
    // Get WhatsApp status from service
    const status: WhatsAppStatus = await whatsAppService.getStatus();
    
    // Return status
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('Error in WhatsApp status API:', error);
    return NextResponse.json({ 
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
