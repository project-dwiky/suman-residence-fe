import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForNotification } from '@/repositories/booking.repository';
import { getNotificationTemplate, getNotificationSummary } from '@/utils/booking-notification-template';
import whatsAppService from '@/services/whatsapp.service';

export async function POST(request: NextRequest) {
  try {
    // Verify x-api-key authentication
    const apiKey = request.headers.get('x-api-key');
    console.log(`here`);
    const expectedKey = process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development';
    
    if (!apiKey || apiKey !== expectedKey) {
      console.error('❌ Unauthorized cron booking request - invalid API key');
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - invalid API key'
      }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { timestamp, source } = body;

    // Log the cron booking execution
    console.log('🎯 Cron booking successfully triggered!');
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log(`📡 Source: ${source}`);
    
    // Get User-Agent to track which service called this
    const userAgent = request.headers.get('user-agent');
    console.log(`🔍 User-Agent: ${userAgent}`);

    // Log additional request details
    console.log(`🌐 Request from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);
    
    console.log('🔄 Starting booking notification process...');
    
    // Get bookings that need notification
    const notificationBookings = await getBookingsForNotification();
    
    console.log('📋 Notification bookings summary:');
    console.log(`  H-1: ${notificationBookings.h1.length} bookings`);
    console.log(`  H-7: ${notificationBookings.h7.length} bookings`);
    console.log(`  H-15: ${notificationBookings.h15.length} bookings`);
    console.log(`  H-30: ${notificationBookings.h30.length} bookings`);
    
    const processedNotifications = {
      h1: 0,
      h7: 0, 
      h15: 0,
      h30: 0,
      total: 0
    };
    
    // Process H-1 notifications (1 day before expiry)
    for (const booking of notificationBookings.h1) {
      try {
        const message = getNotificationTemplate('h1', booking);
        console.log(`📩 H-1 message for ${booking.contactInfo.name} (Room ${booking.room.roomNumber}):`);
        console.log(message);
        
        // Send WhatsApp message
        const sendResult = await whatsAppService.sendMessage(booking.contactInfo.whatsapp, message);
        if (sendResult.success) {
          console.log(`✅ H-1 message sent successfully to ${booking.contactInfo.whatsapp}`);
        } else {
          console.error(`❌ Failed to send H-1 message to ${booking.contactInfo.whatsapp}:`, sendResult.message);
        }
        
        processedNotifications.h1++;
        processedNotifications.total++;
      } catch (error) {
        console.error(`❌ Error processing H-1 notification for booking ${booking.id}:`, error);
      }
    }
    
    // Process H-7 notifications (7 days before expiry)
    for (const booking of notificationBookings.h7) {
      try {
        const message = getNotificationTemplate('h7', booking);
        console.log(`📩 H-7 message for ${booking.contactInfo.name} (Room ${booking.room.roomNumber}):`);
        console.log(message);
        
        // Send WhatsApp message
        const sendResult = await whatsAppService.sendMessage(booking.contactInfo.whatsapp, message);
        if (sendResult.success) {
          console.log(`✅ H-7 message sent successfully to ${booking.contactInfo.whatsapp}`);
        } else {
          console.error(`❌ Failed to send H-7 message to ${booking.contactInfo.whatsapp}:`, sendResult.message);
        }
        
        processedNotifications.h7++;
        processedNotifications.total++;
      } catch (error) {
        console.error(`❌ Error processing H-7 notification for booking ${booking.id}:`, error);
      }
    }
    
    // Process H-15 notifications (15 days before expiry)
    for (const booking of notificationBookings.h15) {
      try {
        const message = getNotificationTemplate('h15', booking);
        console.log(`📩 H-15 message for ${booking.contactInfo.name} (Room ${booking.room.roomNumber}):`);
        console.log(message);
        
        // Send WhatsApp message
        const sendResult = await whatsAppService.sendMessage(booking.contactInfo.whatsapp, message);
        if (sendResult.success) {
          console.log(`✅ H-15 message sent successfully to ${booking.contactInfo.whatsapp}`);
        } else {
          console.error(`❌ Failed to send H-15 message to ${booking.contactInfo.whatsapp}:`, sendResult.message);
        }
        
        processedNotifications.h15++;
        processedNotifications.total++;
      } catch (error) {
        console.error(`❌ Error processing H-15 notification for booking ${booking.id}:`, error);
      }
    }
    
    // Process H-30 notifications (30 days before expiry)
    for (const booking of notificationBookings.h30) {
      try {
        const message = getNotificationTemplate('h30', booking);
        console.log(`📩 H-30 message for ${booking.contactInfo.name} (Room ${booking.room.roomNumber}):`);
        console.log(message);
        
        // Send WhatsApp message
        const sendResult = await whatsAppService.sendMessage(booking.contactInfo.whatsapp, message);
        if (sendResult.success) {
          console.log(`✅ H-30 message sent successfully to ${booking.contactInfo.whatsapp}`);
        } else {
          console.error(`❌ Failed to send H-30 message to ${booking.contactInfo.whatsapp}:`, sendResult.message);
        }
        
        processedNotifications.h30++;
        processedNotifications.total++;
      } catch (error) {
        console.error(`❌ Error processing H-30 notification for booking ${booking.id}:`, error);
      }
    }
    
    console.log('✅ Cron booking notification process completed successfully');
    console.log(`📤 Total notifications processed: ${processedNotifications.total}`);
    console.log(getNotificationSummary('h1', notificationBookings.h1));
    console.log(getNotificationSummary('h7', notificationBookings.h7));
    console.log(getNotificationSummary('h15', notificationBookings.h15));
    console.log(getNotificationSummary('h30', notificationBookings.h30));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Cron booking notification process completed',
      timestamp: new Date().toISOString(),
      receivedData: {
        timestamp,
        source,
        userAgent
      },
      notificationsSummary: {
        h1: {
          count: processedNotifications.h1,
          description: 'H-1 (1 day before expiry)'
        },
        h7: {
          count: processedNotifications.h7,
          description: 'H-7 (7 days before expiry)'
        },
        h15: {
          count: processedNotifications.h15,
          description: 'H-15 (15 days before expiry)'
        },
        h30: {
          count: processedNotifications.h30,
          description: 'H-30 (30 days before expiry)'
        },
        total: processedNotifications.total
      },
      status: 'completed'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error in cron booking:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process cron booking',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


