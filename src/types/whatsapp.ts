/**
 * Interface untuk response status WhatsApp
 */
export interface WhatsAppStatus {
  connected: boolean;
  qrAvailable: boolean;
}

/**
 * Interface untuk data QR Code
 */
export interface QRCodeResponse {
  qrCode: string | null;
}

/**
 * Interface untuk data pengiriman pesan
 */
export interface SendMessageRequest {
  phoneNumber: string;
  message: string;
}

/**
 * Interface untuk response pengiriman pesan
 */
export interface SendMessageResponse {
  success: boolean;
  message: string;
}

// components/admin/wa/types.ts

export interface WhatsAppHookStatus {
    connected: boolean;
    qrAvailable: boolean;
    loading: boolean;
    error: boolean;
  }
  
  export interface WhatsAppSendStatus {
    sending: boolean;
    success: boolean;
    error: string | null;
  }
  
  export interface WhatsAppStatusResponse {
    connected: boolean;
    qrAvailable: boolean;
    message?: string;
  }
  
  export interface WhatsAppQRCodeResponse {
    qrCode: string;
    success: boolean;
    message?: string;
  }
  
  export interface WhatsAppSendMessageRequest {
    phoneNumber: string;
    message: string;
  }
  
  export interface WhatsAppSendMessageResponse {
    success: boolean;
    message: string;
    messageId?: string;
  }
  
  export interface WhatsAppResetConnectionResponse {
    success: boolean;
    message: string;
  }
  
  // Hook return types
  export interface UseWhatsAppStatusReturn {
    status: WhatsAppHookStatus;
    fetchStatus: () => Promise<WhatsAppStatusResponse>;
    resetConnection: () => Promise<void>;
  }
  
  export interface UseWhatsAppQRCodeReturn {
    qrCode: string | null;
    loadingQR: boolean;
    fetchQRCode: () => Promise<string>;
    clearQRCode: () => void;
  }
  
  export interface UseWhatsAppMessageReturn {
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    sendStatus: WhatsAppSendStatus;
    sendMessage: () => Promise<void>;
    resetForm: () => void;
  }
  
  // Component props types
  export interface WhatsAppStatusCardProps {
    status: WhatsAppHookStatus;
    onResetConnection: () => void;
  }
  
  export interface WhatsAppQRCodeCardProps {
    qrCode: string | null;
    loadingQR: boolean;
    isConnected: boolean;
    onFetchQRCode: () => void;
  }
  
  export interface WhatsAppTestMessageCardProps {
    phoneNumber: string;
    message: string;
    sendStatus: WhatsAppSendStatus;
    isConnected: boolean;
    onPhoneNumberChange: (value: string) => void;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
    onResetForm: () => void;
  }