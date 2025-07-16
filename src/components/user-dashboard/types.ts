/**
 * User Dashboard Types - Simplified for manual booking system
 */

// Room rental status enum - simplified
export enum RentalStatus {
  ACTIVE = 'ACTIVE',        // Sedang menyewa kamar
  EXPIRED = 'EXPIRED',      // Masa sewa habis
  PENDING = 'PENDING'       // Dalam pengajuan/proses
}

// Rental duration enum - simplified
export enum RentalDuration {
  MONTHLY = 'MONTHLY',     // Bulanan
  SEMESTER = 'SEMESTER',   // Semester
  YEARLY = 'YEARLY'        // Tahunan
}

// Document type enum - only essential documents per client requirement
export enum DocumentType {
  BOOKING_SLIP = 'BOOKING_SLIP',  // Booking slip (if DP paid)
  RECEIPT = 'RECEIPT',            // Receipt + SOP (if fully paid)
  SOP = 'SOP',                    // SOP document
  INVOICE = 'INVOICE',            // Invoice (if unpaid)
}

// Room information type - simplified
export interface Room {
  id: string;
  roomNumber: string;
  type: string;          // Tipe kamar (Standard, Premium, dll)
  floor: number;
  size: string;          // Ukuran kamar (contoh: "3x4 m")
  description: string;   // Deskripsi kamar
  totalPrice: number;    // Harga total untuk periode sewa
  facilities: string[];  // Fasilitas dalam kamar
  imagesGallery: string[]; // Array URL foto-foto kamar
}

// Document type - simplified
export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

// Rental period information - simplified
export interface RentalPeriod {
  startDate: string;     // Format ISO: YYYY-MM-DD
  endDate: string;       // Format ISO: YYYY-MM-DD
  durationType: RentalDuration; // Jenis durasi sewa
}

// Complete rental data - simplified (no complex payment tracking)
export interface RentalData {
  id: string;
  userId: string;
  room: Room;
  rentalStatus: RentalStatus;  // Status saat ini
  rentalPeriod: RentalPeriod;
  documents: Document[];       // Available documents
  notes?: string;             // Catatan tambahan jika ada
  createdAt: string;          // Tanggal booking dibuat
  updatedAt: string;          // Tanggal terakhir update data
}