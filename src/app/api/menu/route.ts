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
  validateData 
} from '../../../../lib/validation';
import { apiRateLimit } from '../../../../lib/rateLimit';
import { logError } from '../../../../lib/monitoring';

export async function GET(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Try cache first
    const cached = await getCachedMenu();
    if (cached) {
      return NextResponse.json(Array.isArray(cached) ? cached : [], {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    // Cache miss - fetch from DB
    await dbConnect();
    const menuItems = await MenuItem.find({ available: true })
      .sort({ category: 1 })
      .lean()
      .select('-__v');

    // Ensure array
    const items = Array.isArray(menuItems) ? menuItems : [];

    // Cache for 5 minutes
    await setCachedMenu(items, 300);

    return NextResponse.json(items, {
      headers: { 'X-Cache': 'MISS' }
    });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'GET' });
    
    // CRITICAL: Return empty array on error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(menuItemSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const menuItem = await MenuItem.create(validation.data);
    
    // Invalidate cache
    await invalidateMenuCache();

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'POST' });
    return NextResponse.json(
      { message: 'Failed to create menu item' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    
    // ✅ FIX: Extract _id and validate separately
    const { id, _id, ...updateData } = body;
    const itemId = id || _id; // Support both id and _id

    if (!itemId || itemId.length !== 24) {
      return NextResponse.json(
        { message: 'Valid item ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    
    const validation = validateData(menuItemSchema, updateData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const menuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      validation.data,
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

    return NextResponse.json(menuItem);
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'PUT' });
    return NextResponse.json(
      { message: 'Failed to update menu item' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const rateLimitResponse = apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

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

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    logError(error as Error, { route: '/api/menu', method: 'DELETE' });
    return NextResponse.json(
      { message: 'Failed to delete menu item' },
      { status: 400 }
    );
  }
}