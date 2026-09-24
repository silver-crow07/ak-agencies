import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpaySignature),
  );
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
    const { orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!orderNumber || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification data' },
        { status: 400 },
      );
    }

    // 3. Verify Razorpay signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature', code: 'INVALID_RAZORPAY_SIGNATURE' },
        { status: 400 },
      );
    }

    // 4. Find the application order (must belong to authenticated user)
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

    // 5. Verify order is still eligible for payment
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'This order has been cancelled.' },
        { status: 400 },
      );
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: true, message: 'Payment already completed', code: 'PAYMENT_ALREADY_COMPLETED' },
      );
    }

    // 6. Verify the Razorpay order details server-side
    const razorpay = getRazorpayInstance();
    try {
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

      // Verify amount matches our order total
      const expectedPaise = order.total.mul(100).toNumber();
      if (razorpayOrder.amount !== expectedPaise) {
        return NextResponse.json(
          { success: false, error: 'Payment amount mismatch', code: 'PAYMENT_AMOUNT_MISMATCH' },
          { status: 400 },
        );
      }

      // Verify currency
      if (razorpayOrder.currency !== 'INR') {
        return NextResponse.json(
          { success: false, error: 'Currency mismatch', code: 'CURRENCY_MISMATCH' },
          { status: 400 },
        );
      }

      // Verify the Razorpay order receipt matches our order number
      if (razorpayOrder.receipt !== orderNumber) {
        return NextResponse.json(
          { success: false, error: 'Razorpay order mismatch', code: 'RAZORPAY_ORDER_MISMATCH' },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to verify Razorpay order details' },
        { status: 500 },
      );
    }

    // 7. Update order status atomically
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed. Please try again.' },
      { status: 500 },
    );
  }
}
