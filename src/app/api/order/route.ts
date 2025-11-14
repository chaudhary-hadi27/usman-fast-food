import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { orderId, all } = req.query;
        
        if (orderId) {
          // Get specific order by orderId
          const order = await Order.findOne({ orderId }).populate('items.menuItem');
          
          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }
          
          return res.status(200).json(order);
        }
        
        if (all === 'true') {
          // Get all orders (for admin)
          const orders = await Order.find().sort({ createdAt: -1 });
          return res.status(200).json(orders);
        }
        
        res.status(400).json({ message: 'Please provide orderId or all=true' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
      }
      break;

    case 'POST':
      try {
        const orderData = {
          ...req.body,
          orderId: generateOrderId(),
        };
        
        const order = await Order.create(orderData);
        res.status(201).json(order);
      } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ message: 'Failed to create order' });
      }
      break;

    case 'PUT':
      try {
        const { orderId, status } = req.body;
        
        const order = await Order.findOneAndUpdate(
          { orderId },
          { status },
          { new: true }
        );
        
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
      } catch (error) {
        res.status(400).json({ message: 'Failed to update order' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}