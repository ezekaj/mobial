import { NextRequest } from 'next/server';
import {
  successResponse,
  errorResponse,
  getAuthUser
} from '@/lib/auth-helpers';
import { checkOrderUsage } from '@/lib/mobimatter';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);

    // Allow guest access via order number
    const orderNumberHeader = request.headers.get('x-order-number');

    let order;

    if (user) {
      // Authenticated: find by ID, verify ownership
      order = await db.order.findUnique({
        where: { id },
        select: { id: true, userId: true, mobimatterOrderId: true, status: true, orderNumber: true }
      });

      if (!order || (order.userId !== user.id && user.role !== 'ADMIN')) {
        return errorResponse('Order not found', 404);
      }
    } else if (orderNumberHeader) {
      // Guest: find by ID and verify order number matches
      order = await db.order.findUnique({
        where: { id },
        select: { id: true, userId: true, mobimatterOrderId: true, status: true, orderNumber: true }
      });

      if (!order || order.orderNumber !== orderNumberHeader) {
        return errorResponse('Order not found', 404);
      }
    } else {
      return errorResponse('Authentication required', 401);
    }

    if (order.status !== 'COMPLETED') {
      return errorResponse('Order is not completed', 400);
    }

    if (!order.mobimatterOrderId) {
      return errorResponse('Order not fulfilled yet', 400);
    }

    // Fetch live usage from MobiMatter
    const usage = await checkOrderUsage(order.mobimatterOrderId);

    // Calculate percentage
    const percentage = usage.dataTotal > 0
      ? Math.min(100, Math.round((usage.dataUsed / usage.dataTotal) * 100))
      : 0;

    return successResponse({
      ...usage,
      percentage,
      isActive: usage.status === 'active',
      remainingDays: usage.validityDaysRemaining,
      dataUnit: 'MB',
    });

  } catch (error) {
    console.error('Usage check error:', error);
    return errorResponse('Failed to fetch usage data', 500);
  }
}
