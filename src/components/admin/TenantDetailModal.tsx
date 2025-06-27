"use client";

import { Room, Tenant } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  MessageCircle,
  FileText,
  Download,
  Send
} from "lucide-react";

interface TenantDetailModalProps {
  tenant: Tenant | null;
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, roomId: string, tenantId: string) => void;
}

export function TenantDetailModal({
  tenant,
  room,
  isOpen,
  onClose,
  onAction
}: TenantDetailModalProps) {
  if (!isOpen || !tenant || !room) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Not Paid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detail Penyewa</h2>
              <p className="text-gray-600">{room.name}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Informasi Penyewa */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Informasi Penyewa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{tenant.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-medium">{tenant.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{tenant.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Sisa Hari</p>
                    <p className="font-medium">{tenant.remainingDays} hari</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Sewa */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Informasi Sewa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{formatDate(tenant.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{formatDate(tenant.checkOut)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Harga Kamar</p>
                  <p className="font-medium">{formatCurrency(room.price)}/bulan</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status Pembayaran</p>
                  <Badge className={getPaymentStatusColor(tenant.paymentStatus)}>
                    {tenant.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Informasi Pembayaran */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tagihan:</span>
                  <span className="font-medium">{formatCurrency(tenant.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sudah Dibayar:</span>
                  <span className="font-medium text-green-600">{formatCurrency(tenant.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Sisa Tagihan:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(tenant.totalAmount - tenant.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Aksi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tenant.paymentStatus === 'Not Paid' && (
                  <>
                    <Button 
                      onClick={() => onAction('approve', room.id, tenant.id)}
                      className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>ACC Booking</span>
                    </Button>
                    <Button 
                      onClick={() => onAction('send_invoice', room.id, tenant.id)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Kirim Invoice</span>
                    </Button>
                  </>
                )}

                {tenant.paymentStatus === 'Paid' && (
                  <>
                    <Button 
                      onClick={() => onAction('send_receipt', room.id, tenant.id)}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Kirim Receipt & SOP</span>
                    </Button>
                  </>
                )}

                {tenant.paymentStatus === 'Partial' && (
                  <Button 
                    onClick={() => onAction('send_invoice', room.id, tenant.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Kirim Tagihan Sisa</span>
                  </Button>
                )}

                <Button 
                  onClick={() => onAction('send_whatsapp', room.id, tenant.id)}
                  variant="outline"
                  className="flex items-center space-x-2 border-green-600 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Kirim ke WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
