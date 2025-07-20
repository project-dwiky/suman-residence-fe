import { db } from '@/lib/firebase-admin';
import { Tenant } from '@/models';
import * as admin from 'firebase-admin';

export class TenantRepository {
  private collectionName = 'tenants';

  async getAllTenants(): Promise<Tenant[]> {
    try {
      const tenantsRef = db.collection(this.collectionName);
      const snapshot = await tenantsRef.orderBy('name').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Tenant[];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw new Error('Failed to fetch tenants');
    }
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Tenant;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw new Error('Failed to fetch tenant');
    }
  }

  async getTenantByEmail(email: string): Promise<Tenant | null> {
    try {
      const tenantsRef = db.collection(this.collectionName);
      const snapshot = await tenantsRef.where('email', '==', email).limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Tenant;
    } catch (error) {
      console.error('Error fetching tenant by email:', error);
      throw new Error('Failed to fetch tenant by email');
    }
  }

  async getTenantByPhone(phone: string): Promise<Tenant | null> {
    try {
      const tenantsRef = db.collection(this.collectionName);
      const snapshot = await tenantsRef.where('phone', '==', phone).limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Tenant;
    } catch (error) {
      console.error('Error fetching tenant by phone:', error);
      throw new Error('Failed to fetch tenant by phone');
    }
  }

  async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = admin.firestore.Timestamp.now();
      const docRef = await db.collection(this.collectionName).add({
        ...tenantData,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw new Error('Failed to create tenant');
    }
  }

  async updateTenant(id: string, updates: Partial<Omit<Tenant, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      await docRef.update({
        ...updates,
        updatedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw new Error('Failed to update tenant');
    }
  }

  async deleteTenant(id: string): Promise<void> {
    try {
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw new Error('Failed to delete tenant');
    }
  }

  async searchTenants(query: string): Promise<Tenant[]> {
    try {
      const tenantsRef = db.collection(this.collectionName);
      
      // Firebase doesn't support full-text search, so we'll do a simple name search
      // For better search, consider using Algolia or similar service
      const snapshot = await tenantsRef
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Tenant[];
    } catch (error) {
      console.error('Error searching tenants:', error);
      throw new Error('Failed to search tenants');
    }
  }
}
