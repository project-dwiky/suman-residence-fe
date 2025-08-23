"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign,
  AlertCircle,
  Upload,
  FileText,
  Eye
} from 'lucide-react';
import { Booking, BookingDocument } from '../types';
import BookingActions from './BookingActions';
import { BookingValidation } from './BookingValidation';
import { formatDate } from '../../user-dashboard/utils/dateUtils';

interface BookingCardProps {
  booking: Booking;
  isEditing: boolean;
  editedValues: {
    roomNumber?: string;
    roomType?: string;
    startDate?: Date;
    endDate?: Date;
    durationType?: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
    price?: number;
    paidAmount?: number;
  };
  actionLoading: { [key: string]: boolean };
  uploadingFile: string | null;
  generatingDocuments: string | null;
  searchQuery: string;
  onFieldChange: (field: string, value: any) => void;
  onBookingAction: (bookingId: string, action: 'approve' | 'reject' | 'cancel' | 'reactivate') => void;
  onWhatsAppContact: (booking: Booking) => void;
  onStartEdit: (booking: Booking) => void;
  onSaveEdit: (bookingId: string) => void;
  onCancelEdit: () => void;
  onDeleteBooking: (bookingId: string) => void;
  onFileSelect: (bookingId: string, documentType: 'SOP') => void;
  onGenerateAllDocuments: (bookingId: string) => void;
  onDocumentDownload: (document: BookingDocument) => void;
  onContinueBooking: (booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isEditing,
  editedValues,
  actionLoading,
  uploadingFile,
  generatingDocuments,
  searchQuery,
  onFieldChange,
  onBookingAction,
  onWhatsAppContact,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteBooking,
  onFileSelect,
  onGenerateAllDocuments,
  onDocumentDownload,
  onContinueBooking
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentStatus = (totalAmount: number, paidAmount: number) => {
    if (paidAmount === 0) {
      return { status: 'UNPAID', label: 'Belum Bayar', color: 'text-red-600 bg-red-100' };
    } else if (paidAmount >= totalAmount) {
      return { status: 'PAID', label: 'Lunas', color: 'text-green-600 bg-green-100' };
    } else {
      return { status: 'PARTIAL', label: 'Sebagian', color: 'text-yellow-600 bg-yellow-100' };
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      CANCEL: { color: 'bg-red-100 text-red-800', label: 'Canceled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getDurationLabel = (durationType: string) => {
    switch (durationType) {
      case 'WEEKLY': return 'Mingguan';
      case 'MONTHLY': return 'Bulanan';
      case 'SEMESTER': return 'Semester';
      case 'YEARLY': return 'Tahunan';
      default: return durationType;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'BOOKING_SLIP': return 'Booking Slip (DP)';
      case 'RECEIPT': return 'Receipt (Lunas)';
      case 'SOP': return 'SOP';
      case 'INVOICE': return 'Invoice (Tagihan)';
      default: return type;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  Booking ID: {highlightSearchTerm(booking.id.substring(0, 8) + '...', searchQuery)}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(booking.rentalStatus)}
                  <span className="text-sm text-gray-500">
                    {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Customer</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{highlightSearchTerm(booking.contactInfo?.name || booking.userId, searchQuery)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{highlightSearchTerm(booking.contactInfo?.phone || '-', searchQuery)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{highlightSearchTerm(booking.contactInfo?.email || '-', searchQuery)}</span>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Kamar</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">No. Kamar:</span>
                    {isEditing ? (
                      <Input
                        value={editedValues.roomNumber || ''}
                        onChange={(e) => onFieldChange('roomNumber', e.target.value)}
                        className="h-6 text-xs flex-1"
                        placeholder="Contoh: A1, B2, etc"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${booking.room.roomNumber === 'Belum diset' ? 'text-orange-600' : ''}`}>
                          {highlightSearchTerm(booking.room.roomNumber, searchQuery)}
                        </span>
                        {booking.rentalStatus === 'PENDING' && BookingValidation.isFieldMissing(booking, 'roomNumber') && (
                          <div title="Field harus diisi untuk approve">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Tipe:</span>
                    {isEditing ? (
                      <Input
                        value={editedValues.roomType || ''}
                        onChange={(e) => onFieldChange('roomType', e.target.value)}
                        className="h-6 text-xs flex-1"
                        placeholder="Tipe kamar"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className={BookingValidation.isFieldMissing(booking, 'roomType') ? 'text-red-600' : ''}>{booking.room.type}</span>
                        {booking.rentalStatus === 'PENDING' && BookingValidation.isFieldMissing(booking, 'roomType') && (
                          <div title="Field harus diisi untuk approve">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Periode Sewa</h4>
                <div className="space-y-2 text-sm">
                  {isEditing ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Tanggal Mulai:</label>
                        <DatePicker
                          date={editedValues.startDate}
                          onSelect={(date) => onFieldChange('startDate', date)}
                          placeholder="Pilih tanggal mulai"
                          className="h-6 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Durasi:</label>
                        <Select 
                          value={editedValues.durationType} 
                          onValueChange={(value) => onFieldChange('durationType', value)}
                        >
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WEEKLY">Mingguan</SelectItem>
                            <SelectItem value="MONTHLY">Bulanan</SelectItem>
                            <SelectItem value="SEMESTER">Semester</SelectItem>
                            <SelectItem value="YEARLY">Tahunan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Tanggal Berakhir (otomatis):</label>
                        <DatePicker
                          date={editedValues.endDate}
                          onSelect={() => {}} // Read-only
                          placeholder="Dihitung otomatis"
                          disabled={true}
                          className="h-6 text-xs bg-gray-50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {formatDate(booking.rentalPeriod.startDate)} - {formatDate(booking.rentalPeriod.endDate)}
                        </span>
                      </div>
                      <div>Durasi: {getDurationLabel(booking.rentalPeriod.durationType)}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Pricing Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Harga & Pembayaran</h4>
                <div className="space-y-2 text-sm">
                  {isEditing ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Harga Sewa (IDR):</label>
                        <Input
                          type="number"
                          value={editedValues.price || ''}
                          onChange={(e) => onFieldChange('price', parseFloat(e.target.value) || 0)}
                          className="h-6 text-xs"
                          placeholder="Masukkan harga (contoh: 1500000)"
                          min="0"
                          step="50000"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Sudah Dibayar (IDR):</label>
                        <Input
                          type="number"
                          value={editedValues.paidAmount || ''}
                          onChange={(e) => onFieldChange('paidAmount', parseFloat(e.target.value) || 0)}
                          className="h-6 text-xs"
                          placeholder="Masukkan jumlah yang sudah dibayar"
                          min="0"
                          max={editedValues.price || 0}
                          step="50000"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className={`font-medium ${(booking.pricing?.amount || 0) > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {(booking.pricing?.amount || 0) > 0 ? formatPrice(booking.pricing?.amount || 0) : 'Belum diset'}
                        </span>
                        {booking.rentalStatus === 'PENDING' && BookingValidation.isFieldMissing(booking, 'price') && (
                          <div title="Harga harus diisi untuk approve">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      {(booking.pricing?.amount || 0) > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Dibayar:</span>
                            <span className="font-medium">
                              {formatPrice(booking.pricing?.paidAmount || 0)}
                            </span>
                            {booking.rentalStatus === 'PENDING' && BookingValidation.isFieldMissing(booking, 'paidAmount') && (
                              <div title="Jumlah bayar harus diisi untuk approve">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatus(booking.pricing?.amount || 0, booking.pricing?.paidAmount || 0).color}`}>
                              {getPaymentStatus(booking.pricing?.amount || 0, booking.pricing?.paidAmount || 0).label}
                            </span>
                          </div>
                          {(booking.pricing?.paidAmount || 0) < (booking.pricing?.amount || 0) && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Sisa:</span>
                              <span className="font-medium text-red-600">
                                {formatPrice((booking.pricing?.amount || 0) - (booking.pricing?.paidAmount || 0))}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Catatan</h4>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>
            )}

            {/* Document Management Section */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Dokumen Booking
              </h4>
              
              {/* Existing Documents */}
              {booking.documents && booking.documents.length > 0 && (
                <div className="mb-3 space-y-2">
                  {booking.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{getDocumentTypeLabel(doc.type)}</span>
                        <span className="text-xs text-gray-500">({doc.fileName})</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDocumentDownload(doc)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Generation Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onGenerateAllDocuments(booking.id)}
                  disabled={generatingDocuments === booking.id || uploadingFile?.startsWith(booking.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white col-span-1"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {generatingDocuments === booking.id ? 'Generating...' : 'Generate All Documents'}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFileSelect(booking.id, 'SOP')}
                  disabled={uploadingFile === `${booking.id}-SOP`}
                  className="text-xs"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {uploadingFile === `${booking.id}-SOP` ? 'Uploading...' : 'Upload SOP'}
                </Button>
              </div>

              {/* Validation Message */}
              {(() => {
                const validation = BookingValidation.validateDocumentGeneration(booking);
                if (!validation.isValid) {
                  return (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <div className="flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-700">{validation.message}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Actions */}
          <BookingActions
            booking={booking}
            isEditing={isEditing}
            actionLoading={actionLoading}
            onBookingAction={onBookingAction}
            onWhatsAppContact={onWhatsAppContact}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDeleteBooking={onDeleteBooking}
            onContinueBooking={onContinueBooking}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
