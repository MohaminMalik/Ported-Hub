import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save token to DB
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Determine the base URL (Vercel or localhost)
    const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://ported-hub.vercel.app';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Ported Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Reset Your Password</h2>
        <p>You requested a password reset for your Ported Hub account.</p>
        <p>Click the link below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <br/>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
