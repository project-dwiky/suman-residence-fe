import { Room, Tenant } from "./types";

// Mock data untuk demonstrasi
export const mockRooms: Room[] = [
  {
    id: "R001",
    name: "Kamar Deluxe A1",
    status: "Booked",
    type: "Deluxe",
    price: 2500000,
    tenant: {
      id: "T001",
      name: "Ahmad Ridwan",
      phone: "081234567890",
      email: "ahmad@email.com",
      checkIn: "2025-01-15",
      checkOut: "2025-07-15",
      remainingDays: 169,
      paymentStatus: "Paid",
      totalAmount: 15000000,
      paidAmount: 15000000,
    }
  },
  {
    id: "R002",
    name: "Kamar Standard B1",
    status: "Booked",
    type: "Standard",
    price: 1800000,
    tenant: {
      id: "T002",
      name: "Siti Nurhaliza",
      phone: "081234567891",
      email: "siti@email.com",
      checkIn: "2025-02-01",
      checkOut: "2025-08-01",
      remainingDays: 185,
      paymentStatus: "Not Paid",
      totalAmount: 10800000,
      paidAmount: 0,
    }
  },
  {
    id: "R003",
    name: "Kamar Deluxe A2",
    status: "Available",
    type: "Deluxe",
    price: 2500000,
  },
  {
    id: "R004",
    name: "Kamar Premium C1",
    status: "Booked",
    type: "Premium",
    price: 3200000,
    tenant: {
      id: "T003",
      name: "Budi Santoso",
      phone: "081234567892",
      email: "budi@email.com",
      checkIn: "2025-01-01",
      checkOut: "2025-06-01",
      remainingDays: 155,
      paymentStatus: "Partial",
      totalAmount: 16000000,
      paidAmount: 8000000,
    }
  },
  {
    id: "R005",
    name: "Kamar Standard B2",
    status: "Available",
    type: "Standard",
    price: 1800000,
  },
  {
    id: "R006",
    name: "Kamar Premium C2",
    status: "Available",
    type: "Premium",
    price: 3200000,
  },
  {
    id: "R007",
    name: "Kamar Deluxe A3",
    status: "Booked",
    type: "Deluxe",
    price: 2500000,
    tenant: {
      id: "T004",
      name: "Maya Sari",
      phone: "081234567893",
      email: "maya@email.com",
      checkIn: "2025-03-01",
      checkOut: "2025-09-01",
      remainingDays: 215,
      paymentStatus: "Not Paid",
      totalAmount: 15000000,
      paidAmount: 0,
    }
  },
  {
    id: "R008",
    name: "Kamar Standard B3",
    status: "Available",
    type: "Standard",
    price: 1800000,
  },
];

export const getAvailableRooms = () => mockRooms.filter(room => room.status === 'Available');
export const getBookedRooms = () => mockRooms.filter(room => room.status === 'Booked');
export const getRoomById = (id: string) => mockRooms.find(room => room.id === id);
export const getTenantsByPaymentStatus = (status: string) => 
  mockRooms.filter(room => room.tenant?.paymentStatus === status).map(room => room.tenant!);
