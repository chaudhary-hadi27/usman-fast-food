import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Search, Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface Order {
  orderId: string;
  customerName: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
}

export default function Track() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query.orderId) {
      setOrderId(router.query.orderId as string);
      trackOrder(router.query.orderId as string);
    }
  }, [router.query]);

  const trackOrder = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?orderId=${id}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-12 h-12 text-yellow-400" />;
      case 'Cooking': return <Package className="w-12 h-12 text-orange-500" />;
      case 'Out for Delivery': return <Truck className="w-12 h-12 text-blue-500" />;
      case 'Delivered': return <CheckCircle className="w-12 h-12 text-green-500" />;
      default: return <Clock className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-400';
      case 'Cooking': return 'bg-orange-500';
      case 'Out for Delivery': return 'bg-blue-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const statuses = ['Pending', 'Cooking', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  return (
    <>
      <Head>
        <title>Track Order - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-center mb-4 text-black">Track Your Order</h1>
          <p className="text-center text-gray-600 mb-12 text-lg">Enter your order ID to track status</p>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g., ORD-123456)"
                className="input-field flex-1"
              />
              <button type="submit" disabled={loading} className="btn-primary">
                <Search className="w-5 h-5 inline mr-2" />
                Track
              </button>
            </form>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Tracking your order...</p>
            </div>
          )}

          {/* Order Details */}
          {order && !loading && (
            <div className="max-w-4xl mx-auto">
              <div className="card p-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order #{order.orderId}</h2>
                    <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-yellow-600">Rs. {order.totalAmount}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    {statuses.map((status, index) => (
                      <div key={status} className="flex flex-col items-center flex-1">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          index <= currentStatusIndex ? getStatusColor(status) : 'bg-gray-300'
                        }`}>
                          {index <= currentStatusIndex ? '✓' : index + 1}
                        </div>
                        <p className={`mt-2 text-sm font-semibold ${
                          index <= currentStatusIndex ? 'text-black' : 'text-gray-400'
                        }`}>
                          {status}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded">
                      <div 
                        className={`h-full ${getStatusColor(order.status)} rounded transition-all duration-500`}
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
                  {getStatusIcon(order.status)}
                  <h3 className="text-2xl font-bold mt-4 mb-2">
                    {order.status === 'Delivered' ? '🎉 Order Delivered!' : `Order is ${order.status}`}
                  </h3>
                  <p className="text-gray-600">
                    {order.status === 'Pending' && 'Your order has been received and is being prepared'}
                    {order.status === 'Cooking' && 'Our chef is preparing your delicious food'}
                    {order.status === 'Out for Delivery' && 'Your order is on its way to you'}
                    {order.status === 'Delivered' && 'Your order has been delivered. Enjoy your meal!'}
                  </p>
                </div>

                {/* Order Items */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border-t mt-6 pt-6">
                  <h3 className="text-xl font-bold mb-2">Delivery Address</h3>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}