import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, gender, preferredStyle } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, gender, preferredStyle }),
    });

    if (!response.ok) {
        if (response.status === 400) {
             return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }
        throw new Error(`Backend error: ${response.statusText}`);
    }

    const user = await response.json();

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: user },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user', error: (error as Error).message },
      { status: 500 }
    );
  }
}
