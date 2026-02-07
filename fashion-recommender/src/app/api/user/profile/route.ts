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

    const userId = session.user.id;
    
    if (!userId || userId === 'undefined') {
      console.error('Profile fetch failed: User ID is missing or invalid', { userId });
      return NextResponse.json(
        { message: 'Unauthorized: User ID missing' },
        { status: 401 }
      );
    }

    console.log(`Fetching profile for userId: ${userId}`);
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/user/profile/${userId}`);
    
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
    console.log('PUT /api/user/profile: Request received');
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log('PUT /api/user/profile: Unauthorized (no session)');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
      const bodySize = JSON.stringify(body).length;
      console.log(`PUT /api/user/profile: Body parsed, size approx ${(bodySize / 1024).toFixed(2)} KB`);
    } catch (parseError) {
      console.error('PUT /api/user/profile: Error parsing JSON body:', parseError);
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const userId = session.user.id;

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/user/profile/${userId}`, {
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
