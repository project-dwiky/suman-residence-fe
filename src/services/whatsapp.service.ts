import { WhatsAppStatus, QRCodeResponse, SendMessageResponse } from '@/types/whatsapp';

// Use local API routes that proxy to the backend
const WHATSAPP_API_URL = '/api';

/**
 * Service untuk mengelola fungsi-fungsi WhatsApp
 */
export class WhatsAppService {
  /**
   * Mendapatkan status koneksi WhatsApp
   */
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/whatsapp/status`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get WhatsApp status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting WhatsApp status:', error);
      return { connected: false, qrAvailable: false };
    }
  }

  /**
   * Mendapatkan QR Code untuk koneksi WhatsApp
   */
  async getQRCode(): Promise<string | null> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/whatsapp/qrcode`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get QR Code');
      }

      const data: QRCodeResponse = await response.json();
      return data.qrCode;
    } catch (error) {
      console.error('Error getting QR Code:', error);
      return null;
    }
  }

  /**
   * Reset koneksi WhatsApp untuk mendapatkan QR Code baru
   */
  async resetConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/whatsapp/reset-connection`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset WhatsApp connection');
      }

      return true;
    } catch (error) {
      console.error('Error resetting WhatsApp connection:', error);
      return false;
    }
  }

  /**
   * Mengirim pesan WhatsApp ke nomor tujuan
   */
  async sendMessage(phoneNumber: string, message: string): Promise<SendMessageResponse> {
    try {
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      
      const response = await fetch(`${WHATSAPP_API_URL}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.WHATSAPP_API_KEY || 'default-secret-key-for-development',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: normalizedPhone,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Normalisasi nomor telepon ke format internasional
   * Memastikan format nomor telepon sesuai dengan yang diterima WhatsApp API
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Hapus semua karakter non-digit
    let normalized = phoneNumber.replace(/\D/g, '');
    
    // Jika dimulai dengan '0', ganti dengan kode negara Indonesia (62)
    if (normalized.startsWith('0')) {
      normalized = '62' + normalized.substring(1);
    }
    
    // Jika tidak memiliki kode negara (minimal 11-12 digit), tambahkan 62
    if (normalized.length < 11 && !normalized.startsWith('62')) {
      normalized = '62' + normalized;
    }
    
    return normalized;
  }
}

// Instantiate service untuk penggunaan
const whatsAppService = new WhatsAppService();
export default whatsAppService;
