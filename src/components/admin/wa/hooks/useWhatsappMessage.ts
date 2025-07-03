// components/admin/wa/hooks/useWhatsAppMessage.ts
import { useState } from "react";
import { UseWhatsAppMessageReturn, WhatsAppSendStatus } from "@/types/whatsapp";

export const useWhatsAppMessage = (): UseWhatsAppMessageReturn => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sendStatus, setSendStatus] = useState<WhatsAppSendStatus>({
    sending: false,
    success: false,
    error: null
  });

  const sendMessage = async () => {
    // Validation
    if (!phoneNumber.trim() || !message.trim()) {
      setSendStatus({
        sending: false,
        success: false,
        error: "Nomor telepon dan pesan harus diisi"
      });
      return;
    }

    setSendStatus({
      sending: true,
      success: false,
      error: null
    });

    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber,
          message
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      setSendStatus({
        sending: false,
        success: true,
        error: null
      });

      // Auto-reset success status after 5 seconds
      setTimeout(() => {
        setSendStatus({
          sending: false,
          success: false,
          error: null
        });
      }, 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      setSendStatus({
        sending: false,
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message"
      });
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setMessage("");
    setSendStatus({
      sending: false,
      success: false,
      error: null
    });
  };

  return {
    phoneNumber,
    setPhoneNumber,
    message,
    setMessage,
    sendStatus,
    sendMessage,
    resetForm
  };
};