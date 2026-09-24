import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

function getRazorpayInstance(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { orderNumber } = body;

    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 },
      );
    }

    // 3. Find the order (must belong to authenticated user)
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId: session.userId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    // 4. Verify order is eligible for payment
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'This order has been cancelled and cannot be paid for.' },
        { status: 400 },
      );
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'This order has already been paid for.', code: 'PAYMENT_ALREADY_COMPLETED' },
        { status: 400 },
      );
    }

    // 5. Convert Decimal total to paise (Razorpay requires integer paise)
    const totalPaise = order.total.mul(100).toNumber();
    if (!Number.isInteger(totalPaise)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 },
      );
    }

    // 6. Create Razorpay order
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: orderNumber,
    });

    // 7. Return only what the frontend needs
    return NextResponse.json({
      success: true,
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      order: {
        orderNumber: order.orderNumber,
        total: order.total.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order. Please try again.' },
      { status: 500 },
    );
  }
}
