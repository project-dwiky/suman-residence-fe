// components/admin/wa/WhatsAppManagementPage.tsx
"use client";

import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { WhatsAppStatusCard } from "./WhatsappStatusCard";
import { WhatsAppQRCodeCard } from "./WhatsappQRCodeCard";
import { useWhatsAppStatus } from "./hooks/useWhatsappStatus";
import { useWhatsAppQRCode } from "./hooks/useWhatsappQRCode";
import { useWhatsAppMessage } from "./hooks/useWhatsappMessage";
import { WhatsAppTestMessageCard } from "./WhatsappTestMessageCard";

export default function WhatsAppManagementPage() {
  const { status, resetConnection } = useWhatsAppStatus();
  const { qrCode, loadingQR, fetchQRCode, clearQRCode } = useWhatsAppQRCode();
  const { 
    phoneNumber, 
    setPhoneNumber, 
    message, 
    setMessage, 
    sendStatus, 
    sendMessage, 
    resetForm 
  } = useWhatsAppMessage();

  // Handle QR code fetching based on status
  useEffect(() => {
    if (status.connected) {
      clearQRCode();
    } else if (status.qrAvailable && !status.connected && !qrCode) {
      fetchQRCode();
    }
  }, [status.connected, status.qrAvailable, qrCode, fetchQRCode, clearQRCode]);

  const handleResetConnection = async () => {
    try {
      await resetConnection();
      await fetchQRCode();
    } catch (error) {
      console.error("Error in reset connection:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WhatsAppStatusCard 
          status={status}
          onResetConnection={handleResetConnection}
        />

        <WhatsAppQRCodeCard 
          qrCode={qrCode}
          loadingQR={loadingQR}
          isConnected={status.connected}
          onFetchQRCode={fetchQRCode}
        />
      </div>

      <Separator className="my-8" />

      <WhatsAppTestMessageCard 
        phoneNumber={phoneNumber}
        message={message}
        sendStatus={sendStatus}
        isConnected={status.connected}
        onPhoneNumberChange={setPhoneNumber}
        onMessageChange={setMessage}
        onSendMessage={sendMessage}
        onResetForm={resetForm}
      />
    </div>
  );
}