import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import PaymentMethod from '@/models/PaymentMethod';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const methods = await PaymentMethod.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: methods });
  } catch (error) {
    console.error('Payments GET error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { cardNumber, expiryMonth, expiryYear, cardHolderName, cardType } = await req.json();

    if (!cardNumber || !expiryMonth || !expiryYear || !cardHolderName) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await connectToDatabase();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;
    const last4 = cardNumber.slice(-4);

    const newMethod = await PaymentMethod.create({
      userId,
      last4,
      expiryMonth,
      expiryYear,
      cardHolderName,
      cardType: cardType || 'Visa', // Default or derived
      isDefault: false, // Logic for default can be added later
    });

    return NextResponse.json({ success: true, message: 'Payment method added', data: newMethod });
  } catch (error) {
    console.error('Payments POST error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Payment method ID required' }, { status: 400 });
    }

    await connectToDatabase();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    // Ensure user owns the payment method
    const deleted = await PaymentMethod.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ message: 'Payment method not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Payment method removed' });
  } catch (error) {
    console.error('Payments DELETE error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
