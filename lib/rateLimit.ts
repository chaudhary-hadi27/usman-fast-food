// lib/rateLimit.ts
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  limit: number = 100,
  windowMs: number = 60 * 1000
) {
  return (request: NextRequest) => {
    const ip = request.ip || 
              request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';

    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    
    const record = store.get(key);

    if (!record || record.resetTime < now) {
      store.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return null;
    }

    if (record.count >= limit) {
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          message: 'Please try again later',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((record.resetTime - now) / 1000))
          }
        }
      );
    }

    record.count++;
    store.set(key, record);
    return null;
  };
}

// Specific rate limiters for different endpoints
export const apiRateLimit = rateLimit(100, 60 * 1000); // 100 requests per minute
export const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes
export const orderRateLimit = rateLimit(10, 60 * 1000); // 10 orders per minute