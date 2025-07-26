import { BookingTranslationKeys } from './booking.en';

export const bookingId: BookingTranslationKeys = {
  form: {
    title: "Pesan Kamar",
    personalInfo: "Informasi Pribadi",
    rentalDetails: "Detail Sewa",
    fullName: "Nama Lengkap",
    fullNamePlaceholder: "Masukkan nama lengkap Anda",
    phoneNumber: "Nomor Telepon",
    phoneNumberPlaceholder: "Masukkan nomor telepon Anda",
    email: "Email",
    emailPlaceholder: "Masukkan alamat email Anda",
    startDate: "Tanggal Mulai",
    endDate: "Tanggal Selesai",
    durationType: "Periode Sewa",
    weeklyOption: "Mingguan",
    monthlyOption: "Bulanan",
    semesterOption: "Semester (6 bulan)",
    yearlyOption: "Tahunan",
    additionalNotes: "Catatan Tambahan",
    additionalNotesPlaceholder: "Permintaan khusus atau catatan...",
    submitButton: "Kirim Permintaan Booking",
    submittingButton: "Mengirim...",
    closeButton: "Tutup",
    backButton: "Kembali"
  },
  pricing: {
    title: "Informasi Harga",
    weekly: "Mingguan",
    monthly: "Bulanan",
    semester: "Semester (6 bulan)",
    yearly: "Tahunan",
    selectedPeriod: "Periode Terpilih",
    totalPrice: "Total Harga"
  },
  validation: {
    nameRequired: "Nama lengkap wajib diisi",
    phoneRequired: "Nomor telepon wajib diisi",
    emailRequired: "Email wajib diisi",
    emailInvalid: "Mohon masukkan alamat email yang valid",
    startDateRequired: "Tanggal mulai wajib diisi",
    endDateRequired: "Tanggal selesai wajib diisi",
    endDateInvalid: "Tanggal selesai harus setelah tanggal mulai"
  },
  success: {
    title: "Permintaan Booking Berhasil Dikirim!",
    message: "Permintaan booking Anda telah berhasil dikirim. Kami akan menghubungi Anda segera untuk konfirmasi reservasi.",
    contactInfo: "Anda juga dapat menghubungi kami langsung:",
    whatsapp: "WhatsApp",
    phone: "Telepon",
    email: "Email"
  },
  error: {
    title: "Booking Gagal",
    message: "Terjadi kesalahan saat mengirim permintaan booking. Silakan coba lagi atau hubungi kami langsung.",
    tryAgain: "Coba Lagi",
    contactUs: "Hubungi Kami"
  }
};
