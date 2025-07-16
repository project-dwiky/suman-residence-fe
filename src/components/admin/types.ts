export interface Room {
  id: string;
  name: string;
  status: 'Available' | 'Booked';
  type: string;
  price: number;
  tenant?: Tenant;
}

// Simplified tenant interface - only essential info for manual system
export interface Tenant {
  id: string;
  name: string;
  phone: string;
  checkOut: string;
  remainingDays: number;
}

// Simple actions for document sending via WhatsApp
export interface BookingAction {
  type: 'send_booking_slip' | 'send_receipt_sop' | 'send_invoice' | 'send_whatsapp';
  roomId: string;
  tenantId?: string;
}
