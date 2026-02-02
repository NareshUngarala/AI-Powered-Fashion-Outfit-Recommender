import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

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

    await connectToDatabase();
    
    const { id } = await params;
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    // Find order by ID (can be _id or orderId) and ensure it belongs to the user
    const order = await Order.findOne({
      $and: [
        { $or: [{ _id: id }, { orderId: id }] },
        { userId: userId }
      ]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Fetch order details error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order details' }, { status: 500 });
  }
}
