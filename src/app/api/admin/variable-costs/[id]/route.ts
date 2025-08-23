import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const variableCostsCollection = db.collection('variableCosts');

// PUT - Update variable cost
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, caption, harga, tanggal, receiptFile } = await request.json();
    const resolvedParams = await params;
    const variableCostId = resolvedParams.id;

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
    const docRef = variableCostsCollection.doc(variableCostId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Variable cost not found' },
        { status: 404 }
      );
    }

    // Update the document
    await docRef.update({
      status,
      caption: caption.trim(),
      harga: Number(harga),
      tanggal,
      receiptFile: receiptFile || null,
      updatedAt: Timestamp.now()
    });

    // Get updated document
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    
    const updatedVariableCost = {
      id: variableCostId,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate() || new Date(),
      updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
    };

    return NextResponse.json({
      success: true,
      message: 'Variable cost updated successfully',
      variableCost: updatedVariableCost
    });

  } catch (error) {
    console.error('Error updating variable cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update variable cost' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete variable cost
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const variableCostId = resolvedParams.id;

    // Check if document exists
    const docRef = variableCostsCollection.doc(variableCostId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Variable cost not found' },
        { status: 404 }
      );
    }

    // Delete the document
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Variable cost deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting variable cost:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete variable cost' 
      },
      { status: 500 }
    );
  }
}
