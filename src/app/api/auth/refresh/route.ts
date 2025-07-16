import { NextRequest, NextResponse } from 'next/server';
import { refreshToken } from '@/services/auth/auth.service';

export async function POST(req: NextRequest) {
  try {
    // Create a response object for refreshToken to modify with cookies
    console.log('[Refresh Token API] Refresh token called');
    console.log('[Refresh Token API] Access token exists:', req.cookies.get('access_token')?.value);
    console.log('[Refresh Token API] Refresh token exists:', req.cookies.get('refresh_token')?.value);
    const res = NextResponse.json({ success: true });
    const success = await refreshToken(req, res);
    console.log('[Refresh Token API] Refresh token success:', success);
    if (success) {
      // Create a new response to ensure all cookies are properly set
      const finalResponse = NextResponse.json({ success: true });
      
      // Copy all cookies from the original response to the final response
      res.headers.getSetCookie().forEach(cookie => {
        finalResponse.headers.append('Set-Cookie', cookie);
      });
      
      return finalResponse;
    } else {
      // If refresh failed, return a response with cleared cookies
      // These cookies are already cleared by refreshToken function
      const failedResponse = NextResponse.json(
        { success: false, message: 'Token refresh failed' },
        { status: 401 }
      );
      
      // Copy any cookie clearing headers
      res.headers.getSetCookie().forEach(cookie => {
        failedResponse.headers.append('Set-Cookie', cookie);
      });
      
      return failedResponse;
    }
  } catch (error) {
    console.error('[Refresh Token API] Error in token refresh API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
