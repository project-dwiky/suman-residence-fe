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

export interface BookingDocument {
  id: string;
  type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Booking {
  id: string;
  userId: string;
  rentalStatus: 'PENDING' | 'APPROVED' | 'CANCEL';
  room: {
    id: string;
    roomNumber: string;
    type: string;
    size: string;
    facilities: string[];
    imagesGallery: string[];
  };
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    durationType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
  };
  pricing?: {
    amount: number;
    currency: string;
    paidAmount?: number;
  };
  documents: BookingDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Simple actions for document sending via WhatsApp
export interface BookingAction {
  type: 'send_booking_slip' | 'send_receipt_sop' | 'send_invoice' | 'send_whatsapp' | 'approve' | 'reject' | 'cancel' | 'reactivate';
  roomId?: string;
}
