// lib/validation.ts
import { z } from 'zod';

// Menu Item Validation
export const menuItemSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  price: z.number().positive().max(100000),
  category: z.enum(['Burger', 'Fries', 'Pizza', 'Drinks']),
  image: z.string().url(),
  available: z.boolean().optional().default(true)
});

// ✅ REMOVED: updateMenuItemSchema - no longer needed
// We'll handle id/._id separately in the API route

// Order Validation
export const orderItemSchema = z.object({
  menuItem: z.string().length(24),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(50)
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(), // ✅ FIX: Added email validation
  customerPhone: z.string().regex(/^(\+92|0)?3\d{9}$/, 'Invalid Pakistani phone number'),
  deliveryAddress: z.string().min(10).max(500),
  specialInstructions: z.string().max(500).optional(), // ✅ FIX: Added optional special instructions
  items: z.array(orderItemSchema).min(1).max(20),
  totalAmount: z.number().positive().max(1000000)
});

// ✅ FIX: Removed updateOrderStatusSchema - validation moved to API route
// This allows more flexibility and clearer error messages

// Auth Validation
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
});

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^(\+92|0)?3\d{9}$/).optional(),
  message: z.string().min(10).max(1000)
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}