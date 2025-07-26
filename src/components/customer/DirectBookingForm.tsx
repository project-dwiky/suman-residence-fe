"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  User, 
  Mail, 
  Calendar, 
  MessageCircle,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { BookingService, BookingRequest } from "@/components/user-dashboard/services/booking.service";
import { toast } from "sonner";
import { Language } from "@/translations";

interface DirectBookingFormProps {
  room: {
    id: string;
    title: string;
    price: string;
    type?: string;
    size?: string;
    description?: string;
    facilities?: string[];
    images?: string[];
    monthlyPrice?: number;
    pricing?: {
      weekly: number;
      monthly: number;
      semester: number;
      yearly: number;
    };
  };
  language?: Language;
  onClose: () => void;
}

export default function DirectBookingForm({ room, language = 'id', onClose }: DirectBookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    startDate: "",
    endDate: "",
    durationType: "MONTHLY" as "WEEKLY" | "MONTHLY" | "SEMESTER" | "YEARLY",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Get duration label
  const getDurationLabel = (durationType: string) => {
    switch (durationType) {
      case 'WEEKLY': return 'Mingguan';
      case 'MONTHLY': return 'Bulanan';
      case 'SEMESTER': return 'Semester (6 Bulan)';
      case 'YEARLY': return 'Tahunan';
      default: return 'Bulanan';
    }
  };

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            name: user.name || '',
            phone: user.phone || ''
          }));
        } else {
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Require authentication
    if (!currentUser) {
      toast.error("Anda harus login untuk melakukan booking");
      return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.startDate || !formData.endDate) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Validate phone number
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Nomor telepon tidak valid. Gunakan format: 081234567890");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      toast.error("Tanggal mulai tidak boleh kurang dari hari ini");
      return;
    }

    if (endDate <= startDate) {
      toast.error("Tanggal berakhir harus setelah tanggal mulai");
      return;
    }

    setLoading(true);

    try {
      // Prepare booking data without pricing
      const bookingData: BookingRequest = {
        room: {
          id: room.id,
          name: room.title,
          roomNumber: room.title,
          type: room.type || 'Standard',
          size: room.size || 'Standard',
          description: room.description || '',
          facilities: room.facilities || [],
          images: room.images || []
        },
        rentalPeriod: {
          startDate: formData.startDate,
          endDate: formData.endDate,
          durationType: formData.durationType
        },
        contactInfo: {
          name: formData.name,
          email: currentUser.email,
          phone: formData.phone,
          whatsapp: formData.phone
        },
        notes: formData.message,
        userId: currentUser.id
      };

      // Submit booking to Firebase first
      const result = await BookingService.createBooking(bookingData);

      if (result.success) {
        // Generate WhatsApp message for customer to send to admin
        let adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
        
        // Ensure admin WhatsApp number has correct format
        adminWhatsApp = adminWhatsApp.replace(/\D/g, '');
        if (adminWhatsApp.startsWith('0')) {
          adminWhatsApp = '62' + adminWhatsApp.substring(1);
        } else if (!adminWhatsApp.startsWith('62')) {
          adminWhatsApp = '62' + adminWhatsApp;
        }

        const message = `Halo Admin Suman Residence,

Saya ingin melakukan booking kamar:

📋 *Detail Booking:*
• Nama: ${formData.name}
• WhatsApp: ${formData.phone}
• Email: ${currentUser.email}
• Kamar: ${room.title}
• Tanggal Masuk: ${formData.startDate}
• Tanggal Keluar: ${formData.endDate}
• Durasi: ${getDurationLabel(formData.durationType)}

${formData.message ? `💬 *Catatan:*\n${formData.message}\n\n` : ''}📝 *Booking ID:* ${result.booking?.id || 'Sistem'}

Mohon konfirmasi ketersediaan kamar dan informasi selanjutnya.

Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/+${adminWhatsApp}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        setSuccess(true);
        toast.success("Data booking disimpan! Silakan lanjutkan dengan menghubungi admin via WhatsApp.");
        
        // Auto close after 5 seconds
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      durationType: value as "WEEKLY" | "MONTHLY" | "SEMESTER" | "YEARLY"
    });
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Tersimpan!</h2>
          <p className="text-gray-600 mb-4">
            Data booking Anda telah disimpan. WhatsApp telah terbuka untuk menghubungi admin. Jika tidak terbuka otomatis, silakan hubungi admin secara manual.
          </p>
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Booking Kamar</h2>
              <p className="text-sm text-gray-600">{room.title} - {room.price}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Authentication Status */}
          {userLoading ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-blue-800">Memuat data pengguna...</span>
              </div>
            </div>
          ) : currentUser ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <div className="flex-1">
                  <span className="text-sm text-green-800">
                    Login sebagai: <strong>{currentUser.name}</strong>
                  </span>
                  <p className="text-xs text-green-600 mt-1">
                    Email booking akan menggunakan: {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <div className="flex-1">
                  <span className="text-sm text-red-800">
                    Anda harus login untuk melakukan booking.{' '}
                    <a href="/auth/login" className="underline hover:no-underline font-medium">
                      Login sekarang
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Show form only for authenticated users */}
          {!currentUser && !userLoading ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                Silakan login terlebih dahulu untuk melanjutkan booking
              </p>
              <a 
                href="/auth/login" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login Sekarang
              </a>
            </div>
          ) : currentUser ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informasi Pribadi
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Nomor WhatsApp *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="081234567890"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Email display (read-only from account) */}
                <div>
                  <Label htmlFor="email">Email (dari akun Anda)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email ini diambil dari akun Anda dan tidak dapat diubah di form ini
                  </p>
                </div>
              </div>

              {/* Rental Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Periode Sewa
                </h3>
                
                <div>
                  <Label htmlFor="durationType">Jenis Sewa</Label>
                  <Select value={formData.durationType} onValueChange={handleSelectChange} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Mingguan</SelectItem>
                      <SelectItem value="MONTHLY">Bulanan</SelectItem>
                      <SelectItem value="SEMESTER">Semester (6 Bulan)</SelectItem>
                      <SelectItem value="YEARLY">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Duration Note */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Durasi Sewa: {getDurationLabel(formData.durationType)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      * Harga akan dikonfirmasi oleh admin setelah permintaan booking disetujui.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Tanggal Berakhir *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Pesan Tambahan
                </h3>
                
                <div>
                  <Label htmlFor="message">Catatan atau Permintaan Khusus</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tulis pesan atau permintaan khusus..."
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Langkah selanjutnya:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Data booking akan disimpan dalam sistem untuk referensi admin.</li>
                      <li>• Setelah klik "Kirim Booking", WhatsApp akan terbuka otomatis.</li>
                      <li>• Pesan akan terisi otomatis dengan detail booking Anda.</li>
                      <li>• Kirim pesan tersebut ke admin untuk konfirmasi ketersediaan.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Kirim Booking"}
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
