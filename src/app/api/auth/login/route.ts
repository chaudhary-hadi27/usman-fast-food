// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import User from '../../../../../models/Users';
import { createToken, verifyPassword } from '../../../../../lib/auth';
import { loginSchema, validateData } from '../../../../../lib/validation';
import { authRateLimit } from '../../../../../lib/rateLimit';
import { logError } from '../../../../../lib/monitoring';

export async function POST(request: NextRequest) {
  const rateLimitResponse = authRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validation.errors?.issues 
        },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    await dbConnect();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      userId: user._id.toString(),
      role: user.role
    });

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    logError(error as Error, { route: '/api/auth/login', method: 'POST' });
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}