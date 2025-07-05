import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface ResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

const COLLECTION_NAME = 'resetTokens';
const resetTokenCollection = db.collection(COLLECTION_NAME);

/**
 * Menyimpan token reset password ke database
 */
export async function saveResetToken(userId: string, token: string): Promise<ResetToken> {
  try {
    // Set expiry time 1 jam dari sekarang
    const now = new Date();
    const expiresAt = new Date(now.getTime());
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    console.log('Creating token with:');
    console.log('- Current time:', now);
    console.log('- Expires at:', expiresAt);
    console.log('- Expiry in minutes:', (expiresAt.getTime() - now.getTime()) / (1000 * 60));
    
    const resetToken: ResetToken = {
      userId,
      token,
      expiresAt,
      createdAt: now,
      used: false
    };
    
    // Simpan ke Firestore, dengan timestamp yang tepat
    // createdAt menggunakan serverTimestamp, tapi expiresAt harus waktu spesifik 1 jam dari sekarang
    await resetTokenCollection.add({
      userId,
      token,
      // Simpan expiresAt sebagai timestamp dengan nilai 1 jam dari sekarang
      expiresAt,
      // Untuk createdAt, gunakan serverTimestamp
      createdAt: FieldValue.serverTimestamp(),
      used: false
    });
    
    return resetToken;
  } catch (error) {
    console.error('Error saving reset token:', error);
    throw error;
  }
}

/**
 * Mendapatkan token reset password berdasarkan token
 */
export async function getResetToken(token: string): Promise<ResetToken | null> {
  try {
    console.log('Looking for token in database:', token);
    
    const snapshot = await resetTokenCollection
      .where('token', '==', token)
      .where('used', '==', false)
      .get();
    
    console.log('Query results:', snapshot.size, 'documents');
    
    if (snapshot.empty) {
      console.log('No matching documents found');
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    console.log('Document data:', data);
    
    // Handle Firestore timestamps properly
    let expiresAt = data.expiresAt;
    let createdAt = data.createdAt;
    
    // Convert to Date objects if they are Firestore timestamps
    if (data.expiresAt && typeof data.expiresAt.toDate === 'function') {
      expiresAt = data.expiresAt.toDate();
    } else if (data.expiresAt) {
      // Handle case where it might be stored as a string or timestamp
      expiresAt = new Date(data.expiresAt);
    }
    
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      createdAt = data.createdAt.toDate();
    } else if (data.createdAt) {
      createdAt = new Date(data.createdAt);
    }
    
    const resetToken = {
      userId: data.userId,
      token: data.token,
      expiresAt: expiresAt,
      createdAt: createdAt,
      used: data.used
    } as ResetToken;
    
    console.log('Parsed reset token:', resetToken);
    return resetToken;
  } catch (error) {
    console.error('Error getting reset token:', error);
    throw error;
  }
}

/**
 * Memeriksa apakah token masih valid (belum kadaluarsa)
 */
export function isTokenValid(token: ResetToken): boolean {
  const now = new Date();
  
  console.log('Checking token validity:');
  console.log('- Token expiresAt:', token.expiresAt);
  console.log('- Current time:', now);
  console.log('- Token used:', token.used);
  console.log('- Time comparison (expiresAt > now):', token.expiresAt > now);
  

  return token.expiresAt > now && !token.used;
}

/**
 * Menandai token sebagai sudah digunakan
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  try {
    const snapshot = await resetTokenCollection
      .where('token', '==', token)
      .get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({
        used: true,
        updatedAt: FieldValue.serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error marking token as used:', error);
    throw error;
  }
}
