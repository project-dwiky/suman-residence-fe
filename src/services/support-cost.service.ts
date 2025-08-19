const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface SupportCost {
  id: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  caption: string; // Description/title
  harga: number; // Amount
  tanggal: string; // Date (YYYY-MM-DD)
  createdAt: Date | string | any;
  updatedAt: Date | string | any;
}

export interface SupportCostResponse {
  success: boolean;
  supportCosts?: SupportCost[];
  supportCost?: SupportCost;
  message?: string;
  error?: string;
}

export interface SupportCostStats {
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  overdueExpenses: number;
  monthlyTotal: number;
}

export class SupportCostService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Get all support costs
  static async getAllSupportCosts(): Promise<SupportCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/support-costs`, {
        method: 'GET',
        headers: SupportCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch support costs');
      }

      return {
        success: true,
        supportCosts: result.supportCosts || []
      };
    } catch (error: any) {
      console.error('Error fetching support costs:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch support costs',
        supportCosts: []
      };
    }
  }

  // Create new support cost
  static async createSupportCost(data: {
    status: 'Paid' | 'Pending' | 'Overdue';
    caption: string;
    harga: number;
    tanggal: string;
  }): Promise<SupportCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/support-costs`, {
        method: 'POST',
        headers: SupportCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create support cost');
      }

      return {
        success: true,
        supportCost: result.supportCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error creating support cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to create support cost'
      };
    }
  }

  // Update support cost
  static async updateSupportCost(
    id: string, 
    data: {
      status: 'Paid' | 'Pending' | 'Overdue';
      caption: string;
      harga: number;
      tanggal: string;
    }
  ): Promise<SupportCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/support-costs/${id}`, {
        method: 'PUT',
        headers: SupportCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update support cost');
      }

      return {
        success: true,
        supportCost: result.supportCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error updating support cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to update support cost'
      };
    }
  }

  // Delete support cost
  static async deleteSupportCost(id: string): Promise<SupportCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/support-costs/${id}`, {
        method: 'DELETE',
        headers: SupportCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete support cost');
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error deleting support cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete support cost'
      };
    }
  }

  // Calculate statistics
  static calculateStats(supportCosts: SupportCost[]): SupportCostStats {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = supportCosts.filter(cost => {
      const costDate = new Date(cost.tanggal);
      return costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
    });

    return {
      totalExpenses: supportCosts.reduce((sum, cost) => sum + cost.harga, 0),
      paidExpenses: supportCosts.filter(cost => cost.status === 'Paid').reduce((sum, cost) => sum + cost.harga, 0),
      pendingExpenses: supportCosts.filter(cost => cost.status === 'Pending').reduce((sum, cost) => sum + cost.harga, 0),
      overdueExpenses: supportCosts.filter(cost => cost.status === 'Overdue').reduce((sum, cost) => sum + cost.harga, 0),
      monthlyTotal: monthlyExpenses.reduce((sum, cost) => sum + cost.harga, 0)
    };
  }

  // Export support costs to CSV
  static exportToCsv(supportCosts: SupportCost[]): void {
    const headers = [
      'ID',
      'Status',
      'Description',
      'Amount (IDR)',
      'Date',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...supportCosts.map(cost => [
        cost.id,
        cost.status,
        `"${cost.caption}"`,
        cost.harga,
        cost.tanggal,
        SupportCostService.formatDateForCsv(cost.createdAt),
        SupportCostService.formatDateForCsv(cost.updatedAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `support-costs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Helper function to safely convert dates
  private static formatDateForCsv(date: Date | string | any): string {
    try {
      if (!date) return '';
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0];
      }
      // Handle Firestore Timestamp
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toISOString().split('T')[0];
      }
      return new Date(date).toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date for CSV:', error);
      return '';
    }
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
