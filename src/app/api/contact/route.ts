import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSubmissionSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, phone, email, subject, message } = parsed.data;

    await prisma.contactSubmission.create({
      data: {
        name,
        phone,
        email: email || null,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Your message has been submitted successfully.' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to submit your message. Please try again later.' },
      { status: 500 },
    );
  }
}
