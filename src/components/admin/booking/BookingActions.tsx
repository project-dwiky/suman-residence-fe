"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  MessageCircle, 
  Edit2, 
  Trash2,
  Save,
  X,
  Plus
} from 'lucide-react';
import { Booking } from '../types';

interface BookingActionsProps {
  booking: Booking;
  isEditing: boolean;
  actionLoading: { [key: string]: boolean };
  onBookingAction: (bookingId: string, action: 'approve' | 'reject' | 'cancel' | 'reactivate') => void;
  onWhatsAppContact: (booking: Booking) => void;
  onStartEdit: (booking: Booking) => void;
  onSaveEdit: (bookingId: string) => void;
  onCancelEdit: () => void;
  onDeleteBooking: (bookingId: string) => void;
  onContinueBooking: (booking: Booking) => void;
}

const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  isEditing,
  actionLoading,
  onBookingAction,
  onWhatsAppContact,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteBooking,
  onContinueBooking
}) => {
  const getActionButtons = () => {
    const isLoading = actionLoading[booking.id];
    
    switch (booking.rentalStatus) {
      case 'PENDING':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => onBookingAction(booking.id, 'approve')}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Disetujui
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onBookingAction(booking.id, 'reject')}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Tolak
            </Button>
          </div>
        );
      
      case 'APPROVED':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContinueBooking(booking)}
              disabled={isLoading || actionLoading[`continue-${booking.id}`]}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              {actionLoading[`continue-${booking.id}`] ? 'Memproses...' : 'Lanjutkan'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onBookingAction(booking.id, 'cancel')}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Batalkan
            </Button>
          </div>
        );
        
      case 'CANCEL':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBookingAction(booking.id, 'reactivate')}
              disabled={isLoading}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reaktivasi
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 ml-4">
      {isEditing ? (
        // Edit mode buttons
        <>
          <Button
            size="sm"
            onClick={() => onSaveEdit(booking.id)}
            disabled={actionLoading[`save-${booking.id}`]}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {actionLoading[`save-${booking.id}`] ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancelEdit}
            className="text-gray-600 border-gray-600 hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-1" />
            Batal
          </Button>
        </>
      ) : (
        // Normal mode buttons
        <>
          {getActionButtons()}
          
          {booking.contactInfo?.whatsapp && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWhatsAppContact(booking)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStartEdit(booking)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteBooking(booking.id)}
            disabled={actionLoading[booking.id]}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
        </>
      )}
    </div>
  );
};

export default BookingActions;
