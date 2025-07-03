import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/auth.service";
import whatsAppService from "@/services/whatsapp.service";

export async function POST(request: NextRequest) {
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
    
    // Only allow admin to reset WhatsApp connection for security reasons
    if (user.role !== 'admin') {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Only administrators can reset WhatsApp connection'
      }, { status: 403 });
    }
    
    // Reset WhatsApp connection
    const result = await whatsAppService.resetConnection();
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp connection reset successfully. A new QR code will be generated.'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to reset WhatsApp connection'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in WhatsApp reset connection API:', error);
    return NextResponse.json({ 
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
