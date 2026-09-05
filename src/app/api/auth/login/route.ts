import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/Phone and password are required' }, { status: 400 });
    }

    // Mock Backend Validation
    if (password === '123456' || password.length < 6) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success response simulating a session/token creation
    return NextResponse.json({ 
      success: true, 
      message: `Signed in successfully as ${identifier}!`,
      token: 'mock_jwt_token_123',
      user: { id: 1, identifier }
    });

  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
