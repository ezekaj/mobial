import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  requireAuth,
  parseJsonBody,
} from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const topupSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: orderId } = await params;
    const user = await requireAuth(request);

    // Parse and validate body
    const body = await parseJsonBody(request);
    const validation = topupSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    const { productId } = validation.data;

    // Verify order exists, is completed, and user owns it
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        email: true,
        status: true,
        mobimatterOrderId: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return errorResponse('Access denied', 403);
    }

    if (order.status !== 'COMPLETED') {
      return errorResponse('Only completed orders can be topped up', 400);
    }

    if (!order.mobimatterOrderId) {
      return errorResponse('Order has no eSIM provisioned', 400);
    }

    // Verify the top-up product exists and is active
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        isActive: true,
      },
    });

    if (!product || !product.isActive) {
      return errorResponse('Top-up product not found or unavailable', 404);
    }

    // Create a Stripe checkout session for the top-up
    const session = await createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: order.email,
      amount: product.price,
      items: [
        {
          name: `Top-Up: ${product.name}`,
          description: `Data top-up for order ${order.orderNumber}`,
          amount: product.price,
          quantity: 1,
        },
      ],
    });

    return successResponse({
      sessionId: session.id,
      url: session.url,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
    });
  } catch (error: any) {
    if (error?.name === 'AuthError') {
      return errorResponse(error.message, error.statusCode || 401);
    }
    console.error('Top-up error:', error);
    return errorResponse('Failed to create top-up session', 500);
  }
}
