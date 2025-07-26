export interface Room {
  id: string;
  name: string;
  status: 'Available' | 'Booked' | 'Maintenance';
  type: string;
  price: number;
  monthlyPrice: number;
  description: string;
  facilities: string[];
  images: string[];
  maxOccupancy: number;
  size: number;
  currentBooking?: {
    bookingId: string;
    checkIn: Date;
    checkOut: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Simple actions for document sending via WhatsApp
export interface BookingAction {
  type: 'send_booking_slip' | 'send_receipt_sop' | 'send_invoice' | 'send_whatsapp';
  roomId: string;
}
