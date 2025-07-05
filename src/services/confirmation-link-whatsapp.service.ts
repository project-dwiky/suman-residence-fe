import whatsAppService, { WhatsAppService } from './whatsapp.service';
import { User } from '@/types/user';

/**
 * Service untuk mengirim link konfirmasi akun ke WhatsApp pengguna
 */
export class ConfirmationLinkWhatsappService {
  private whatsAppService: WhatsAppService;
  private _baseUrl: string;

  constructor(whatsAppService: WhatsAppService, baseUrl: string = '') {
    this.whatsAppService = whatsAppService;
    this._baseUrl = baseUrl || '';
  }
  
  /**
   * Mengatur base URL untuk link konfirmasi
   */
  public setBaseUrl(url: string): void {
    this._baseUrl = url;
  }
  
  /**
   * Mendapatkan base URL saat ini
   */
  public getBaseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Generate confirmation link berdasarkan user ID
   * @param userId ID pengguna untuk konfirmasi
   * @returns Link konfirmasi lengkap
   */
  private generateConfirmationLink(userId: string): string {
    // Enkripsi sederhana dengan base64 untuk userId
    const encodedId = Buffer.from(userId).toString('base64');
    return `${this._baseUrl}/api/auth/verify?token=${encodedId}`;
  }

  /**
   * Mendapatkan template pesan secara acak untuk variasi
   * @param userName Nama pengguna
   * @param confirmationLink Link konfirmasi
   * @returns Template pesan yang sudah terisi
   */
  private getRandomMessageTemplate(userName: string, confirmationLink: string): string {
    const templates = [
      `Halo ${userName}! 👋 Terima kasih telah mendaftar di Suman Residence.\n\nUntuk mengaktifkan akun Anda, silakan klik link berikut:\n${confirmationLink}\n\nAbaikan pesan ini jika Anda tidak merasa mendaftar.`,
      
      `Selamat datang di Suman Residence, ${userName}! ✨\n\nUntuk melanjutkan proses pendaftaran dan mengaktifkan akun Anda, silakan klik link di bawah ini:\n${confirmationLink}\n\n`,
      
      `${userName}, terima kasih telah memilih Suman Residence! 🏠\n\nSatu langkah lagi untuk menyelesaikan pendaftaran Anda. Silakan verifikasi akun Anda melalui link berikut:\n${confirmationLink}\n\nJika Anda memiliki pertanyaan, silakan hubungi kami.`,
      
      `Pendaftaran Anda di Suman Residence hampir selesai, ${userName}!\n\nKlik link berikut untuk verifikasi dan aktivasi akun:\n${confirmationLink}\n\nSetelah verifikasi, Anda dapat menikmati semua fitur yang tersedia. Terima kasih! 🙏`,
      
      `Hai ${userName}! Terima kasih sudah mendaftar di Suman Residence 🏡\n\nUntuk keamanan akun Anda, mohon verifikasi dengan mengklik link ini:\n${confirmationLink}\n\nKami tidak sabar untuk menyambut Anda!`
    ];

    // Pilih template secara acak
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  /**
   * Kirim link konfirmasi ke WhatsApp pengguna
   * @param user Data pengguna yang akan menerima konfirmasi
   * @returns Status pengiriman
   */
  async sendConfirmationLink(user: User): Promise<boolean> {
    try {
      if (!user.id || !user.phone) {
        console.error('User ID or phone number missing');
        return false;
      }

      // Generate link konfirmasi
      const confirmationLink = this.generateConfirmationLink(user.id);
      
      // Dapatkan template pesan secara acak
      const message = this.getRandomMessageTemplate(user.name || 'Pengguna', confirmationLink);
      
      // Kirim pesan WhatsApp
      const result = await this.whatsAppService.sendMessage(user.phone, message);
      
      if (!result.success) {
        console.error('Failed to send WhatsApp confirmation link:', result.message);
        return false;
      }
      
      console.log(`Confirmation link sent to ${user.phone}`);
      return true;
    } catch (error) {
      console.error('Error sending confirmation link via WhatsApp:', error);
      return false;
    }
  }

  /**
   * Kirim ulang link konfirmasi berdasarkan email
   * @param email Email pengguna untuk mengirim ulang konfirmasi
   * @param userId ID pengguna jika sudah diketahui
   * @returns Status pengiriman
   */
  async resendConfirmationLink(phone: string, userId: string): Promise<boolean> {
    try {
      if (!userId || !phone) {
        console.error('User ID or phone number missing for resend');
        return false;
      }
      
      // Generate link konfirmasi baru
      const confirmationLink = this.generateConfirmationLink(userId);
      
      // Template untuk pengiriman ulang
      const message = `Anda telah meminta pengiriman ulang link konfirmasi akun Suman Residence 🔄\n\nSilakan klik link berikut untuk mengaktifkan akun Anda:\n${confirmationLink}\n\nLink akan kedaluwarsa dalam 24 jam. Abaikan pesan ini jika Anda tidak melakukan permintaan.`;
      
      // Kirim pesan WhatsApp
      const result = await this.whatsAppService.sendMessage(phone, message);
      
      if (!result.success) {
        console.error('Failed to resend WhatsApp confirmation link:', result.message);
        return false;
      }
      
      console.log(`Confirmation link resent to ${phone}`);
      return true;
    } catch (error) {
      console.error('Error resending confirmation link via WhatsApp:', error);
      return false;
    }
  }
}

// Instantiate service dengan dependency injection
const confirmationLinkWhatsappService = new ConfirmationLinkWhatsappService(whatsAppService);
export default confirmationLinkWhatsappService;
