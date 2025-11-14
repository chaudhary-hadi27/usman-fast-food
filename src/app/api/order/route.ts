import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const all = searchParams.get('all');
    
    if (orderId) {
      const order = await Order.findOne({ orderId }).populate('items.menuItem');
      
      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      
      return NextResponse.json(order);
    }
    
    if (all === 'true') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }
    
    return NextResponse.json({ message: 'Please provide orderId or all=true' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const orderData = {
      ...body,
      orderId: generateOrderId(),
    };
    
    const order = await Order.create(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, status } = body;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update order' }, { status: 400 });
  }
}