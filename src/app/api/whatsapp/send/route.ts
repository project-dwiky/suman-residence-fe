import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/auth.service";
import whatsAppService from "@/services/whatsapp.service";
import { SendMessageRequest } from "@/types/whatsapp";
import { formatPhoneNumber } from "@/utils/format-phonenumber";

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
    
    // Only allow admin or staff to send WhatsApp messages
    if (user.role !== 'admin') {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'You do not have permission to send WhatsApp messages'
      }, { status: 403 });
    }
    
    // Parse request body
    let requestBody: SendMessageRequest;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }
    
    // Validate request body
    const { phoneNumber, message } = requestBody;
    if (!phoneNumber || !message) {
      return NextResponse.json({
        success: false,
        message: 'Phone number and message are required'
      }, { status: 400 });
    }
    
    // Send WhatsApp message
    const result = await whatsAppService.sendMessage(formatPhoneNumber(phoneNumber), message);
    
    // Return response from service
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500
    });
    
  } catch (error) {
    console.error('Error in WhatsApp send message API:', error);
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
