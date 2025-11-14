import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import MenuItem from '../../../../models/MenuItems';

export async function GET() {
  try {
    await dbConnect();
    const menuItems = await MenuItem.find({ available: true }).sort({ category: 1 });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const menuItem = await MenuItem.create(body);
    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create menu item' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!menuItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }
    
    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update menu item' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }
    
    const menuItem = await MenuItem.findByIdAndDelete(id);
    
    if (!menuItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete menu item' }, { status: 400 });
  }
}