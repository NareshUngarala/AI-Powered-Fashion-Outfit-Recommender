import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Cart from '@/models/Cart';

// Helper to get user ID from session
async function getUserId() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error: Session user type gap
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  // @ts-expect-error: Session user type gap
  return session.user.id;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const body = await req.json();
    const { productId, quantity, size, color, name, price, image } = body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemIndex = cart.items.findIndex((item: any) => 
      item.productId.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, size, color, name, price, image });
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  await connectToDatabase();
  try {
    const { productId, size, color, quantity } = await req.json();
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemIndex = cart.items.findIndex((item: any) => 
      item.productId.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      return NextResponse.json({ success: true, data: cart });
    }
    
    return NextResponse.json({ success: false, message: 'Item not found in cart' }, { status: 404 });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });

    const initialLength = cart.items.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cart.items = cart.items.filter((item: any) => 
      !(item.productId.toString() === productId && 
        (item.size || '') === (size || '') && 
        (item.color || '') === (color || ''))
    );

    if (cart.items.length === initialLength) {
       // Try looser match if explicit match failed (sometimes null vs undefined)
       // But keeping it strict is safer.
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
     console.error('Cart delete error:', error);
     return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
