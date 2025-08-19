const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface CashflowEntry {
  id: string;
  content: string;
  harga: number;
  dibayar: number;
  sisa: number;
  status: "Income" | "Pending";
  tanggal1stPayment: string;
  tanggal2ndPayment: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  durationType: string;
  paymentStatus: "Not Paid" | "Partial" | "Paid";
}

export interface CashflowStats {
  totalIncome: number;
  pendingAmount: number;
  completedBookings: number;
  partialPayments: number;
}

export interface CashflowResponse {
  success: boolean;
  entries?: CashflowEntry[];
  stats?: CashflowStats;
  error?: string;
}

export class CashflowService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Get all cashflow data from approved bookings
  static async getCashflowData(): Promise<CashflowResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/cashflow`, {
        method: 'GET',
        headers: CashflowService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch cashflow data');
      }

      return {
        success: true,
        entries: result.entries || [],
        stats: result.stats || {
          totalIncome: 0,
          pendingAmount: 0,
          completedBookings: 0,
          partialPayments: 0
        }
      };
    } catch (error: any) {
      console.error('Error fetching cashflow data:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch cashflow data',
        entries: [],
        stats: {
          totalIncome: 0,
          pendingAmount: 0,
          completedBookings: 0,
          partialPayments: 0
        }
      };
    }
  }

  // Update payment status for a specific cashflow entry
  static async updatePaymentStatus(
    entryId: string, 
    paymentData: {
      dibayar: number;
      paymentStatus: "Not Paid" | "Partial" | "Paid";
      tanggal2ndPayment?: string;
    }
  ): Promise<CashflowResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/cashflow/${entryId}`, {
        method: 'PUT',
        headers: CashflowService.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update payment status');
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update payment status'
      };
    }
  }

  // Export cashflow data to CSV
  static exportToCsv(entries: CashflowEntry[]): void {
    const headers = [
      'ID',
      'Guest Name',
      'Price (IDR)',
      'Paid (IDR)', 
      'Remaining (IDR)',
      'Status',
      '1st Payment Date',
      '2nd Payment Date',
      'Room Number',
      'Room Type',
      'Check In',
      'Check Out',
      'Duration Type',
      'Payment Status'
    ];

    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.id,
        `"${entry.content}"`,
        entry.harga,
        entry.dibayar,
        entry.sisa,
        entry.status,
        entry.tanggal1stPayment,
        entry.tanggal2ndPayment,
        entry.roomNumber,
        entry.roomType,
        `"${entry.checkIn}"`,
        `"${entry.checkOut}"`,
        entry.durationType,
        entry.paymentStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cashflow-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Format currency for display
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format date for display
  static formatDate(dateString: string): string {
    if (!dateString || dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
