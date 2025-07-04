// components/admin/wa/hooks/useWhatsAppQRCode.ts
import { UseWhatsAppQRCodeReturn } from "@/types/whatsapp";
import { useState } from "react";

export const useWhatsAppQRCode = (): UseWhatsAppQRCodeReturn => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  const fetchQRCode = async () => {
    setLoadingQR(true);
    try {
      const response = await fetch("/api/whatsapp/qrcode");
      if (!response.ok) {
        throw new Error("Failed to fetch QR code");
      }
      const data = await response.json();
      setQrCode(data.qrCode);
      return data.qrCode;
    } catch (error) {
      console.error("Error fetching QR code:", error);
      throw error;
    } finally {
      setLoadingQR(false);
    }
  };

  const clearQRCode = () => {
    setQrCode(null);
  };

  return {
    qrCode,
    loadingQR,
    fetchQRCode,
    clearQRCode
  };
};