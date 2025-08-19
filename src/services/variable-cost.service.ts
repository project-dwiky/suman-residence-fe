const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface VariableCost {
  id: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  caption: string; // Description/title
  harga: number; // Amount
  tanggal: string; // Date (YYYY-MM-DD)
  createdAt: Date | string | any;
  updatedAt: Date | string | any;
}

export interface VariableCostResponse {
  success: boolean;
  variableCosts?: VariableCost[];
  variableCost?: VariableCost;
  message?: string;
  error?: string;
}

export interface VariableCostStats {
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  overdueExpenses: number;
  monthlyTotal: number;
}

export class VariableCostService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Get all variable costs
  static async getAllVariableCosts(): Promise<VariableCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/variable-costs`, {
        method: 'GET',
        headers: VariableCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch variable costs');
      }

      return {
        success: true,
        variableCosts: result.variableCosts || []
      };
    } catch (error: any) {
      console.error('Error fetching variable costs:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch variable costs',
        variableCosts: []
      };
    }
  }

  // Create new variable cost
  static async createVariableCost(data: {
    status: 'Paid' | 'Pending' | 'Overdue';
    caption: string;
    harga: number;
    tanggal: string;
  }): Promise<VariableCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/variable-costs`, {
        method: 'POST',
        headers: VariableCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create variable cost');
      }

      return {
        success: true,
        variableCost: result.variableCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error creating variable cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to create variable cost'
      };
    }
  }

  // Update variable cost
  static async updateVariableCost(
    id: string, 
    data: {
      status: 'Paid' | 'Pending' | 'Overdue';
      caption: string;
      harga: number;
      tanggal: string;
    }
  ): Promise<VariableCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/variable-costs/${id}`, {
        method: 'PUT',
        headers: VariableCostService.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update variable cost');
      }

      return {
        success: true,
        variableCost: result.variableCost,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error updating variable cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to update variable cost'
      };
    }
  }

  // Delete variable cost
  static async deleteVariableCost(id: string): Promise<VariableCostResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/variable-costs/${id}`, {
        method: 'DELETE',
        headers: VariableCostService.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete variable cost');
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error deleting variable cost:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete variable cost'
      };
    }
  }

  // Calculate statistics
  static calculateStats(variableCosts: VariableCost[]): VariableCostStats {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = variableCosts.filter(cost => {
      const costDate = new Date(cost.tanggal);
      return costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
    });

    return {
      totalExpenses: variableCosts.reduce((sum, cost) => sum + cost.harga, 0),
      paidExpenses: variableCosts.filter(cost => cost.status === 'Paid').reduce((sum, cost) => sum + cost.harga, 0),
      pendingExpenses: variableCosts.filter(cost => cost.status === 'Pending').reduce((sum, cost) => sum + cost.harga, 0),
      overdueExpenses: variableCosts.filter(cost => cost.status === 'Overdue').reduce((sum, cost) => sum + cost.harga, 0),
      monthlyTotal: monthlyExpenses.reduce((sum, cost) => sum + cost.harga, 0)
    };
  }

  // Export variable costs to CSV
  static exportToCsv(variableCosts: VariableCost[]): void {
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
      ...variableCosts.map(cost => [
        cost.id,
        cost.status,
        `"${cost.caption}"`,
        cost.harga,
        cost.tanggal,
        VariableCostService.formatDateForCsv(cost.createdAt),
        VariableCostService.formatDateForCsv(cost.updatedAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `variable-costs-${new Date().toISOString().split('T')[0]}.csv`);
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
