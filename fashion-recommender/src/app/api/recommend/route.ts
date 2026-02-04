import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product, occasion, gender } = body;

    if (!product) {
      return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, occasion, gender }),
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
    }

    const recommendation = await response.json();
    
    return NextResponse.json(recommendation);

  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
