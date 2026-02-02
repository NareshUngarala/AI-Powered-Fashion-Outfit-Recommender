import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Sort by createdAt descending to show newest first
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}
