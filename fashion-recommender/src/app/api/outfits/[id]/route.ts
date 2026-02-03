import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Outfit from '@/models/Outfit';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();
    
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const deleted = await Outfit.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ message: 'Outfit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Outfit deleted' });
  } catch (error) {
    console.error('Outfits DELETE error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
