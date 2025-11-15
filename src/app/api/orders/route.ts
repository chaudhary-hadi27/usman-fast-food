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
  validateData 
} from '../../../../lib/validation';
import { apiRateLimit, orderRateLimit } from '../../../../lib/rateLimit';
import { logError, trackOrder } from '../../../../lib/monitoring';

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function GET(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const all = searchParams.get('all');

    await dbConnect();

    if (orderId) {
      // Try cache first
      const cached = await getCachedOrder(orderId);
      if (cached) {
        return NextResponse.json(cached, {
          headers: { 'X-Cache': 'HIT' }
        });
      }

      // Cache miss - fetch from DB
      const order = await Order.findOne({ orderId })
        .populate('items.menuItem')
        .lean();

      if (!order) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }

      // Cache for 10 minutes
      await setCachedOrder(orderId, order, 600);

      return NextResponse.json(order, {
        headers: { 'X-Cache': 'MISS' }
      });
    }

    if (all === 'true') {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      // CRITICAL: Always return array, never return object
      return NextResponse.json(Array.isArray(orders) ? orders : []);
    }

    return NextResponse.json(
      { message: 'Please provide orderId or all=true' },
      { status: 400 }
    );
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'GET' });
    
    // CRITICAL: Return empty array on error, not error object
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = orderRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(createOrderSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const orderData = {
      ...validation.data,
      orderId: generateOrderId(),
      status: 'Pending' // Default status
    };

    await dbConnect();
    const order = await Order.create(orderData);

    // Cache the new order
    await setCachedOrder(order.orderId, order.toObject(), 600);

    // Track order for analytics
    trackOrder(order.orderId, order.totalAmount);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'POST' });
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { orderId, status } = body;

    // ✅ FIX: Validate orderId format
    if (!orderId || !orderId.match(/^ORD-[A-Z0-9]{9}$/)) {
      return NextResponse.json(
        { message: 'Valid order ID is required (format: ORD-XXXXXXXXX)' },
        { status: 400 }
      );
    }

    // ✅ FIX: Complete status validation
    const validStatuses = ['Pending', 'Confirmed', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          message: 'Invalid status', 
          validStatuses 
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Invalidate cache for this order
    await invalidateOrderCache(orderId);

    return NextResponse.json(order);
  } catch (error) {
    logError(error as Error, { route: '/api/orders', method: 'PUT' });
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 400 }
    );
  }
}