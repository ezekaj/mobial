import { NextRequest } from 'next/server';
import { 
  successResponse, 
  errorResponse, 
  getAuthUser 
} from '@/lib/auth-helpers';
import { checkOrderUsage } from '@/lib/mobimatter';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: orderId } = await params;
    const user = await getAuthUser(request);

    if (!user) {
      return errorResponse('Authentication required', 401);
    }

    // 1. Verify ownership
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { userId: true, mobimatterOrderId: true, status: true }
    });

    if (!order || (order.userId !== user.id && user.role !== 'ADMIN')) {
      return errorResponse('Order not found', 404);
    }

    if (!order.mobimatterOrderId) {
      return errorResponse('Order not fulfilled yet', 400);
    }

    // 2. Fetch live usage from MobiMatter
    const usage = await checkOrderUsage(order.mobimatterOrderId);

    return successResponse(usage);

  } catch (error) {
    console.error('Usage check error:', error);
    return errorResponse('Failed to fetch usage data', 500);
  }
}
