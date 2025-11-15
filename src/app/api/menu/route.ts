// src/app/api/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import MenuItem from '../../../../models/MenuItems';
import { 
  getCachedMenu, 
  setCachedMenu, 
  invalidateMenuCache 
} from '../../../../lib/redis';
import { 
  menuItemSchema, 
  updateMenuItemSchema, 
  validateData 
} from '../../../../lib/validation';
import { apiRateLimit } from '../../../../lib/rateLimit';
import { logError, startTransaction } from '../../../../lib/monitoring';

export async function GET(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('GET /api/menu', 'http');

  try {
    // Try cache first
    const cached = await getCachedMenu();
    if (cached) {
      transaction.finish();
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    // Cache miss - fetch from DB
    await dbConnect();
    const menuItems = await MenuItem.find({ available: true })
      .sort({ category: 1 })
      .lean()
      .select('-__v'); // Exclude version field

    // Cache for 5 minutes
    await setCachedMenu(menuItems, 300);

    transaction.finish();
    return NextResponse.json(menuItems, {
      headers: { 'X-Cache': 'MISS' }
    });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'GET' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('POST /api/menu', 'http');

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(menuItemSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors?.issues 
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const menuItem = await MenuItem.create(validation.data);
    
    // Invalidate cache
    await invalidateMenuCache();

    transaction.finish();
    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'POST' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to create menu item' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('PUT /api/menu', 'http');

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(updateMenuItemSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors?.issues 
        },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validation.data;

    await dbConnect();
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    await invalidateMenuCache();

    transaction.finish();
    return NextResponse.json(menuItem);
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'PUT' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to update menu item' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const transaction = startTransaction('DELETE /api/menu', 'http');

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { message: 'Valid ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    await invalidateMenuCache();

    transaction.finish();
    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'DELETE' });
    transaction.finish();
    return NextResponse.json(
      { message: 'Failed to delete menu item' },
      { status: 400 }
    );
  }
}