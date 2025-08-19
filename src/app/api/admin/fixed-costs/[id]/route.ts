import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const fixedCostsCollection = db.collection('fixedCosts');

// PUT - Update fixed cost
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, caption, harga, tanggal } = await request.json();
    const resolvedParams = await params;
    const fixedCostId = resolvedParams.id;

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

    // Check if document exists
    const docRef = fixedCostsCollection.doc(fixedCostId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Fixed cost not found' },
        { status: 404 }
      );
    }

    // Update the document
    await docRef.update({
      status,
      caption: caption.trim(),
      harga: Number(harga),
      tanggal,
      updatedAt: Timestamp.now()
    });

    // Get updated document
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    
    const updatedFixedCost = {
      id: fixedCostId,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate() || new Date(),
      updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
    };

    return NextResponse.json({
      success: true,
      message: 'Fixed cost updated successfully',
      fixedCost: updatedFixedCost
    });

  } catch (error) {
    console.error('Error updating fixed cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update fixed cost' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete fixed cost
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const fixedCostId = resolvedParams.id;

    // Check if document exists
    const docRef = fixedCostsCollection.doc(fixedCostId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Fixed cost not found' },
        { status: 404 }
      );
    }

    // Delete the document
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Fixed cost deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting fixed cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete fixed cost' 
      },
      { status: 500 }
    );
  }
}
