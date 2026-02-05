import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/collections`);
    
    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const collections = await response.json();
    return NextResponse.json({ success: true, data: collections });
  } catch (error: unknown) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collections', error: (error as Error).message },
      { status: 500 }
    );
  }
}
