"use client";

import { Room } from "./types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, MessageCircle } from "lucide-react";

interface RoomCardProps {
  room: Room;
  onAction: (action: string, roomId: string, tenantId?: string) => void;
}

export function RoomCard({ room, onAction }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-600">{room.type}</p>
          <p className="text-sm font-medium text-blue-600">{formatCurrency(room.price)}/bulan</p>
        </div>
        <Badge className={getStatusColor(room.status)}>
          {room.status}
        </Badge>
      </div>

      {room.tenant && (
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{room.tenant.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{room.tenant.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Berakhir: {formatDate(room.tenant.checkOut)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sisa: {room.tenant.remainingDays} hari</span>
          </div>

          {/* Simplified action buttons - only for document sending */}
          <div className="flex flex-col space-y-2 pt-3 border-t">
            <Button 
              onClick={() => onAction('send_booking_slip', room.id, room.tenant?.id)}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              Kirim Booking Slip
            </Button>
            <Button 
              onClick={() => onAction('send_receipt_sop', room.id, room.tenant?.id)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Kirim Receipt & SOP
            </Button>
            <Button 
              onClick={() => onAction('send_invoice', room.id, room.tenant?.id)}
              className="w-full bg-red-600 hover:bg-red-700"
              size="sm"
            >
              Kirim Invoice
            </Button>
            <Button 
              onClick={() => onAction('send_whatsapp', room.id, room.tenant?.id)}
              variant="outline"
              className="w-full flex items-center space-x-2"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WhatsApp</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
