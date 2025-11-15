// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

// Initialize Sentry (call this in your app initialization)
export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Don't send errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error(hint.originalException || hint.syntheticException);
          return null;
        }
        return event;
      }
    });
  }
}

// Custom error logger
export function logError(error: Error, context?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
}

// Performance monitoring
export function startTransaction(name: string, op: string) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return Sentry.startTransaction({ name, op });
  }
  return {
    finish: () => {},
    startChild: () => ({
      finish: () => {}
    })
  };
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
  
  // Log to your backend analytics
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'order_placed',
        orderId,
        amount,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', 'view', path);
}

export function trackAddToCart(itemName: string, price: number) {
  trackEvent('ecommerce', 'add_to_cart', itemName, price);
}