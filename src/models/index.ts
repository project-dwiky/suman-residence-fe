export interface Room {
  id: string;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Premium';
  price: number; // legacy field for backward compatibility
  pricing: {
    weekly: number;
    monthly: number;
    semester: number; // 6 months
    yearly: number;
  };
  status: 'Available' | 'Booked' | 'Maintenance';
  description: string;
  facilities: string[];
  images: string[];
  maxOccupancy: number;
  size: number; // in sqm
  floor?: number;
  // Remove currentBooking since multiple bookings are allowed
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  identityNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDocument {
  id: string;
  type: 'BOOKING_SLIP' | 'RECEIPT' | 'SOP' | 'INVOICE';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string; // admin user ID
}

export interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  checkIn: Date;
  checkOut: Date;
  duration: number; // in periods (weeks/months/etc)
  durationType: 'weekly' | 'monthly' | 'semester' | 'yearly';
  status: 'Pending' | 'Setujui' | 'Cancel';
  // Pending: Initial booking request
  // Setujui: Approved by admin
  // Cancel: Cancelled
  bookingDate: Date;
  notes?: string;
  documents: BookingDocument[];
  createdAt: Date;
  updatedAt: Date;
  // Remove payment tracking fields - handled externally
}

export interface WhatsAppMessage {
  id: string;
  to: string; // phone number
  message: string;
  type: 'booking_request' | 'payment_reminder' | 'document_sent' | 'contract_reminder';
  status: 'Pending' | 'Sent' | 'Failed';
  bookingId?: string;
  tenantId?: string;
  sentAt?: Date;
  createdAt: Date;
}

export interface PropertyInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  images: string[];
  videos?: string[];
  rules: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    payment: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
