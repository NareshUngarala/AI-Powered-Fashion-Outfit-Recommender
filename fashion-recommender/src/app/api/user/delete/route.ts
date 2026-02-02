import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    await User.findByIdAndDelete(userId);
    // Optional: Delete related data like orders, wishlist, etc.
    // For now, we keep it simple.

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
