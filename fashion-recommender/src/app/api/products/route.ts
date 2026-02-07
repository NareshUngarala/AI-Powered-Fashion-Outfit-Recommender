import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Forward the query string directly to Python backend
    const queryString = searchParams.toString();
    
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/products?${queryString}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Python backend error: ${response.statusText}`);
    }

    const products = await response.json();

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching products from Python backend:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: (error as Error).message },
      { status: 500 }
    );
  }
}
