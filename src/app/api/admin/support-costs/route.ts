import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface SupportCost {
  id: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  caption: string; // Description/title
  harga: number; // Amount
  tanggal: string; // Date (YYYY-MM-DD)
  createdAt: Date;
  updatedAt: Date;
}

const supportCostsCollection = db.collection('supportCosts');

// GET - Fetch all support costs
export async function GET(request: NextRequest) {
  try {
    const snapshot = await supportCostsCollection.orderBy('tanggal', 'desc').get();
    
    const supportCosts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SupportCost;
    });

    return NextResponse.json({
      success: true,
      supportCosts: supportCosts
    });

  } catch (error) {
    console.error('Error fetching support costs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch support costs',
        supportCosts: []
      },
      { status: 500 }
    );
  }
}

// POST - Create new support cost
export async function POST(request: NextRequest) {
  try {
    const { status, caption, harga, tanggal } = await request.json();

    // Validation
    if (!caption || !caption.trim()) {
      return NextResponse.json(
        { error: 'Caption is required' },
        { status: 400 }
      );
    }

    if (!harga || harga <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (!tanggal) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    if (!['Paid', 'Pending', 'Overdue'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const now = Timestamp.now();
    const docRef = await supportCostsCollection.add({
      status,
      caption: caption.trim(),
      harga: Number(harga),
      tanggal,
      createdAt: now,
      updatedAt: now
    });

    // Get the created document
    const createdDoc = await supportCostsCollection.doc(docRef.id).get();
    const createdData = createdDoc.data();
    
    const newSupportCost = {
      id: docRef.id,
      ...createdData,
      createdAt: createdData?.createdAt?.toDate() || new Date(),
      updatedAt: createdData?.updatedAt?.toDate() || new Date(),
    } as SupportCost;

    return NextResponse.json({
      success: true,
      message: 'Support cost created successfully',
      supportCost: newSupportCost
    });

  } catch (error) {
    console.error('Error creating support cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create support cost' 
      },
      { status: 500 }
    );
  }
}
