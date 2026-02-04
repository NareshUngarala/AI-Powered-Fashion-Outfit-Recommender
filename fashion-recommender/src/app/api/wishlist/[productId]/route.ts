import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;
    const { productId } = await params;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/wishlist/${userId}/remove/${productId}`, {
        method: 'DELETE',
    });

    if (!response.ok) throw new Error('Backend error');

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
