import { NextRequest, NextResponse } from 'next/server';
import { getOutfitRecommendation } from '@/lib/ai-stylist';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, occasion, gender } = body;

    if (!product) {
      return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
    }

    // 1. Get AI recommendations
    const recommendation = await getOutfitRecommendation(product, occasion, gender);

    // 2. Enhance with real products from DB
    await connectToDatabase();

    const enhancedItems = await Promise.all(recommendation.items.map(async (item) => {
      // Map AI category to our DB categories
      const mappedCategory = mapCategory(item.category);
      
      // Build query to find matching product
      const query = {
        _id: { $ne: product._id }, // Don't recommend the same product
        category: mappedCategory
      };

      // Try to find a product that matches name or color description
      // using regex for loose matching
      const keywords = `${item.color} ${item.name}`.split(' ').filter(w => w.length > 3);
      const keywordConditions = keywords.map(k => ({
         $or: [
             { name: { $regex: k, $options: 'i' } },
             { description: { $regex: k, $options: 'i' } }
         ]
      }));

      let match;
      
      if (keywordConditions.length > 0) {
          match = await Product.findOne({
              ...query,
              $or: keywordConditions
          });
      }

      // Fallback: Just get any product in that category if specific match fails
      if (!match) {
          match = await Product.findOne(query);
      }

      if (match) {
        return {
          ...item,
          id: match._id,
          name: match.name, // Use real product name
          price: match.price,
          image: match.imageUrl,
          originalSuggestion: item.name // Keep AI's original suggestion idea
        };
      }

      // No match in DB, return generic info with placeholders
      return {
        ...item,
        id: 'generic-' + Math.random().toString(36).substr(2, 9),
        price: 0,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200" // Generic fashion placeholder
      };
    }));

    return NextResponse.json({
      ...recommendation,
      items: enhancedItems
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}

function mapCategory(aiCat: string) {
    const cat = aiCat.toLowerCase();
    if (cat.includes('pant') || cat.includes('jeans') || cat.includes('trousers') || cat.includes('chino') || cat.includes('bottom')) return 'Bottoms';
    if (cat.includes('shirt') || cat.includes('tee') || cat.includes('top') || cat.includes('blouse') || cat.includes('sweater')) return 'Tops';
    if (cat.includes('shoe') || cat.includes('sneaker') || cat.includes('boot') || cat.includes('loafer') || cat.includes('footwear')) return 'Footwear';
    if (cat.includes('jacket') || cat.includes('coat') || cat.includes('vest') || cat.includes('blazer') || cat.includes('outerwear')) return 'Outerwear';
    if (cat.includes('bag') || cat.includes('purse') || cat.includes('tote')) return 'Bags';
    return 'Accessories'; // Default
}
