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

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/payments?userId=${userId}`);

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const methods = await response.json();
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

    const body = await req.json();
    const { cardNumber, expiryMonth, expiryYear, cardHolderName } = body;

    if (!cardNumber || !expiryMonth || !expiryYear || !cardHolderName) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/payments?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const newMethod = await response.json();
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

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/payments/${id}?userId=${userId}`, {
        method: 'DELETE',
    });

    if (response.status === 404) {
      return NextResponse.json({ message: 'Payment method not found' }, { status: 404 });
    }

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: 'Payment method removed' });
  } catch (error) {
    console.error('Payments DELETE error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
