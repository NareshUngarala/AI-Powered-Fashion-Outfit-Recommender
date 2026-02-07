import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, shippingAddress } = body;
    const userId = session.user.id;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Map frontend cart items to backend CartItemModel format
    const backendItems = items.map((item: { id?: string; productId?: string; name?: string; price?: number; image?: string; size?: string; color?: string; quantity?: number }) => ({
      productId: item.id || item.productId || '',
      name: item.name || '',
      price: item.price || 0,
      image: item.image || '',
      size: item.size || 'M',
      color: item.color || '',
      quantity: item.quantity || 1,
    }));

    // Map frontend shipping address to backend ShippingAddress format
    const backendAddress = {
      fullName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
      addressLine1: shippingAddress.streetAddress || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      postalCode: shippingAddress.pincode || '',
      country: 'India',
    };

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            items: backendItems,
            total,
            shippingAddress: backendAddress
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
