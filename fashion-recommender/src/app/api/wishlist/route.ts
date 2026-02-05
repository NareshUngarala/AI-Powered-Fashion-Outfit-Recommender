import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID missing' }, { status: 401 });
    }
    
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    console.log(`Fetching wishlist for user ${userId} from: ${backendUrl}/wishlist/${userId}`);

    const response = await fetch(`${backendUrl}/wishlist/${userId}`, {
        cache: 'no-store'
    });
    
    if (!response.ok) throw new Error('Backend error');
    const wishlist = await response.json();

    return NextResponse.json({ success: true, data: wishlist.products || [] });
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

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID missing' }, { status: 401 });
    }

    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    console.log(`Adding to wishlist for user ${userId} at: ${backendUrl}/wishlist/${userId}/add`);

    const response = await fetch(`${backendUrl}/wishlist/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }), // Note: Python expects Body(..., embed=True) which usually means { "productId": "..." }
    });

    if (!response.ok) throw new Error('Backend error');

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
