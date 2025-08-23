"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Plus, Edit } from "lucide-react";
import { FixedCost, FixedCostService } from "@/services/fixed-cost.service";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";

interface FixedCostModalProps {
  fixedCost?: FixedCost | null; // For editing existing cost
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function FixedCostModal({ fixedCost, isOpen, onClose, onSave }: FixedCostModalProps) {
  const [formData, setFormData] = useState({
    status: 'Pending' as 'Paid' | 'Pending' | 'Overdue',
    caption: '',
    harga: 0,
    tanggal: new Date().toISOString().split('T')[0] // Today's date
  });
  const [receiptFile, setReceiptFile] = useState<{
    url: string;
    fileName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!fixedCost;

  useEffect(() => {
    if (fixedCost) {
      // Editing existing fixed cost
      setFormData({
        status: fixedCost.status,
        caption: fixedCost.caption,
        harga: fixedCost.harga,
        tanggal: fixedCost.tanggal
      });
      // Set receipt file if exists
      if (fixedCost.receiptFile) {
        setReceiptFile({
          url: fixedCost.receiptFile.url,
          fileName: fixedCost.receiptFile.fileName
        });
      }
    } else {
      // Creating new fixed cost
      setFormData({
        status: 'Pending',
        caption: '',
        harga: 0,
        tanggal: new Date().toISOString().split('T')[0]
      });
      setReceiptFile(null);
    }
  }, [fixedCost]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'harga' ? Number(value) : value
    }));
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal upload file ke storage');
      }

      const uploadResult = await response.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload gagal');
      }

      setReceiptFile({
        url: uploadResult.url,
        fileName: file.name
      });

      return { success: true, url: uploadResult.url };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message || 'Gagal upload file' };
    }
  };

  const handleFileRemove = () => {
    setReceiptFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.caption.trim()) {
      toast.error('Description is required');
      return;
    }

    if (formData.harga <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (!formData.tanggal) {
      toast.error('Date is required');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data with receipt file
      const submitData = {
        ...formData,
        receiptFile: receiptFile ? {
          url: receiptFile.url,
          fileName: receiptFile.fileName
        } : undefined
      };
      
      let result;
      if (isEditing && fixedCost) {
        // Update existing fixed cost
        result = await FixedCostService.updateFixedCost(fixedCost.id, submitData);
      } else {
        // Create new fixed cost
        result = await FixedCostService.createFixedCost(submitData);
      }

      if (result.success) {
        toast.success(result.message || `Fixed cost ${isEditing ? 'updated' : 'created'} successfully`);
        onSave();
        onClose();
      } else {
        toast.error(result.error || `Failed to ${isEditing ? 'update' : 'create'} fixed cost`);
      }
    } catch (error) {
      console.error('Error saving fixed cost:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} fixed cost`);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl flex items-center">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 mr-2" />
                Edit Fixed Cost
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add Fixed Cost
              </>
            )}
          </CardTitle>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <Label htmlFor="caption">Description *</Label>
              <Input
                id="caption"
                type="text"
                value={formData.caption}
                onChange={(e) => handleInputChange('caption', e.target.value)}
                placeholder="e.g., Token Listrik, Air PDAM, WiFi, etc."
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                Enter a description for this expense
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="harga">Amount *</Label>
              <Input
                id="harga"
                type="number"
                value={formData.harga}
                onChange={(e) => handleInputChange('harga', e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="1000"
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.harga)}
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="tanggal">Date *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                Date when this expense occurred or is due
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Payment Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2">
                {getStatusBadge(formData.status)}
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <FileUpload
                label="Proof of Payment Receipt (Optional)"
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                currentFileUrl={receiptFile?.url}
                currentFileName={receiptFile?.fileName}
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                maxSize={10}
                disabled={loading}
              />
              <div className="text-sm text-gray-500 mt-1">
                Upload receipt, invoice, or proof of payment for this expense
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium">{formData.caption || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(formData.harga)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formData.tanggal ? new Date(formData.tanggal).toLocaleDateString('id-ID') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div>{getStatusBadge(formData.status)}</div>
                </div>
                {receiptFile && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt:</span>
                    <span className="font-medium text-green-600">{receiptFile.fileName}</span>
                  </div>
                )}
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
                {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
