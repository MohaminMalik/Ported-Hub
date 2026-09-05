import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Attempt to send email to the store owner
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Works automatically with Gmail app passwords
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Sending to yourself so you receive the details
          subject: `New User Sign Up: ${firstName} ${lastName}`,
          html: `
            <h2>New Account Created on Ported Hub</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <br/>
            <p><em>Note: In a real production environment, passwords should be encrypted.</em></p>
          `
        });
      } else {
        console.warn('EMAIL_USER or EMAIL_PASS not set in .env file. Email skipped.');
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
    }

    // Mock Backend Database Creation
    return NextResponse.json({ 
      success: true, 
      message: `Account created successfully!`,
      token: 'mock_jwt_token_456',
      user: { id: Date.now(), name: `${firstName} ${lastName}`, email }
    }, { status: 201 });

  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
