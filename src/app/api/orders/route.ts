import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { generateOrderId, canCancelOrder } from '../../../../lib/orderUtils';

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');
    const all = searchParams.get('all');
    
    // Get single order by ID
    if (orderId) {
      const order = await Order.findOne({ orderId }).populate('items.menuItem');
      
      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      
      return NextResponse.json(order);
    }
    
    // Get all orders by email (customer history)
    if (email) {
      const orders = await Order.find({ customerEmail: email })
        .sort({ createdAt: -1 })
        .limit(50); // Limit for performance
      
      return NextResponse.json(orders);
    }
    
    // Get all orders (admin)
    if (all === 'true') {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100) // Limit for performance
        .select('-__v'); // Don't send version key
      
      return NextResponse.json(orders);
    }
    
    return NextResponse.json({ message: 'Please provide orderId, email, or all=true' }, { status: 400 });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validation
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.deliveryAddress) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ message: 'Order must contain at least one item' }, { status: 400 });
    }
    
    // Validate total amount (recalculate server-side for security)
    const calculatedTotal = body.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    if (Math.abs(calculatedTotal - body.totalAmount) > 0.01) {
      return NextResponse.json({ message: 'Invalid total amount' }, { status: 400 });
    }
    
    const orderData = {
      ...body,
      orderId: generateOrderId(),
      customerEmail: body.customerEmail.toLowerCase().trim(),
    };
    
    const order = await Order.create(orderData);
    
    // TODO: Send confirmation email here
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 400 });
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, status } = body;
    
    if (!orderId || !status) {
      return NextResponse.json({ message: 'Missing orderId or status' }, { status: 400 });
    }
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 400 });
  }
}

// DELETE - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'Customer request';
    
    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    if (!canCancelOrder(order.status)) {
      return NextResponse.json({ 
        message: 'Cannot cancel order in current status' 
      }, { status: 400 });
    }
    
    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    await order.save();
    
    return NextResponse.json({ 
      message: 'Order cancelled successfully',
      order 
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json({ message: 'Failed to cancel order' }, { status: 500 });
  }
}