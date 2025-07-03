import { db } from '@/lib/firebase-admin';
import { User, UserUpdate } from '@/types/user';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION_NAME = 'users';
const userCollection = db.collection(COLLECTION_NAME);

export async function createUser(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  try {
    // Prepare user data with timestamps
    const userToSave = {
      ...user,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    // Save to Firestore
    await userCollection.doc(id).set(userToSave);
    
    return {
      ...userToSave,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = userCollection.doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      if (!data) return null;
      
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const snapshot = await userCollection.where("email", "==", email).get();
    
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      const data = docData.data();
      return {
        ...data,
        id: docData.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const snapshot = await userCollection.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as User;
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

export async function updateUser(id: string, userData: UserUpdate): Promise<User> {
  try {
    const userRef = userCollection.doc(id);
    const updateData = {
      ...userData,
      updatedAt: FieldValue.serverTimestamp()
    };
    
    await userRef.update(updateData);
    
    // Get updated user
    const updatedUser = await getUserById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await userCollection.doc(id).delete();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
