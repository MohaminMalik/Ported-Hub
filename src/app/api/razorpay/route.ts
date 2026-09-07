import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, shippingDetails, cartItems, phoneNumber } = body;

    // Send email to owner about the checkout attempt
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && shippingDetails) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const itemsList = cartItems?.map((item: any) => 
          `<li>${item.name} (Size: ${item.size || 'N/A'}) - $${item.price}</li>`
        ).join('') || 'N/A';

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Checkout Attempted: ${shippingDetails.firstName} ${shippingDetails.lastName}`,
          html: `
            <h2>New Checkout Attempt on Ported Hub</h2>
            <p><strong>Customer Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
            <p><strong>Email:</strong> ${shippingDetails.email}</p>
            <p><strong>Phone:</strong> ${phoneNumber || 'N/A'}</p>
            <p><strong>Address:</strong> ${shippingDetails.house}, ${shippingDetails.street}, ${shippingDetails.landmark || ''}, ${shippingDetails.city} - ${shippingDetails.zip}</p>
            <h3>Cart Items:</h3>
            <ul>${itemsList}</ul>
          `
        });
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
    }

    // Check if keys are present
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys missing in .env file.");
      return NextResponse.json({ error: 'Razorpay keys not configured in .env' }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay expects the amount in the smallest currency unit (paise for INR)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    return NextResponse.json(order);
    
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
