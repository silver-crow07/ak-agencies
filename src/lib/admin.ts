import { NextResponse } from 'next/server';
import { getSessionFromCookies, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface AdminSession {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function requireAdmin(): Promise<
  { session: AdminSession } | { response: NextResponse }
> {
  const session = await getSessionFromCookies();
  if (!session) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      ),
    };
  }

  // Verify role from database, not from JWT alone
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return {
      response: NextResponse.json(
        { success: false, error: 'Forbidden — admin access required' },
        { status: 403 },
      ),
    };
  }

  return {
    session: {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
}

export async function requireAdminPage(): Promise<
  { session: AdminSession } | { redirect: string }
> {
  const session = await getSessionFromCookies();
  if (!session) {
    return { redirect: '/admin/login?reason=unauthorized' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return { redirect: '/admin/login?denied=1' };
  }

  return {
    session: {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
}
