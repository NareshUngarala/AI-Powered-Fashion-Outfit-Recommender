import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, mainProductId } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid data: items required' }, { status: 400 });
    }

    // @ts-expect-error: Session user type gap
    const userId = session.user.id;

    // Call Python backend to generate the look
    // We assume the backend handles fetching the user's profile image using the userId
    // or we could fetch it here and pass it, but backend is cleaner.
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/generate-look`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            items,
            mainProductId
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Python backend error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    
    // result should contain { imageUrl: "..." }
    return NextResponse.json(result);

  } catch (error) {
    console.error('Generate Look error:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ message: (error as any).message || 'Internal Server Error' }, { status: 500 });
  }
}
