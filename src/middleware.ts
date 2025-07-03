import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard', 
  '/profile',
  '/booking',
  '/admin'
];

// Paths that require admin role
const ADMIN_PATHS = [
  '/admin'
];

// API paths that should be excluded from middleware
const EXCLUDED_PATHS = [
  '/api/', // API routes
  '/_next/', // Next.js static files
  '/static/', // Static files
  '/images/', // Image files
  '/favicon.ico', // Favicon
  '/robots.txt' // Robots file
];

// Auth-related paths that don't need protection
const AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

// Helper to check if path needs authentication
const needsAuthentication = (path: string): boolean => {
  // Check if path is in protected paths or admin paths
  return PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath)) || 
         ADMIN_PATHS.some(adminPath => path.startsWith(adminPath));
};

// Helper to check if path requires admin role
const needsAdminRole = (path: string): boolean => {
  return ADMIN_PATHS.some(adminPath => path.startsWith(adminPath));
};

// Helper to check if path should be completely excluded from middleware processing
const shouldExcludePath = (path: string): boolean => {
  return EXCLUDED_PATHS.some(excludedPath => path.startsWith(excludedPath)) ||
         AUTH_PATHS.some(authPath => path === authPath);
};

// Middleware function
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  
  // Skip excluded paths (API routes, static files, etc.) and auth paths
  if (shouldExcludePath(path)) {
    return NextResponse.next();
  }

  // Skip paths that don't need authentication
  if (!needsAuthentication(path)) {
    return NextResponse.next();
  }
  console.log('Middleware called for path:', path);
  // Create a response to eventually return
  const response = NextResponse.next();
  
 
  console.log('Refresh token exists:', !!request.cookies.get('refresh_token')?.value);
  console.log('Access token exists:', !!request.cookies.get('access_token')?.value);

  try {
    const origin = request.nextUrl.origin;
    const refreshResponse = await fetch(`${origin}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });
    
    // Copy all cookies from the refresh response to our response
    const cookies = refreshResponse.headers.getSetCookie();
    for (const cookie of cookies) {
      response.headers.append('Set-Cookie', cookie);
    }
    
    // If refresh token is invalid, redirect to login with message and original path
    if (!refreshResponse.ok) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('message', 'Please log in to continue');
      loginUrl.searchParams.set('redirectTo', path); // Add original path for redirect after login
      return NextResponse.redirect(loginUrl);
    }

    // Step 2: Check user role if needed (for admin paths)
    if (needsAdminRole(path)) {
      // Extract the Set-Cookie headers from the refresh response
      const refreshCookies = refreshResponse.headers.getSetCookie().join('; ');
      
      const meResponse = await fetch(`${origin}/api/auth/me`, {
        headers: {
          // Use the new cookies from the refresh response
          'Cookie': refreshCookies || request.headers.get('cookie') || '',
        },
      });

      if (!meResponse.ok) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('message', 'Authentication failed');
        loginUrl.searchParams.set('redirectTo', path); // Add original path for redirect after login
        return NextResponse.redirect(loginUrl);
      }

      const userData = await meResponse.json();
      
      // Check if user has admin role
      if (userData?.role !== 'admin') {
        // Redirect to dashboard with unauthorized message
        const dashboardUrl = new URL('/dashboard', request.url);
        dashboardUrl.searchParams.set('message', 'You do not have permission to access the admin area');
        return NextResponse.redirect(dashboardUrl);
      }
    }
    
    // User is authenticated and has proper permissions
    return response;
  } catch (error) {
    console.error('Error in middleware authentication flow:', error);
    
    // Redirect to login with error message on any error
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('message', 'An error occurred, please log in again');
    loginUrl.searchParams.set('redirectTo', path); // Add original path for redirect after login
    return NextResponse.redirect(loginUrl);
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. Static files (images, favicon, etc)
     */
    '/((?!api|_next|static|public|images|assets|favicon.ico|robots.txt).*)',
  ],
};
