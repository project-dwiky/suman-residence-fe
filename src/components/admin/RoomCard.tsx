"use client";

import { Room, Booking } from "@/models";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, MessageCircle, Home, Clock } from "lucide-react";

interface RoomCardProps {
  room: Room;
  activeBooking?: Booking | null; // Optional active booking data
  onAction: (action: string, roomId: string) => void;
}

export function RoomCard({ room, activeBooking, onAction }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRemainingDays = (checkOut: Date) => {
    const today = new Date();
    const diffTime = checkOut.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPricingDisplay = () => {
    if (!room.pricing) {
      return formatCurrency(room.price || 0) + '/bulan';
    }
    
    const { weekly, monthly, semester, yearly } = room.pricing;
    
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-blue-600">
          {formatCurrency(monthly)}/bulan
        </div>
        <div className="text-xs text-gray-500 space-y-0.5">
          <div>Mingguan: {formatCurrency(weekly)}</div>
          <div>Semester: {formatCurrency(semester)}</div>
          <div>Tahunan: {formatCurrency(yearly)}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-600">{room.type}</p>
          {getPricingDisplay()}
        </div>
        <Badge className={getStatusColor(room.status)}>
          {room.status}
        </Badge>
      </div>

      {/* Room Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {room.size}m² • Max {room.maxOccupancy} orang
          </span>
        </div>
        {room.facilities && room.facilities.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Fasilitas: </span>
            {room.facilities.slice(0, 3).join(', ')}
            {room.facilities.length > 3 && ` +${room.facilities.length - 3} lainnya`}
          </div>
        )}
      </div>

      {activeBooking && (
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <span className="text-sm font-medium block">Booking ID: {activeBooking.id}</span>
              <span className="text-xs text-gray-500 block">
                Email: Data dari booking system
              </span>
              <span className="text-xs text-gray-500 block">
                WhatsApp: Data dari booking system
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Berakhir: {formatDate(activeBooking.checkOut)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Sisa: {getRemainingDays(activeBooking.checkOut)} hari
            </span>
          </div>

          {/* Action Buttons for Booked Rooms */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction('send_booking_slip', room.id)}
                className="text-xs w-full"
              >
                📄 Booking Slip
              </Button>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded-full">
                🔨
              </span>
            </div>
            
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction('send_receipt_sop', room.id)}
                className="text-xs w-full"
              >
                🧾 Receipt & SOP
              </Button>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded-full">
                🔨
              </span>
            </div>
            
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction('send_invoice', room.id)}
                className="text-xs w-full"
              >
                💰 Invoice
              </Button>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded-full">
                🔨
              </span>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction('send_whatsapp', room.id)}
              className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
      )}

      {room.status === 'Available' && (
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">Kamar tersedia untuk disewa</p>
        </div>
      )}

      {room.status === 'Maintenance' && (
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-orange-600">Kamar sedang dalam perawatan</p>
        </div>
      )}
    </Card>
  );
}
