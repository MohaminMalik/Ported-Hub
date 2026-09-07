import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';

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
        password: hashedPassword,
      },
    });

    // Create session cookie
    await createSession(user.id);

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
            <p><em>Note: This password was hashed before saving in the database for security.</em></p>
          `
        });
      } else {
        console.warn('EMAIL_USER or EMAIL_PASS not set in .env file. Email skipped.');
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Account created successfully!`,
      user: { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email }
    }, { status: 201 });

  } catch (e) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
