"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Calculator } from "lucide-react";
import { CashflowEntry, CashflowService } from "@/services/cashflow.service";
import { toast } from "sonner";

interface CashflowEditModalProps {
  entry: CashflowEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CashflowEditModal({ entry, isOpen, onClose, onSave }: CashflowEditModalProps) {
  const [formData, setFormData] = useState({
    dibayar: 0,
    paymentStatus: 'Not Paid' as 'Not Paid' | 'Partial' | 'Paid',
    tanggal2ndPayment: ''
  });
  const [loading, setLoading] = useState(false);
  const [calculatedSisa, setCalculatedSisa] = useState(0);

  useEffect(() => {
    if (entry) {
      setFormData({
        dibayar: entry.dibayar,
        paymentStatus: entry.paymentStatus,
        tanggal2ndPayment: entry.tanggal2ndPayment !== '-' ? entry.tanggal2ndPayment : ''
      });
    }
  }, [entry]);

  useEffect(() => {
    // Calculate remaining amount using entry's fixed price
    const totalPrice = entry?.harga || 0;
    const remaining = Math.max(0, totalPrice - formData.dibayar);
    setCalculatedSisa(remaining);
  }, [entry?.harga, formData.dibayar]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'dibayar' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    const totalPrice = entry?.harga || 0;

    // Validation
    if (totalPrice <= 0) {
      toast.error('Booking price is not set. Please set price in Booking Management first.');
      return;
    }

    if (formData.dibayar < 0) {
      toast.error('Jumlah dibayar tidak boleh negatif');
      return;
    }

    if (formData.dibayar > totalPrice) {
      toast.error('Jumlah dibayar tidak boleh melebihi harga total');
      return;
    }

    // Auto-determine payment status based on amount paid
    let paymentStatus = formData.paymentStatus;
    if (formData.dibayar === 0) {
      paymentStatus = 'Not Paid';
    } else if (formData.dibayar === totalPrice) {
      paymentStatus = 'Paid';
    } else if (formData.dibayar > 0 && formData.dibayar < totalPrice) {
      paymentStatus = 'Partial';
    }

    try {
      setLoading(true);
      const result = await CashflowService.updatePaymentStatus(entry.id, {
        dibayar: formData.dibayar,
        paymentStatus: paymentStatus,
        tanggal2ndPayment: formData.tanggal2ndPayment || undefined
      });

      if (result.success) {
        toast.success('Payment information updated successfully');
        onSave();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update payment information');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment information');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Lunas</Badge>;
      case "Partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Sebagian</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Belum Bayar</Badge>;
    }
  };

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Edit Cashflow Entry</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Guest Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Guest:</span>
                <div className="font-medium">{entry.content}</div>
              </div>
              <div>
                <span className="text-gray-600">Room:</span>
                <div className="font-medium">{entry.roomNumber} ({entry.roomType})</div>
              </div>
              <div>
                <span className="text-gray-600">Check-in:</span>
                <div className="font-medium">{entry.checkIn}</div>
              </div>
              <div>
                <span className="text-gray-600">Check-out:</span>
                <div className="font-medium">{entry.checkOut}</div>
              </div>
            </div>
          </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Total Price (Harga) - Read Only</Label>
                <div className="p-3 bg-gray-100 border rounded-md">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(entry?.harga || 0)}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="dibayar">Amount Paid (Dibayar) *</Label>
                <Input
                  id="dibayar"
                  type="number"
                  value={formData.dibayar}
                  onChange={(e) => handleInputChange('dibayar', e.target.value)}
                  placeholder="Enter amount paid"
                  min="0"
                  max={entry?.harga || 0}
                  step="1000"
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(formData.dibayar)}
                </div>
              </div>
            </div>

            {/* Calculated Remaining */}
            <div className="p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Remaining Amount:</span>
              </div>
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(calculatedSisa)}
              </div>
            </div>

            {/* Second Payment Date */}
            <div>
              <Label htmlFor="tanggal2ndPayment">Second Payment Date (Optional)</Label>
              <Input
                id="tanggal2ndPayment"
                type="date"
                value={formData.tanggal2ndPayment}
                onChange={(e) => handleInputChange('tanggal2ndPayment', e.target.value)}
              />
              <div className="text-sm text-gray-500 mt-1">
                Leave empty if not applicable
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
