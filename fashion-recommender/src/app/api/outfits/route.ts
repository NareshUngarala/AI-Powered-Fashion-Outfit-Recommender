import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/outfits?userId=${userId}`);

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const outfits = await response.json();
    return NextResponse.json({ success: true, data: outfits });
  } catch (error) {
    console.error('Outfits GET error:', error);
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

    if (!body.mainProductId || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/outfits?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const newOutfit = await response.json();
    return NextResponse.json({ success: true, data: newOutfit });
  } catch (error) {
    console.error('Outfits POST error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
