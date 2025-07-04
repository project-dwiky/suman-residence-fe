// components/admin/wa/WhatsAppTestMessageCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { WhatsAppTestMessageCardProps } from "@/types/whatsapp";

export const WhatsAppTestMessageCard = ({
  phoneNumber,
  message,
  sendStatus,
  isConnected,
  onPhoneNumberChange,
  onMessageChange,
  onSendMessage,
  onResetForm
}: WhatsAppTestMessageCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kirim Pesan Test</CardTitle>
        <CardDescription>
          Kirim pesan WhatsApp test untuk memverifikasi koneksi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              placeholder="Contoh: 08123456789 atau +628123456789"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Masukkan nomor dengan format 08xx atau +62xx
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Pesan</Label>
            <Textarea
              id="message"
              placeholder="Ketik pesan di sini..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
            />
          </div>

          {sendStatus.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {sendStatus.error}
              </AlertDescription>
            </Alert>
          )}

          {sendStatus.success && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Berhasil</AlertTitle>
              <AlertDescription>
                Pesan berhasil dikirim!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onResetForm}
        >
          Reset
        </Button>
        <Button
          onClick={onSendMessage}
          disabled={!isConnected || sendStatus.sending}
        >
          {sendStatus.sending ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-white rounded-full"></div>
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Kirim Pesan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};