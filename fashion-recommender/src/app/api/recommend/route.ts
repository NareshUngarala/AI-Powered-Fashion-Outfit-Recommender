import { NextRequest, NextResponse } from 'next/server';
import { getOutfitRecommendation } from '@/lib/ai-stylist';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product } = body;

    if (!product) {
      return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
    }

    const recommendation = await getOutfitRecommendation(product);
    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
