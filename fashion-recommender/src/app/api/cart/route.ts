import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function GET(_req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`http://localhost:8000/cart/${userId}`, {
        cache: 'no-store'
    });

    if (!response.ok) throw new Error('Backend error');
    const cart = await response.json();

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

  try {
    const body = await req.json();
    
    const response = await fetch(`http://localhost:8000/cart/${userId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Backend error');
    const cart = await response.json();

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
  
  try {
    const body = await req.json();
    
    // Pass minimal data for update, relying on Python to handle optional fields
    const payload = {
        productId: body.productId,
        quantity: body.quantity,
        size: body.size,
        color: body.color,
        // Provide defaults if needed by Pydantic strict mode, but Optional fields should be fine
    };

    const response = await fetch(`http://localhost:8000/cart/${userId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error('Backend error');
    const cart = await response.json();

    return NextResponse.json({ success: true, data: cart });
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
  
    try {
      const { searchParams } = new URL(req.url);
      const productId = searchParams.get('productId');
      const size = searchParams.get('size') || undefined;
      const color = searchParams.get('color') || undefined;

      if (!productId) return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });

      const query = new URLSearchParams({ productId });
      if (size) query.append('size', size);
      if (color) query.append('color', color);

      const response = await fetch(`http://localhost:8000/cart/${userId}/item?${query.toString()}`, {
          method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Backend error');
      const cart = await response.json();
  
      return NextResponse.json({ success: true, data: cart });
    } catch (error) {
      console.error('Cart delete error:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete cart item' }, { status: 500 });
    }
}
