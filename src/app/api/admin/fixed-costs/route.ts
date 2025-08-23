import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface FixedCost {
  id: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  caption: string; // Description/title
  harga: number; // Amount
  tanggal: string; // Date (YYYY-MM-DD)
  receiptFile?: {
    url: string;
    fileName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const fixedCostsCollection = db.collection('fixedCosts');

// GET - Fetch all fixed costs
export async function GET(request: NextRequest) {
  try {
    const snapshot = await fixedCostsCollection.orderBy('tanggal', 'desc').get();
    
    const fixedCosts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FixedCost;
    });

    return NextResponse.json({
      success: true,
      fixedCosts: fixedCosts
    });

  } catch (error) {
    console.error('Error fetching fixed costs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch fixed costs',
        fixedCosts: []
      },
      { status: 500 }
    );
  }
}

// POST - Create new fixed cost
export async function POST(request: NextRequest) {
  try {
    const { status, caption, harga, tanggal, receiptFile } = await request.json();

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
    const docRef = await fixedCostsCollection.add({
      status,
      caption: caption.trim(),
      harga: Number(harga),
      tanggal,
      receiptFile: receiptFile || null,
      createdAt: now,
      updatedAt: now
    });

    // Get the created document
    const createdDoc = await fixedCostsCollection.doc(docRef.id).get();
    const createdData = createdDoc.data();
    
    const newFixedCost = {
      id: docRef.id,
      ...createdData,
      createdAt: createdData?.createdAt?.toDate() || new Date(),
      updatedAt: createdData?.updatedAt?.toDate() || new Date(),
    } as FixedCost;

    return NextResponse.json({
      success: true,
      message: 'Fixed cost created successfully',
      fixedCost: newFixedCost
    });

  } catch (error) {
    console.error('Error creating fixed cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create fixed cost' 
      },
      { status: 500 }
    );
  }
}
