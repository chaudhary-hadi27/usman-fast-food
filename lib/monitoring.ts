// lib/monitoring.ts

// Define Transaction interface for type safety
interface Transaction {
  finish: () => void;
  startChild: (context: any) => Transaction;
}

// Check if Sentry is available
const sentryAvailable = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN;

// Initialize Sentry (call this in your app initialization)
export function initMonitoring() {
  // Sentry initialization removed - optional feature
  console.log('Monitoring initialized (Sentry disabled)');
}

// Custom error logger
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error.message, 'Context:', context);
}

// Performance monitoring - Returns mock transaction
export function startTransaction(name: string, op: string): Transaction {
  const transaction: Transaction = {
    finish: () => {
      // Mock finish
    },
    startChild: (context: any): Transaction => {
      return transaction; // Return self for chaining
    }
  };
  
  return transaction;
}

// Analytics tracking (Google Analytics placeholder)
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

// Business metrics
export function trackOrder(orderId: string, amount: number) {
  trackEvent('ecommerce', 'purchase', orderId, amount);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Order tracked:', { orderId, amount });
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', 'view', path);
}

export function trackAddToCart(itemName: string, price: number) {
  trackEvent('ecommerce', 'add_to_cart', itemName, price);
}