import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    const userId = session.user.id;
    
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/outfits/${id}?userId=${userId}`, {
        method: 'DELETE',
    });

    if (response.status === 404) {
      return NextResponse.json({ message: 'Outfit not found' }, { status: 404 });
    }
    
    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: 'Outfit deleted' });
  } catch (error) {
    console.error('Outfits DELETE error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
