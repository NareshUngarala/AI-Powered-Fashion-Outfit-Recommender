import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Forward the query string directly to Python backend
    const queryString = searchParams.toString();
    
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    console.log(`Fetching products from: ${backendUrl}/products?${queryString}`);

    const response = await fetch(`${backendUrl}/products?${queryString}`, {
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
