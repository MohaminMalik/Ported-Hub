import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Account with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to Database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // Create session cookie
    await createSession(user.id);

    // Send Welcome Email to the customer
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Send emails concurrently to prevent Vercel 10s timeout
        await Promise.all([
          // Send to Customer
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Welcome to Ported Hub, ${firstName}!`,
            html: `
              <h2>Thank you for joining Ported Hub!</h2>
              <p>Hi ${firstName},</p>
              <p>We are thrilled to have you connected with Ported Hub. Get ready for exclusive fashion drops and premium vintage collections.</p>
              <p>Your account is now active with the email: <strong>${email}</strong> and phone number: <strong>${phone}</strong>.</p>
              <br/>
              <p>Best regards,<br/>The Ported Hub Team</p>
            `
          }),
          // Send to Admin
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New User Registration: ${firstName} ${lastName}`,
            html: `
              <h2>New Account Created on Ported Hub</h2>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><em>Note: For security reasons, the user's password is encrypted in the database and not sent via email.</em></p>
            `
          })
        ]);
      } else {
        console.warn('EMAIL_USER or EMAIL_PASS not set in .env file. Welcome email skipped.');
      }
    } catch (emailError) {
      console.error('Welcome email failed to send.', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Account created successfully!`,
      user: { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email }
    }, { status: 201 });

  } catch (e: any) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
