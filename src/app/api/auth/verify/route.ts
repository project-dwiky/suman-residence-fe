import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/repositories/user.repository";
import { db } from '@/lib/firebase-admin';

const userCollection = db.collection('users');

/**
 * API untuk memverifikasi akun pengguna melalui link
 * Endpoint: GET /api/auth/verify
 */
export async function GET(request: NextRequest) {
    try {
        // Ambil token dari URL
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        
        if (!token) {
            // Redirect ke halaman login dengan pesan error
            return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?message=Invalid verification link`);
        }
        
        // Decode token untuk mendapatkan user ID
        let userId: string;
        try {
            userId = Buffer.from(token, 'base64').toString();
        } catch (error) {
            // Token tidak valid (tidak bisa di-decode)
            return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?message=Invalid verification token`);
        }
        
        // Ambil data user berdasarkan ID
        const user = await getUserById(userId);
        
        if (!user) {
            // User tidak ditemukan
            return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?message=User not found`);
        }
        
        // Cek jika user sudah terverifikasi
        if (user.isVerified) {
            // User sudah diverifikasi sebelumnya
            return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?message=Account already verified`);
        }
        
        // Cek jika ada user lain yang sudah terverifikasi dengan nomor telepon yang sama
        // isPhonenumAlreadyRegistered selalu mengecek isVerified=true
        // tapi kita perlu pastikan bukan user yang sedang kita verifikasi
        if (user.phone) {
            // Ambil pengguna berdasarkan nomor telepon yang sudah terverifikasi
            const verifiedPhoneUsers = await userCollection
                .where("phone", "==", user.phone)
                .where("isVerified", "==", true)
                .get();
            
            // Cek apakah ada pengguna lain (bukan user.id saat ini) dengan nomor telepon yang sama
            const otherVerifiedUser = verifiedPhoneUsers.docs.some((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.id !== user.id);
            
            if (otherVerifiedUser) {
                // Nomor telepon sudah digunakan oleh akun lain yang terverifikasi
                return NextResponse.redirect(
                    `${request.nextUrl.origin}/auth/login?message=Phone number already used by another verified account`
                );
            }
        }
        
        // Update user menjadi terverifikasi
        await updateUser(userId, { isVerified: true });
        
        // Redirect ke halaman login dengan pesan sukses
        return NextResponse.redirect(
            `${request.nextUrl.origin}/auth/login?success=Account verified successfully! You can now log in.`
        );
        
    } catch (error: any) {
        console.error('Error verifying user account:', error);
        
        // Redirect ke halaman login dengan pesan error
        return NextResponse.redirect(
            `${request.nextUrl.origin}/auth/login?message=Verification failed: ${error.message || 'Unknown error'}`
        );
    }
}
