import { registerUser } from "@/services/auth/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { RegisterData } from "@/types/user";
import { getUserByEmail } from "@/repositories/user.repository";
import confirmationLinkWhatsappService from "@/services/auth/confirmation-link-whatsapp.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const payload: RegisterData = body;
        
        // Register the user
        const result = await registerUser(payload);
        
        if(result.status === 'error') {
            return NextResponse.json(result, {status: 400});
        }
        
        // Get newly created user to send confirmation link
        if (result.code === 'REGISTRATION_SUCCESS') {
            const user = await getUserByEmail(payload.email);
            
            if (user && user.id) {
                // Dapatkan baseUrl dari request
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const host = request.headers.get('host') || '';
                const baseUrl = `${protocol}://${host}`;
                
                // Set baseUrl dan kirim link konfirmasi
                confirmationLinkWhatsappService.setBaseUrl(baseUrl);
                confirmationLinkWhatsappService.sendConfirmationLink(user);
            }
        }
        
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Error in registration:', error);
        return NextResponse.json({
            status: 'error',
            code: 'SERVER_ERROR',
            message: error.message || 'An unexpected error occurred'
        }, { status: 500 });
    }
}