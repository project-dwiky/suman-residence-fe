/**
 * User Dashboard Types
 * Types for managing user dashboard data requirements
 */

// Room rental status enum
export enum RentalStatus {
  ACTIVE = 'ACTIVE',        // Sedang menyewa kamar
  EXPIRED = 'EXPIRED',      // Masa sewa habis
  NOT_RENEWED = 'NOT_RENEWED',  // Tidak melanjutkan sewa
  PENDING = 'PENDING'      // Dalam pengajuan/proses
}

// Rental duration enum
export enum RentalDuration {
  WEEKLY = 'WEEKLY',       // Mingguan
  MONTHLY = 'MONTHLY',     // Bulanan
  SEMESTER = 'SEMESTER',   // Semester
  YEARLY = 'YEARLY'        // Tahunan
}

// Payment status enum
export enum PaymentStatus {
  UNPAID = 'UNPAID',         // Belum dibayar
  PAID = 'PAID',           // Sudah dibayar/lunas
  PARTIALLY_PAID = 'PARTIALLY_PAID', // Dibayar sebagian
}

// Document type enum
export enum DocumentType {
  BOOKING_SLIP = 'BOOKING_SLIP',
  RECEIPT = 'RECEIPT',
  SOP = 'SOP',
  INVOICE = 'INVOICE',
}

// Room information type
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

// Document type
export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  expiresAt?: string;    // Opsional, jika dokumen memiliki masa berlaku
}

// Rental period information
export interface RentalPeriod {
  startDate: string;     // Format ISO: YYYY-MM-DD
  endDate: string;       // Format ISO: YYYY-MM-DD
  durationType: RentalDuration; // Jenis durasi sewa (Mingguan/Bulanan/Semester/Tahunan)
}

// Payment information - disederhanakan
export interface Payment {
  status: PaymentStatus;      // Status pembayaran (dibayar/belum)
  lastPaymentDate?: string;  // Tanggal pembayaran terakhir
  receiptUrl?: string;       // URL bukti pembayaran jika ada
}



// Complete rental data
export interface RentalData {
  id: string;
  userId: string;
  room: Room;
  rentalStatus: RentalStatus;  // Status saat ini
  rentalPeriod: RentalPeriod;
  payment: Payment;
  documents: Document[];
  notes?: string;        // Catatan tambahan jika ada
  createdAt: string;     // Tanggal booking dibuat
  updatedAt: string;     // Tanggal terakhir update data
}