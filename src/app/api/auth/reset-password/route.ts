import { NextRequest, NextResponse } from "next/server";
import { getResetToken, isTokenValid, markTokenAsUsed } from "@/models/reset-token.model";
import { getUserById } from "@/repositories/user.repository";
import admin from 'firebase-admin';

/**
 * API untuk melakukan reset password
 * Endpoint: POST /api/auth/reset-password
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { message: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Validasi password
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Cari token di database
        console.log('POST reset-password - Token:', token);
        const resetToken = await getResetToken(token);
        console.log('Reset token found:', !!resetToken);
        
        if (!resetToken) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        // Cek token masih valid (belum expire)
        const isValid = isTokenValid(resetToken);
        console.log('Is token valid:', isValid);
        
        if (!isValid) {
            return NextResponse.json(
                { message: 'Token has expired. Please request a new reset password link.' },
                { status: 400 }
            );
        }

        // Ambil data user
        const user = await getUserById(resetToken.userId);
        console.log('User found for reset password:', !!user);
        
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Update password di Firebase Authentication
        try {
            await admin.auth().updateUser(resetToken.userId, {
                password: password,
            });
        } catch (error) {
            console.error('Error updating user password:', error);
            return NextResponse.json(
                { message: 'Failed to update password. Please try again.' },
                { status: 500 }
            );
        }

        // Tandai token sebagai sudah digunakan
        await markTokenAsUsed(token);

        // Kembalikan respons sukses
        return NextResponse.json(
            { message: 'Password has been reset successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { message: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}

/**
 * API untuk memvalidasi token reset password
 * Endpoint: GET /api/auth/reset-password
 */
export async function GET(request: NextRequest) {
    try {
        // Ambil token dari URL
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        
        console.log('GET reset-password - Token received:', token);

        if (!token) {
            console.log('Token missing in request');
            return NextResponse.json(
                { valid: false, message: 'Token is missing' },
                { status: 400 }
            );
        }

        // Cari token di database
        console.log('Searching for token in database:', token);
        const resetToken = await getResetToken(token);
        console.log('Database result:', resetToken);
        
        if (!resetToken) {
            console.log('Token not found in database');
            return NextResponse.json(
                { valid: false, message: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        // Cek token masih valid (belum expire)
        const valid = isTokenValid(resetToken);
        console.log('Is token valid:', valid);
        
        return NextResponse.json(
            { 
                valid, 
                message: valid ? 'Token is valid' : 'Token has expired'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error validating reset password token:', error);
        return NextResponse.json(
            { valid: false, message: 'An error occurred while validating token' },
            { status: 500 }
        );
    }
}
