import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;
    
    const wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: wishlist.products });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
    }

    await connectToDatabase();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [productId] });
    } else {
      // Add if not exists
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
