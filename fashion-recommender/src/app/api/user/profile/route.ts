import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/profile/${userId}`);
    
    if (response.status === 404) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const user = await response.json();

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (response.status === 400) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    if (!response.ok) {
        throw new Error(`Python backend error: ${response.statusText}`);
    }

    const updatedUser = await response.json();

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
