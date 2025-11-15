import { customAlphabet } from 'nanoid';

// Generate secure order IDs
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

export function generateOrderId(): string {
  return `ORD-${nanoid()}`;
}

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COOKING: 'Cooking',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export function canCancelOrder(status: OrderStatus): boolean {
  return status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CONFIRMED;
}

export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const statusFlow: Record<OrderStatus, OrderStatus | null> = {
    [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
    [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.COOKING,
    [ORDER_STATUS.COOKING]: ORDER_STATUS.OUT_FOR_DELIVERY,
    [ORDER_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.DELIVERED,
    [ORDER_STATUS.DELIVERED]: null,
    [ORDER_STATUS.CANCELLED]: null,
  };
  
  return statusFlow[currentStatus];
}

export function getEstimatedTime(status: OrderStatus): string {
  const times: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: '5-10 minutes',
    [ORDER_STATUS.CONFIRMED]: '15-20 minutes',
    [ORDER_STATUS.COOKING]: '20-30 minutes',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: '30-45 minutes',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
  };
  
  return times[status];
}