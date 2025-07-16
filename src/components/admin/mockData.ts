import { Room, Tenant } from "./types";

// Simplified mock data - only essential information for manual booking system
export const mockRooms: Room[] = [
  {
    id: "R001",
    name: "Kamar A1",
    status: "Booked",
    type: "Standard",
    price: 2500000,
    tenant: {
      id: "T001",
      name: "Ahmad Ridwan",
      phone: "081234567890",
      checkOut: "2025-07-15",
      remainingDays: 169,
    }
  },
  {
    id: "R002", 
    name: "Kamar A2",
    status: "Available",
    type: "Standard",
    price: 2500000,
  },
  {
    id: "R003",
    name: "Kamar B1",
    status: "Booked",
    type: "Standard",
    price: 2500000,
    tenant: {
      id: "T002",
      name: "Siti Nurhaliza",
      phone: "081234567891",
      checkOut: "2025-08-01",
      remainingDays: 185,
    }
  },
  {
    id: "R004",
    name: "Kamar B2", 
    status: "Available",
    type: "Standard",
    price: 2500000,
  },
];

// Simplified helper functions
export const getAvailableRooms = () => mockRooms.filter(room => room.status === 'Available');
export const getBookedRooms = () => mockRooms.filter(room => room.status === 'Booked');
export const getRoomById = (id: string) => mockRooms.find(room => room.id === id);
