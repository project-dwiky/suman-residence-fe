// components/admin/wa/WhatsAppQRCodeCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { WhatsAppQRCodeCardProps } from "@/types/whatsapp";


export const WhatsAppQRCodeCard = ({ 
  qrCode, 
  loadingQR, 
  isConnected, 
  onFetchQRCode 
}: WhatsAppQRCodeCardProps) => {
  const renderQRContent = () => {
    if (loadingQR) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (qrCode) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="border-8 border-white rounded-lg shadow-lg"
        >
          <QRCode value={qrCode} size={250} />
        </motion.div>
      );
    }

    if (isConnected) {
      return (
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <p className="mt-4 text-lg font-medium">WhatsApp sudah terhubung!</p>
          <p className="text-sm text-gray-500">Tidak perlu scan QR code</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-gray-500">
          QR code tidak tersedia. Klik tombol Reset Koneksi untuk mendapatkan QR code baru.
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>
          Scan QR code ini dengan WhatsApp di HP Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center min-h-[300px]">
          {renderQRContent()}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onFetchQRCode} 
          disabled={loadingQR || isConnected} 
          className="w-full"
          variant={isConnected ? "secondary" : "default"}
        >
          {isConnected ? "Sudah Terhubung" : "Muat Ulang QR Code"}
        </Button>
      </CardFooter>
    </Card>
  );
};