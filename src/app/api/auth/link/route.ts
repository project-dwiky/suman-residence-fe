import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/repositories/user.repository";
import confirmationLinkWhatsappService from "@/services/confirmation-link-whatsapp.service";

/**
 * API handler untuk mengirim ulang link konfirmasi ke pengguna
 * Endpoint: POST /api/auth/link
 */
export async function POST(request: NextRequest) {
    try {
        // Ambil email dari request body
        const { email } = await request.json();
        
        if (!email) {
            return NextResponse.json({
                status: 'error',
                code: 'MISSING_EMAIL',
                message: 'Email is required'
            }, { status: 400 });
        }
        
        // Cari user berdasarkan email
        const user = await getUserByEmail(email);
        
        // Jika user tidak ditemukan
        if (!user) {
            return NextResponse.json({
                status: 'error',
                code: 'USER_NOT_FOUND',
                message: 'User with this email does not exist'
            }, { status: 404 });
        }
        
        // Jika user sudah terverifikasi
        if (user.isVerified) {
            return NextResponse.json({
                status: 'error',
                code: 'ALREADY_VERIFIED',
                message: 'This account is already verified'
            }, { status: 400 });
        }
        
        // Dapatkan baseUrl dari request
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host') || '';
        const baseUrl = `${protocol}://${host}`;
        
        // Set baseUrl dan kirim ulang link konfirmasi
        confirmationLinkWhatsappService.setBaseUrl(baseUrl);
        
        // Kirim ulang link konfirmasi ke WhatsApp
        const linkSent = await confirmationLinkWhatsappService.resendConfirmationLink(
            user.phone,
            user.id
        );
        
        if (!linkSent) {
            return NextResponse.json({
                status: 'error',
                code: 'FAILED_TO_SEND_LINK',
                message: 'Failed to send confirmation link. Please try again later.'
            }, { status: 500 });
        }
        
        // Berhasil mengirim link konfirmasi
        return NextResponse.json({
            status: 'success',
            code: 'LINK_SENT',
            message: 'Confirmation link has been sent to your WhatsApp'
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error sending confirmation link:', error);
        
        return NextResponse.json({
            status: 'error',
            code: 'SERVER_ERROR',
            message: error.message || 'An unexpected error occurred'
        }, { status: 500 });
    }
}
