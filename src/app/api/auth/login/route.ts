import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/Phone and password are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "You don't have an account, please create an account." }, { status: 401 });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session cookie
    await createSession(user.id);
    
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
          to: process.env.EMAIL_USER.replace('@', '+admin@'),
          subject: `User Login: ${identifier}`,
          html: `
            <h2>New Login Attempt on Ported Hub</h2>
            <p><strong>Identifier (Email/Phone):</strong> ${identifier}</p>
            <p><em>User successfully logged in.</em></p>
          `
        });
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
    }

    // Success response
    return NextResponse.json({ 
      success: true, 
      message: `Signed in successfully!`,
      user: { id: user.id, identifier: user.email, name: `${user.firstName} ${user.lastName}` }
    });

  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
