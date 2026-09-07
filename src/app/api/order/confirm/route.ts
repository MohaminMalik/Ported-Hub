import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shippingDetails, cartItems, total, paymentId, orderId } = body;

    if (!shippingDetails || !cartItems) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    // Try to get logged in user
    const session = await getSession();
    
    // Save Order to Database
    try {
      await prisma.order.create({
        data: {
          userId: session ? session.userId : null,
          totalAmount: total,
          paymentId: paymentId || orderId,
          shippingDetails: JSON.stringify(shippingDetails),
          cartItems: JSON.stringify(cartItems),
          status: 'Processing',
        }
      });
    } catch (dbError) {
      console.error('Failed to save order to DB:', dbError);
    }

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Format the cart items into an HTML list
        const itemsList = cartItems.map((item: any) => 
          `<li>${item.name} (Size: ${item.size || 'N/A'}) - $${item.price}</li>`
        ).join('');

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `NEW ORDER RECEIVED! Order #${orderId}`,
          html: `
            <h2>New Order on Ported Hub</h2>
            <p><strong>Razorpay Payment ID:</strong> ${paymentId || 'N/A'}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
            
            <hr/>
            <h3>Customer Shipping Address:</h3>
            <p><strong>Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
            <p><strong>Email:</strong> ${shippingDetails.email}</p>
            <p><strong>Phone:</strong> ${shippingDetails.phoneNumber || 'N/A'}</p>
            <p><strong>House/Flat:</strong> ${shippingDetails.house}</p>
            <p><strong>Street:</strong> ${shippingDetails.street}</p>
            <p><strong>Landmark:</strong> ${shippingDetails.landmark || 'N/A'}</p>
            <p><strong>City:</strong> ${shippingDetails.city}</p>
            <p><strong>ZIP:</strong> ${shippingDetails.zip}</p>

            <hr/>
            <h3>Order Items:</h3>
            <ul>
              ${itemsList}
            </ul>
          `
        });
      } else {
        console.warn('EMAIL_USER or EMAIL_PASS not set in .env file. Order email skipped.');
      }
    } catch (emailError) {
      console.error('Email failed to send.', emailError);
    }

    return NextResponse.json({ success: true, message: 'Order processed and email sent.' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
