import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error: Session user type gap
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/orders/${id}?userId=${userId}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        if (response.status === 404) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        throw new Error('Backend error');
    }
    const order = await response.json();

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Fetch order details error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order details' }, { status: 500 });
  }
}
