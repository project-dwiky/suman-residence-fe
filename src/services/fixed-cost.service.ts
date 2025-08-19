const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface FixedCost {
  id: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  caption: string; // Description/title
  harga: number; // Amount
  tanggal: string; // Date (YYYY-MM-DD)
  createdAt: Date | string | any; // Can be Date, string, or Firestore Timestamp
  updatedAt: Date | string | any; // Can be Date, string, or Firestore Timestamp
}

export interface FixedCostResponse {
  success: boolean;
  fixedCosts?: FixedCost[];
  fixedCost?: FixedCost;
  message?: string;
  error?: string;
}

export interface FixedCostStats {
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  overdueExpenses: number;
  monthlyTotal: number;
}

export class FixedCostService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Get all fixed costs
  static async getAllFixedCosts(): Promise<FixedCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/fixed-costs`, {
        method: 'GET',
        headers: FixedCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch fixed costs');
      }

      return {
        success: true,
        fixedCosts: result.fixedCosts || []
      };
    } catch (error: any) {
      console.error('Error fetching fixed costs:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch fixed costs',
        fixedCosts: []
      };
    }
  }

  // Create new fixed cost
  static async createFixedCost(data: {
    status: 'Paid' | 'Pending' | 'Overdue';
    caption: string;
    harga: number;
    tanggal: string;
  }): Promise<FixedCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/fixed-costs`, {
        method: 'POST',
        headers: FixedCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create fixed cost');
      }

      return {
        success: true,
        fixedCost: result.fixedCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error creating fixed cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to create fixed cost'
      };
    }
  }

  // Update fixed cost
  static async updateFixedCost(
    id: string, 
    data: {
      status: 'Paid' | 'Pending' | 'Overdue';
      caption: string;
      harga: number;
      tanggal: string;
    }
  ): Promise<FixedCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/fixed-costs/${id}`, {
        method: 'PUT',
        headers: FixedCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update fixed cost');
      }

      return {
        success: true,
        fixedCost: result.fixedCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error updating fixed cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to update fixed cost'
      };
    }
  }

  // Delete fixed cost
  static async deleteFixedCost(id: string): Promise<FixedCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/fixed-costs/${id}`, {
        method: 'DELETE',
        headers: FixedCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete fixed cost');
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error deleting fixed cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete fixed cost'
      };
    }
  }

  // Calculate statistics
  static calculateStats(fixedCosts: FixedCost[]): FixedCostStats {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = fixedCosts.filter(cost => {
      const costDate = new Date(cost.tanggal);
      return costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
    });

    return {
      totalExpenses: fixedCosts.reduce((sum, cost) => sum + cost.harga, 0),
      paidExpenses: fixedCosts.filter(cost => cost.status === 'Paid').reduce((sum, cost) => sum + cost.harga, 0),
      pendingExpenses: fixedCosts.filter(cost => cost.status === 'Pending').reduce((sum, cost) => sum + cost.harga, 0),
      overdueExpenses: fixedCosts.filter(cost => cost.status === 'Overdue').reduce((sum, cost) => sum + cost.harga, 0),
      monthlyTotal: monthlyExpenses.reduce((sum, cost) => sum + cost.harga, 0)
    };
  }

  // Export fixed costs to CSV
  static exportToCsv(fixedCosts: FixedCost[]): void {
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
      ...fixedCosts.map(cost => [
        cost.id,
        cost.status,
        `"${cost.caption}"`,
        cost.harga,
        cost.tanggal,
        FixedCostService.formatDateForCsv(cost.createdAt),
        FixedCostService.formatDateForCsv(cost.updatedAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fixed-costs-${new Date().toISOString().split('T')[0]}.csv`);
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
