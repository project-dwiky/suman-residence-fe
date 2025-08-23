import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface VariableCost {
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

const variableCostsCollection = db.collection('variableCosts');

// GET - Fetch all variable costs
export async function GET(request: NextRequest) {
  try {
    const snapshot = await variableCostsCollection.orderBy('tanggal', 'desc').get();
    
    const variableCosts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as VariableCost;
    });

    return NextResponse.json({
      success: true,
      variableCosts: variableCosts
    });

  } catch (error) {
    console.error('Error fetching variable costs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch variable costs',
        variableCosts: []
      },
      { status: 500 }
    );
  }
}

// POST - Create new variable cost
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
    const docRef = await variableCostsCollection.add({
      status,
      caption: caption.trim(),
      harga: Number(harga),
      tanggal,
      receiptFile: receiptFile || null,
      createdAt: now,
      updatedAt: now
    });

    // Get the created document
    const createdDoc = await variableCostsCollection.doc(docRef.id).get();
    const createdData = createdDoc.data();
    
    const newVariableCost = {
      id: docRef.id,
      ...createdData,
      createdAt: createdData?.createdAt?.toDate() || new Date(),
      updatedAt: createdData?.updatedAt?.toDate() || new Date(),
    } as VariableCost;

    return NextResponse.json({
      success: true,
      message: 'Variable cost created successfully',
      variableCost: newVariableCost
    });

  } catch (error) {
    console.error('Error creating variable cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create variable cost' 
      },
      { status: 500 }
    );
  }
}
