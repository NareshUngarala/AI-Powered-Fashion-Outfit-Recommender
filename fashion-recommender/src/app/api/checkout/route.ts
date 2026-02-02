import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error: Session user type gap
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    const { items, total, shippingAddress } = body;
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // 1. Create Order record in DB
    const orderId = `#ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    const newOrder = await Order.create({
      userId,
      orderId,
      items,
      total,
      shippingAddress,
      status: 'Processing', // Default status
      paymentMethod: 'Credit Card (Mock)'
    });

    // 2. Clear user's cart
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'Checkout failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}
