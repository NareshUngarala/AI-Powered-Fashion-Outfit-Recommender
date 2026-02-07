import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/products/random`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch random product' }, { status: res.status });
    }

    const product = await res.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching random product:', error);
    return NextResponse.json({ error: 'Failed to fetch random product' }, { status: 500 });
  }
}
