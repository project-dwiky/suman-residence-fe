import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/repositories/user.repository";
import { ResetPasswordWhatsappService } from "@/services/auth/reset-password-whatsapp.service";
import { saveResetToken } from "@/models/reset-token.model";
import crypto from 'crypto';

/**
 * API untuk meminta reset password
 * Endpoint: POST /api/auth/reset
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Cari user berdasarkan email
        const user = await getUserByEmail(email);
        
        // Jika user tidak ditemukan, tetap berikan respons sukses untuk alasan keamanan
        // (untuk menghindari enumeration attack)
        if (!user || !user.phone) {
            return NextResponse.json(
                { message: 'If your email is registered, a reset password link has been sent to your WhatsApp' },
                { status: 200 }
            );
        }

        // Jika user belum terverifikasi, berikan respons error
        if (!user.isVerified) {
            return NextResponse.json(
                { message: 'Account is not verified. Please verify your account first.' },
                { status: 400 }
            );
        }

        // Generate token untuk reset password
        // Gunakan kombinasi timestamp dan UUID untuk memastikan token unik
        const resetToken = crypto.randomBytes(32).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

        // Simpan token dan expiry (1 jam) di database
        await saveResetToken(user.id, resetToken);

        // Dapatkan base URL dari request untuk membuat link yang valid
        const baseUrl = request.headers.get('origin') || 
                      request.headers.get('referer') || 
                      process.env.NEXT_PUBLIC_BASE_URL || 
                      'http://localhost:3000';

        // Inisialisasi service reset password dan set baseUrl
        const resetPasswordService = new ResetPasswordWhatsappService();
        resetPasswordService.baseUrl = baseUrl;

        // Kirim link reset password ke WhatsApp user
        resetPasswordService.sendResetPasswordLink(
            user.phone,
            resetToken
        );

        // Kembalikan respons sukses
        return NextResponse.json(
            { message: 'Reset password link has been sent to your WhatsApp' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending reset password link:', error);
        return NextResponse.json(
            { message: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
