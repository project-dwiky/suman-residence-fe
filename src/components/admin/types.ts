export interface Room {
  id: string;
  name: string;
  status: 'Available' | 'Booked';
  type: string;
  price: number;
  tenant?: Tenant;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  remainingDays: number;
  paymentStatus: 'Paid' | 'Not Paid' | 'Partial';
  totalAmount: number;
  paidAmount: number;
}

export interface BookingAction {
  type: 'approve' | 'reject' | 'send_invoice' | 'send_receipt' | 'send_whatsapp';
  roomId: string;
  tenantId?: string;
}
