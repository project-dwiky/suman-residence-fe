// components/admin/wa/WhatsAppStatusCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { WhatsAppStatusCardProps } from "@/types/whatsapp";

export const WhatsAppStatusCard = ({ status, onResetConnection }: WhatsAppStatusCardProps) => {
  const renderStatusContent = () => {
    if (status.loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (status.error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Terjadi kesalahan saat mendapatkan status. Coba lagi nanti.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            {status.connected ? 'Terhubung' : 'Tidak Terhubung'}
          </span>
        </div>

        {status.connected ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>WhatsApp Aktif</AlertTitle>
            <AlertDescription>
              WhatsApp terhubung dan siap untuk mengirim pesan
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>WhatsApp Tidak Aktif</AlertTitle>
            <AlertDescription>
              {status.qrAvailable 
                ? "Scan QR code untuk menghubungkan WhatsApp" 
                : "Klik tombol Reset Koneksi untuk mendapatkan QR code"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Koneksi</CardTitle>
        <CardDescription>
          Status koneksi WhatsApp saat ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatusContent()}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onResetConnection} 
          disabled={status.loading} 
          className="w-full"
          variant="outline"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Koneksi
        </Button>
      </CardFooter>
    </Card>
  );
};