import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      totalCustomers,
      paidAgg,
      pendingAgg,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { inStock: false } }),
      prisma.product.count({
        where: { stockQuantity: { gt: 0, lt: 5 } },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PENDING' },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        totalCustomers,
        paidRevenue: Number(paidAgg._sum.total ?? 0),
        pendingRevenue: Number(pendingAgg._sum.total ?? 0),
        recentOrders: recentOrders.map((o) => ({
          ...o,
          total: Number(o.total),
          createdAt: o.createdAt.toISOString(),
        })),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 },
    );
  }
}
