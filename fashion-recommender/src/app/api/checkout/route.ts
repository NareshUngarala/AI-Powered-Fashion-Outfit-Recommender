import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error: Session user type gap
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

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

    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    console.log(`Processing checkout for user ${userId} at: ${backendUrl}/checkout`);

    const response = await fetch(`${backendUrl}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            items,
            total,
            shippingAddress
        }),
    });

    if (!response.ok) throw new Error('Backend error');
    const newOrder = await response.json();

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
