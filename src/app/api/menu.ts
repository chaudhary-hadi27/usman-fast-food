import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import MenuItem from '../../../models/MenuItems';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const menuItems = await MenuItem.find({ available: true }).sort({ category: 1 });
        res.status(200).json(menuItems);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch menu items' });
      }
      break;

    case 'POST':
      try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json(menuItem);
      } catch (error) {
        res.status(400).json({ message: 'Failed to create menu item' });
      }
      break;

    case 'PUT':
      try {
        const { id, ...updateData } = req.body;
        const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.status(200).json(menuItem);
      } catch (error) {
        res.status(400).json({ message: 'Failed to update menu item' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const menuItem = await MenuItem.findByIdAndDelete(id);
        
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.status(200).json({ message: 'Menu item deleted successfully' });
      } catch (error) {
        res.status(400).json({ message: 'Failed to delete menu item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}