import { WhatsAppService } from './whatsapp.service';

/**
 * Class untuk mengirim link reset password melalui WhatsApp
 */
export class ResetPasswordWhatsappService {
  private _baseUrl: string;
  private whatsappService: WhatsAppService;
  private messageTemplates: string[];

  constructor(baseUrl = '') {
    this._baseUrl = baseUrl;
    this.whatsappService = new WhatsAppService();
    
    // Template pesan dengan variasi untuk menghindari deteksi spam oleh WhatsApp
    this.messageTemplates = [
      "Hi, silakan reset password Anda dengan link berikut: {{link}}",
      "Reset password Anda dapat dilakukan melalui link ini: {{link}}",
      "Link reset password Anda: {{link}}. Abaikan jika Anda tidak meminta reset.",
      "Berikut adalah link untuk reset password akun Anda: {{link}}",
      "Anda telah meminta reset password. Klik link berikut untuk melanjutkan: {{link}}"
    ];
  }

  /**
   * Getter untuk baseUrl
   */
  get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Setter untuk baseUrl
   */
  set baseUrl(url: string) {
    this._baseUrl = url;
  }

  /**
   * Generate link reset password
   * @param token Token untuk reset password
   * @returns Link reset password lengkap
   */
  private generateResetPasswordLink(token: string): string {
    return `${this._baseUrl}/auth/reset-password?token=${token}`;
  }

  /**
   * Mendapatkan pesan template secara acak
   * @returns Template pesan yang dipilih secara acak
   */
  private getRandomMessageTemplate(): string {
    const randomIndex = Math.floor(Math.random() * this.messageTemplates.length);
    return this.messageTemplates[randomIndex];
  }

  /**
   * Mengirim link reset password melalui WhatsApp
   * @param phone Nomor telepon penerima (format: 628xxx)
   * @param token Token untuk reset password
   * @returns Status pengiriman
   */
  async sendResetPasswordLink(phone: string, token: string): Promise<boolean> {
    try {
      const link = this.generateResetPasswordLink(token);
      const messageTemplate = this.getRandomMessageTemplate();
      const message = messageTemplate.replace('{{link}}', link);
      
      // Kirim pesan melalui WhatsApp
      const result = await this.whatsappService.sendMessage(phone, message);
      return result.success;
    } catch (error) {
      console.error('Failed to send reset password link via WhatsApp:', error);
      return false;
    }
  }
}

export default ResetPasswordWhatsappService;
