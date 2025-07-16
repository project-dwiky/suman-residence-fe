import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/services/auth/auth.service";

// GET request to handle logout
export async function GET(request: NextRequest) {
    try {
        // Create a response object
        const response = NextResponse.json({});
        
        // Call the logout service to remove auth cookies
        await logoutUser(response);
        
        return response;
    } catch (error: any) {
        console.error('Logout failed:', error);
        // If there's an error during logout, redirect to home page anyway
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
