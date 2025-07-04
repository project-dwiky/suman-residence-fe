// components/admin/wa/hooks/useWhatsAppStatus.ts
import { UseWhatsAppStatusReturn, WhatsAppHookStatus } from "@/types/whatsapp";
import { useState, useEffect } from "react";

const STATUS_POLLING_INTERVAL = 10000; // 10 seconds

export const useWhatsAppStatus = (): UseWhatsAppStatusReturn => {
  const [status, setStatus] = useState<WhatsAppHookStatus>({
    connected: false,
    qrAvailable: false,
    loading: true,
    error: false
  });

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status");
      if (!response.ok) {
        throw new Error("Failed to fetch WhatsApp status");
      }
      const data = await response.json();
      setStatus({
        connected: data.connected,
        qrAvailable: data.qrAvailable,
        loading: false,
        error: false
      });
      return data;
    } catch (error) {
      console.error("Error fetching WhatsApp status:", error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: true
      }));
      throw error;
    }
  };

  const resetConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/whatsapp/reset-connection", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to reset connection");
      }

      // Fetch updated status
      await fetchStatus();
    } catch (error) {
      console.error("Error resetting connection:", error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: true
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, STATUS_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return {
    status,
    fetchStatus,
    resetConnection
  };
};