import { NextRequest } from "next/server";
import { getCurrentUser } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        console.log("[Me Route] GET request received");
        console.log("[Me Route] Access Token Cookie:", request.cookies.get('access_token')?.value);
        console.log("[Me Route] Refresh Token Cookie:", request.cookies.get('refresh_token')?.value);
        // Get user from current token - middleware already handles refresh
        const user = await getCurrentUser(request);
        
        // If no user found, return unauthorized
        if (!user) {
            return NextResponse.json({ 
                error: 'Unauthorized',
                message: 'You are not logged in or your session has expired'
            }, { status: 401 });
        }
        
        // Return full user object with normalized role field
        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role || 'customer', // Ensure role is always present
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message || 'An unexpected error occurred'
        }, { status: 500 });
    }
}
