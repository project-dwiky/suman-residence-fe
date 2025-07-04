import { auth } from '@/lib/firebase-admin';
import { getUserById, createUser, getUserByEmail, findByPhonenum } from '@/repositories/user.repository';
import { RegisterData, RegisterResponse, User, UserCredentials } from '@/types/user';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Constants
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 0.5; // 12 hours

// JWT secrets - should be in env variables in production
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'suman-residence-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'suman-residence-refresh-secret';

// Generate JWT tokens
const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_MAX_AGE }
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_MAX_AGE }
  );
};


// Helper functions to manage cookies
const setAuthCookies = (res: NextResponse, accessToken: string, refreshToken: string): void => {
  // Set access token cookie (shorter lived)
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
    res,
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true
  });
  
  // Set refresh token cookie (longer lived)
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    res,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true
  });
};

const removeAuthCookies = (res: NextResponse): void => {
  deleteCookie(ACCESS_TOKEN_COOKIE, { res, path: '/' });
  deleteCookie(REFRESH_TOKEN_COOKIE, { res, path: '/' });
};


// Check if phone number is already registered
export async function isPhonenumAlreadyRegistered(phonenum: string): Promise<boolean> {
  try {
    const user = await findByPhonenum(phonenum);
    return !!user; // Returns true if user exists, false otherwise
  } catch (error) {
    console.error('Error checking phone number:', error);
    throw error;
  }
}

// Main authentication functions
export async function registerUser(userData: RegisterData): Promise<RegisterResponse> {
  try {
    // Check if email already exists
    const user = await getUserByEmail(userData.email);
    if(user) {
      return {
        status: 'error',
        message: 'Email already registered'
      };
    }
    
    // Check if phone number already exists
    const isPhoneRegistered = await isPhonenumAlreadyRegistered(userData.phone);
    if(isPhoneRegistered) {
      return {
        status: 'error',
        message: 'Phone number already registered'
      };
    }
    
    // Create Firebase user with Admin SDK
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name,
    });
    
    // Create the user document in Firestore with default role as customer
    await createUser(userRecord.uid, {
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      role: 'customer', // Default role is always customer
    });
    
    // Just return success status, no tokens or user data
    return {
      status: 'success',
      message: 'User registered successfully'
    };
  } catch (error: any) {
    console.error('Registration failed:', error.message);
    return {
      status: 'error',
      message: error.message || 'Registration failed'
    };
  }
}

export async function loginUser(credentials: UserCredentials, res: NextResponse): Promise<User> {
  try {
    // Validate credentials against Firebase Auth (only for validation)
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('Firebase API key is missing');
    }
    
    // Call the Firebase Auth REST API just for validation
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          returnSecureToken: true
        })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Authentication failed');
    }
    
    // Get the user ID from the response
    const { localId } = data;
    
    // Get user from Firestore
    const user = await getUserById(localId);
    if (!user) {
      throw new Error('User data not found in database');
    }
    
    // Generate our own tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    
    // Set both auth cookies
    setAuthCookies(res, accessToken, refreshToken);
    
    return user;
  } catch (error: any) {
    console.error('Login failed:', error.message);
    throw Error(error.message);
  }
}

export async function logoutUser(res: NextResponse): Promise<void> {
  try {
    removeAuthCookies(res);
  } catch (error: any) {
    console.error('Logout failed:', error.message);
    throw error;
  }
}

// Simple token verification
export async function verifyAuthToken(token: string): Promise<User | null> {
  try {
    // Simple JWT verification
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };
    return await getUserById(decoded.userId);
  } catch (error) {
    return null;
  }
}

// Cookie-based authentication check
export async function checkAuthFromCookie(req: NextRequest): Promise<User | null> {
  // Try using access token first
  const accessToken = await getCookie(ACCESS_TOKEN_COOKIE, { req }) as string | undefined;
  console.log('[Auth Service checkAuthFromCookie] Access Token Cookie:', accessToken);
  if (accessToken) {
    try {
      return await verifyAuthToken(accessToken);
    } catch (error) {
      // Access token is invalid, try refresh flow
      console.log('Access token invalid, will attempt refresh flow');
    }
  }
  
  // No valid access token found
  return null;
}

// Get current user with token refresh capabilities
export async function getCurrentUser(req: NextRequest): Promise<User | null> {
  // Try to get user from access token first
  const user = await checkAuthFromCookie(req);
  console.log('[Auth Service] Current user:', user);
  if (user) {
    return user;
  }
  return null;
}

// Simple token refresh function
export async function refreshToken(req: NextRequest, res: NextResponse): Promise<boolean> {
  try {
    // Get refresh token from cookie
    const refreshToken = await getCookie(REFRESH_TOKEN_COOKIE, { req }) as string | undefined;
    console.log('[Auth Service] Refresh token:', refreshToken);
    if (!refreshToken) {
      removeAuthCookies(res);
      return false;
    }
    
    try {
      // Decode the token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      
      // Get user data
      const user = await getUserById(decoded.userId);
      if (!user) {
        removeAuthCookies(res);
        return false;
      }
      
      // Generate new tokens
      const accessToken = generateAccessToken(user.id, user.role);
      const newRefreshToken = generateRefreshToken(user.id);
      
      // Set cookies
      setAuthCookies(res, accessToken, newRefreshToken);
      return true;
    } catch {
      // Invalid token, clear cookies
      removeAuthCookies(res);
      return false;
    }
  } catch (error) {
    // Error in refresh flow
    removeAuthCookies(res);
    return false;
  }
}
