import { Booking } from '@/repositories/booking.repository';

/**
 * WhatsApp notification templates with variations to avoid bot detection
 * Each category has multiple template variations that will be randomly selected
 */

// H-1 Templates (1 day before expiry)
const H1_TEMPLATES = [
  (booking: Booking) => `🚨 *REMINDER URGENT*

Halo *{name}*! 👋

Kontrak sewa kamar Anda akan berakhir *BESOK* (${formatDate(booking.rentalPeriod.endDate)})

📍 Kamar: *${booking.room.roomNumber}*
📅 Berakhir: *${formatDate(booking.rentalPeriod.endDate)}*

Mohon segera hubungi management untuk perpanjangan kontrak atau persiapan check-out.

📞 Contact: 0812-3456-7890
🏠 Suman Residence Management`,

  (booking: Booking) => `⏰ *URGENT - 24 JAM LAGI*

Dear *{name}*,

Reminder bahwa masa sewa kamar Anda akan habis dalam *1 hari* lagi.

🏠 Kamar: *${booking.room.roomNumber}*
📆 Expired: *${formatDate(booking.rentalPeriod.endDate)}*

Jika ingin perpanjang, segera koordinasi dengan tim kami ya!

Best regards,
Suman Residence Team 🏡`,

  (booking: Booking) => `📢 *PENTING!*

Hi *{name}*! 

Kontrak kamar ${booking.room.roomNumber} akan expire *BESOK TANGGAL ${formatDate(booking.rentalPeriod.endDate)}*

Silakan hubungi kami untuk:
✅ Perpanjangan kontrak
✅ Koordinasi check-out

Contact: 0812-3456-7890

Terima kasih! 🙏`
];

// H-7 Templates (7 days before expiry)
const H7_TEMPLATES = [
  (booking: Booking) => `📅 *REMINDER KONTRAK*

Halo *{name}*! 😊

Masa sewa kamar Anda akan berakhir dalam *7 hari* lagi:

🏠 Kamar: *${booking.room.roomNumber}*
📆 Berakhir: *${formatDate(booking.rentalPeriod.endDate)}*

Yuk, koordinasi sekarang untuk perpanjangan atau persiapan pindah!

📞 WhatsApp: 0812-3456-7890
🏡 Suman Residence`,

  (booking: Booking) => `⏰ *7 HARI LAGI*

Dear *{name}*,

Friendly reminder: kontrak sewa kamar ${booking.room.roomNumber} akan expired pada *${formatDate(booking.rentalPeriod.endDate)}*

Masih ada *1 minggu* untuk koordinasi perpanjangan atau check-out.

Hubungi kami segera ya! 📱

Salam,
Management Suman Residence ✨`,

  (booking: Booking) => `🔔 *NOTIFICATION*

Hi *{name}*!

Kamar *${booking.room.roomNumber}* contract akan berakhir tanggal *${formatDate(booking.rentalPeriod.endDate)}* (7 hari lagi)

Let's discuss:
• Contract renewal
• Move-out preparation

Contact us: 0812-3456-7890

Thank you! 🙏`
];

// H-15 Templates (15 days before expiry)
const H15_TEMPLATES = [
  (booking: Booking) => `📢 *EARLY REMINDER*

Halo *{name}*! 🌟

Kontrak semester kamar Anda akan berakhir dalam *15 hari*:

🏠 Kamar: *${booking.room.roomNumber}*
📅 End date: *${formatDate(booking.rentalPeriod.endDate)}*

Masih ada waktu 2 minggu untuk planning ke depan. Mau perpanjang atau ada pertanyaan lain?

📞 Call/WA: 0812-3456-7890
🏡 Suman Residence Team`,

  (booking: Booking) => `⏰ *2 WEEKS NOTICE*

Dear *{name}*,

Your semester contract for room ${booking.room.roomNumber} will expire on *${formatDate(booking.rentalPeriod.endDate)}*

Still have *15 days* to plan ahead! 

Need to discuss renewal or move-out? Contact us anytime 😊

Best wishes,
Suman Residence Management 🏠`,

  (booking: Booking) => `🗓️ *SEMESTER REMINDER*

Hi *{name}*!

Masa kontrak semester kamar *${booking.room.roomNumber}* akan selesai pada *${formatDate(booking.rentalPeriod.endDate)}*

Tinggal *15 hari* lagi nih! Sudah ada rencana untuk semester depan?

Yuk diskusi bareng tim kami! 💬

Contact: 0812-3456-7890`
];

// H-30 Templates (30 days before expiry)
const H30_TEMPLATES = [
  (booking: Booking) => `📅 *ANNUAL CONTRACT REMINDER*

Halo *{name}*! 👋

Contract tahunan kamar Anda akan berakhir dalam *1 bulan*:

🏠 Kamar: *${booking.room.roomNumber}*
📆 Expired: *${formatDate(booking.rentalPeriod.endDate)}*

Masih ada waktu 30 hari untuk koordinasi renewal atau planning ke depan.

📞 Contact: 0812-3456-7890
🏡 Suman Residence`,

  (booking: Booking) => `⏰ *1 MONTH NOTICE*

Dear *{name}*,

Your yearly contract for room ${booking.room.roomNumber} will end on *${formatDate(booking.rentalPeriod.endDate)}*

*30 days* remaining! Perfect time to discuss:
✅ Contract renewal
✅ Rate negotiation  
✅ Future planning

Let's talk! 😊

Suman Residence Team 🌟`,

  (booking: Booking) => `🔔 *YEARLY CONTRACT UPDATE*

Hi *{name}*!

Kamar *${booking.room.roomNumber}* - kontrak tahunan akan berakhir tanggal *${formatDate(booking.rentalPeriod.endDate)}*

Tinggal *1 bulan* lagi! Ada rencana untuk tahun depan?

Contact kami untuk diskusi renewal ya! 📱

Thanks! 🙏
Suman Residence Management`
];

/**
 * Get random notification template based on notification type
 */
export function getNotificationTemplate(type: 'h1' | 'h7' | 'h15' | 'h30', booking: Booking): string {
  let templates: ((booking: Booking) => string)[];
  
  switch (type) {
    case 'h1':
      templates = H1_TEMPLATES;
      break;
    case 'h7':
      templates = H7_TEMPLATES;
      break;
    case 'h15':
      templates = H15_TEMPLATES;
      break;
    case 'h30':
      templates = H30_TEMPLATES;
      break;
    default:
      throw new Error(`Invalid notification type: ${type}`);
  }
  
  // Get random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  const selectedTemplate = templates[randomIndex];
  
  // Generate message and replace {name} placeholder
  const message = selectedTemplate(booking);
  return message.replace('{name}', booking.contactInfo.name);
}

/**
 * Format date to Indonesian format
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Get notification summary for logging
 */
export function getNotificationSummary(type: 'h1' | 'h7' | 'h15' | 'h30', bookings: Booking[]): string {
  const typeLabels = {
    h1: 'H-1 (1 hari lagi)',
    h7: 'H-7 (7 hari lagi)', 
    h15: 'H-15 (15 hari lagi)',
    h30: 'H-30 (30 hari lagi)'
  };
  
  return `📊 Notification ${typeLabels[type]}: ${bookings.length} booking(s) processed`;
}
