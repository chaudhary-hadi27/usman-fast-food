// lib/redis.ts
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let redisAvailable = true;

async function getRedisClient() {
  // If Redis is not available, return null
  if (!redisAvailable) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
          reconnectStrategy: false // Don't retry if unavailable
        }
      });

      redisClient.on('error', (err) => {
        console.warn('⚠️  Redis unavailable - running without cache:', err.code);
        redisAvailable = false;
        redisClient = null;
      });

      await redisClient.connect();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.warn('⚠️  Redis unavailable - running without cache');
      redisAvailable = false;
      redisClient = null;
    }
  }

  return redisClient;
}

// Cache wrapper for menu items
export async function getCachedMenu() {
  try {
    const client = await getRedisClient();
    if (!client) return null; // Redis not available
    
    const cached = await client.get('menu:all');
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  } catch (error) {
    // Silently fail - app works without cache
    return null;
  }
}

export async function setCachedMenu(data: any, ttl: number = 300) {
  try {
    const client = await getRedisClient();
    if (!client) return; // Redis not available
    
    await client.setEx('menu:all', ttl, JSON.stringify(data));
  } catch (error) {
    // Silently fail - app works without cache
  }
}

export async function invalidateMenuCache() {
  try {
    const client = await getRedisClient();
    if (!client) return; // Redis not available
    
    await client.del('menu:all');
  } catch (error) {
    // Silently fail - app works without cache
  }
}

// Cache wrapper for orders
export async function getCachedOrder(orderId: string) {
  try {
    const client = await getRedisClient();
    if (!client) return null; // Redis not available
    
    const cached = await client.get(`order:${orderId}`);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  } catch (error) {
    // Silently fail - app works without cache
    return null;
  }
}

export async function setCachedOrder(orderId: string, data: any, ttl: number = 600) {
  try {
    const client = await getRedisClient();
    if (!client) return; // Redis not available
    
    await client.setEx(`order:${orderId}`, ttl, JSON.stringify(data));
  } catch (error) {
    // Silently fail - app works without cache
  }
}

export async function invalidateOrderCache(orderId: string) {
  try {
    const client = await getRedisClient();
    if (!client) return; // Redis not available
    
    await client.del(`order:${orderId}`);
  } catch (error) {
    // Silently fail - app works without cache
  }
}

// // lib/redis.ts
// import { createClient } from 'redis';

// let redisClient: ReturnType<typeof createClient> | null = null;

// async function getRedisClient() {
//   if (!redisClient) {
//     redisClient = createClient({
//       url: process.env.REDIS_URL || 'redis://localhost:6379'
//     });

//     redisClient.on('error', (err) => console.error('Redis Client Error', err));

//     await redisClient.connect();
//   }

//   return redisClient;
// }

// // Cache wrapper for menu items
// export async function getCachedMenu() {
//   try {
//     const client = await getRedisClient();
//     const cached = await client.get('menu:all');
    
//     if (cached) {
//       return JSON.parse(cached);
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Redis get error:', error);
//     return null;
//   }
// }

// export async function setCachedMenu(data: any, ttl: number = 300) {
//   try {
//     const client = await getRedisClient();
//     await client.setEx('menu:all', ttl, JSON.stringify(data));
//   } catch (error) {
//     console.error('Redis set error:', error);
//   }
// }

// export async function invalidateMenuCache() {
//   try {
//     const client = await getRedisClient();
//     await client.del('menu:all');
//   } catch (error) {
//     console.error('Redis delete error:', error);
//   }
// }

// // Cache wrapper for orders
// export async function getCachedOrder(orderId: string) {
//   try {
//     const client = await getRedisClient();
//     const cached = await client.get(`order:${orderId}`);
    
//     if (cached) {
//       return JSON.parse(cached);
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Redis get error:', error);
//     return null;
//   }
// }

// export async function setCachedOrder(orderId: string, data: any, ttl: number = 600) {
//   try {
//     const client = await getRedisClient();
//     await client.setEx(`order:${orderId}`, ttl, JSON.stringify(data));
//   } catch (error) {
//     console.error('Redis set error:', error);
//   }
// }

// export async function invalidateOrderCache(orderId: string) {
//   try {
//     const client = await getRedisClient();
//     await client.del(`order:${orderId}`);
//   } catch (error) {
//     console.error('Redis delete error:', error);
//   }
// }