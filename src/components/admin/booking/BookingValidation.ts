import { Booking } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export class BookingValidation {
  // Validate required fields before approval
  static validateRequiredFields(booking: Booking): ValidationResult {
    const missingFields: string[] = [];
    
    // Check room number
    if (!booking.room.roomNumber || booking.room.roomNumber === 'Belum diset' || booking.room.roomNumber.trim() === '') {
      missingFields.push('Nomor Kamar');
    }
    
    // Check room type
    if (!booking.room.type || booking.room.type.trim() === '') {
      missingFields.push('Tipe Kamar');
    }
    
    // Check price
    if (!booking.pricing?.amount || booking.pricing.amount <= 0) {
      missingFields.push('Harga Sewa');
    }

    // Check paid amount
    if (!booking.pricing?.paidAmount || booking.pricing.paidAmount <= 0) {
      missingFields.push('Jumlah Bayar');
    }
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Field berikut harus diisi: ${missingFields.join(', ')}`
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  }

  // Validate required fields for document generation
  static validateDocumentGeneration(booking: Booking): ValidationResult {
    const missingFields: string[] = [];
    
    // Check guest name
    if (!booking.contactInfo?.name || booking.contactInfo.name.trim() === '') {
      missingFields.push('Nama Tamu');
    }
    
    // Check phone number
    if (!booking.contactInfo?.phone || booking.contactInfo.phone.trim() === '') {
      missingFields.push('Nomor Telepon');
    }
    
    // Check room number
    if (!booking.room.roomNumber || booking.room.roomNumber === 'Belum diset' || booking.room.roomNumber.trim() === '') {
      missingFields.push('Nomor Kamar');
    }
    
    // Check room type
    if (!booking.room.type || booking.room.type.trim() === '') {
      missingFields.push('Tipe Kamar');
    }
    
    // Check rental period
    if (!booking.rentalPeriod?.startDate) {
      missingFields.push('Tanggal Mulai');
    }
    
    if (!booking.rentalPeriod?.endDate) {
      missingFields.push('Tanggal Selesai');
    }
    
    // Check price
    if (!booking.pricing?.amount || booking.pricing.amount <= 0) {
      missingFields.push('Harga Sewa');
    }

    // Check paid amount
    if (!booking.pricing?.paidAmount || booking.pricing.paidAmount <= 0) {
      missingFields.push('Jumlah Bayar');
    }
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Data berikut harus dilengkapi untuk generate dokumen: ${missingFields.join(', ')}`
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  }

  // Check if specific field is missing for visual indicator
  static isFieldMissing(booking: Booking, field: 'roomNumber' | 'roomType' | 'price' | 'paidAmount'): boolean {
    switch (field) {
      case 'roomNumber':
        return !booking.room.roomNumber || booking.room.roomNumber === 'Belum diset' || booking.room.roomNumber.trim() === '';
      case 'roomType':
        return !booking.room.type || booking.room.type.trim() === '';
      case 'price':
        return !booking.pricing?.amount || booking.pricing.amount <= 0;
      case 'paidAmount':
        return !booking.pricing?.paidAmount || booking.pricing.paidAmount <= 0;
      default:
        return false;
    }
  }
}
