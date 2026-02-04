import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(`http://localhost:8000/products/${id}`, {
      cache: 'no-store'
    });

    if (response.status === 404) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Python backend error: ${response.statusText}`);
    }

    const product = await response.json();

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching product from Python backend:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product', error: (error as Error).message },
      { status: 500 }
    );
  }
}
