// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { 
  getCachedOrder, 
  setCachedOrder, 
  invalidateOrderCache 
} from '../../../../lib/redis';
import { 
  createOrderSchema, 
  updateOrderStatusSchema, 
  validateData 
} from '../../../../lib/validation';
import { apiRateLimit, orderRateLimit } from '../../../../lib/rateLimit';
import { logError, startTransaction, trackOrder } from '../../../../lib/monitoring';

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function GET(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('GET /api/orders', 'http');

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const all = searchParams.get('all');

    if (orderId) {
      // Try cache first
      const cached = await getCachedOrder(orderId);
      if (cached) {
        transaction.finish();
        return NextResponse.json(cached, {
          headers: { 'X-Cache': 'HIT' }
        });
      }

      // Cache miss - fetch from DB
      await dbConnect();
      const order = await Order.findOne({ orderId })
        .populate('items.menuItem')
        .lean();

      if (!order) {
        transaction.finish();
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }

      // Cache for 10 minutes
      await setCachedOrder(orderId, order, 600);

      transaction.finish();
      return NextResponse.json(order, {
        headers: { 'X-Cache': 'MISS' }
      });
    }

    if (all === 'true') {
      await dbConnect();
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100) // Limit to last 100 orders
        .lean();

      transaction.finish();
      return NextResponse.json(orders);
    }

    transaction.finish();
    return NextResponse.json(
      { message: 'Please provide orderId or all=true' },
      { status: 400 }
    );
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'GET' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = orderRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('POST /api/orders', 'http');

  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(createOrderSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors?.issues 
        },
        { status: 400 }
      );
    }

    const orderData = {
      ...validation.data,
      orderId: generateOrderId()
    };

    await dbConnect();
    const order = await Order.create(orderData);

    // Cache the new order
    await setCachedOrder(order.orderId, order, 600);

    // Track order for analytics
    trackOrder(order.orderId, order.totalAmount);

    // Send notification (implement your notification logic)
    // await sendOrderNotification(order);

    transaction.finish();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'POST' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('PUT /api/orders', 'http');

  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(updateOrderStatusSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors?.issues 
        },
        { status: 400 }
      );
    }

    const { orderId, status } = validation.data;

    await dbConnect();
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      transaction.finish();
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Invalidate cache for this order
    await invalidateOrderCache(orderId);

    // Send status update notification
    // await sendStatusUpdateNotification(order);

    transaction.finish();
    return NextResponse.json(order);
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'PUT' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 400 }
    );
  }
}