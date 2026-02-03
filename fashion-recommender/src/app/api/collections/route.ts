import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Collection from '@/models/Collection';

export async function GET() {
  try {
    await connectToDatabase();
    
    const collections = await Collection.find({}).sort({ featured: -1, name: 1 });

    return NextResponse.json({ success: true, data: collections }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collections', error: (error as Error).message },
      { status: 500 }
    );
  }
}
