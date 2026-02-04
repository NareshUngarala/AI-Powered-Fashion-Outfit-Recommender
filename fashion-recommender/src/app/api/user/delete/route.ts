import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;
    
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/delete?userId=${userId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        return NextResponse.json({ message: errorData.detail || 'Failed to delete account' }, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
