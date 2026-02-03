import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Outfit from '@/models/Outfit';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const outfits = await Outfit.find({ userId }).sort({ createdAt: -1 });

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

    const { name, mainProductId, items, styleAdvice } = await req.json();

    if (!mainProductId || !items || !Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();
    
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const newOutfit = await Outfit.create({
      userId,
      name: name || 'My AI Outfit',
      mainProductId,
      items,
      styleAdvice
    });

    return NextResponse.json({ success: true, message: 'Outfit saved', data: newOutfit });
  } catch (error) {
    console.error('Outfits POST error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
