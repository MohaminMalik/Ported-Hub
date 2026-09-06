import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

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
