import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const query: any = {};

    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (tags) {
      const tagsList = tags.split(',').map(t => t.trim());
      if (tagsList.length > 0) {
        query.tags = { $in: tagsList.map(t => new RegExp(t, 'i')) };
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // If 'featured' is requested but not in schema, we might mock it or look for specific tags
    if (featured === 'true') {
        // For now, if 'featured' field doesn't exist, maybe return 'New Arrivals' or just ignore
        // Or if we added it to schema later. 
        // Let's assume we might look for a 'Featured' tag or just latest items
    }

    let productQuery = Product.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      productQuery = productQuery.limit(parseInt(limit));
    }

    const products = await productQuery;

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}
