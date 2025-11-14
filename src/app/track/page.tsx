'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
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
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      trackOrder(orderIdParam);
    }
  }, [searchParams]);

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
      case 'Pending': return <Clock className="w-12 h-12" />;
      case 'Cooking': return <Package className="w-12 h-12" />;
      case 'Out for Delivery': return <Truck className="w-12 h-12" />;
      case 'Delivered': return <CheckCircle className="w-12 h-12" />;
      default: return <Clock className="w-12 h-12" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'from-yellow-400 to-yellow-500';
      case 'Cooking': return 'from-orange-400 to-orange-500';
      case 'Out for Delivery': return 'from-blue-400 to-blue-500';
      case 'Delivered': return 'from-green-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const statuses = ['Pending', 'Cooking', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Track Your <span className="text-gradient">Order</span>
          </h1>
          <p className="text-gray-600 text-lg">Enter your order ID to see real-time status</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
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
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 text-center font-semibold"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Tracking your order...</p>
          </div>
        )}

        {order && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black mb-2">Order #{order.orderId}</h2>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-yellow-600">Rs. {order.totalAmount}</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mb-12">
                <div className="flex justify-between items-start mb-8">
                  {statuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center flex-1 relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg ${
                          index <= currentStatusIndex 
                            ? `bg-gradient-to-br ${getStatusColor(status)} text-white` 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {index <= currentStatusIndex ? (
                          <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                        ) : (
                          <span className="text-xl md:text-2xl font-black">{index + 1}</span>
                        )}
                      </motion.div>
                      <p className={`mt-3 text-xs md:text-sm font-bold text-center ${
                        index <= currentStatusIndex ? 'text-black' : 'text-gray-400'
                      }`}>
                        {status}
                      </p>
                      {index < statuses.length - 1 && (
                        <div className="absolute top-8 left-1/2 w-full h-1 hidden md:block">
                          <div className={`h-full transition-all duration-500 ${
                            index < currentStatusIndex ? `bg-gradient-to-r ${getStatusColor(order.status)}` : 'bg-gray-200'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Progress Bar */}
                <div className="md:hidden relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getStatusColor(order.status)}`}
                  />
                </div>
              </div>

              {/* Current Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-center p-8 bg-gradient-to-br ${getStatusColor(order.status)} rounded-2xl shadow-xl mb-8`}
              >
                <div className="text-white mb-4">
                  {getStatusIcon(order.status)}
                </div>
                <h3 className="text-3xl font-black mb-3 text-white">
                  {order.status === 'Delivered' ? '🎉 Order Delivered!' : `Order is ${order.status}`}
                </h3>
                <p className="text-white/90 text-lg">
                  {order.status === 'Pending' && 'Your order has been received and is being prepared'}
                  {order.status === 'Cooking' && 'Our chef is preparing your delicious food right now'}
                  {order.status === 'Out for Delivery' && 'Your order is on its way to you! Should arrive soon'}
                  {order.status === 'Delivered' && 'Your order has been delivered. Enjoy your meal!'}
                </p>
              </motion.div>

              {/* Order Items */}
              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-yellow-600" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-bold text-lg">{item.name}</span>
                        <span className="text-gray-600 ml-3">× {item.quantity}</span>
                      </div>
                      <span className="font-black text-yellow-600 text-lg">Rs. {item.price * item.quantity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-2xl font-black mb-3 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-yellow-600" />
                  Delivery Address
                </h3>
                <p className="text-gray-700 text-lg bg-gray-50 p-4 rounded-lg">{order.deliveryAddress}</p>
              </div>

              {/* Customer Info */}
              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <h3 className="text-2xl font-black mb-3">Customer Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-bold text-lg">{order.customerName}</p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 bg-gradient-to-r from-yellow-400 to-yellow-500"
            >
              <h3 className="text-2xl font-black mb-2 text-black">Need Help?</h3>
              <p className="text-gray-900 mb-4">Contact us if you have any questions about your order</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+923001234567" className="flex-1">
                  <button className="w-full bg-black text-yellow-400 font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition">
                    📞 Call Us
                  </button>
                </a>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition">
                    💬 WhatsApp
                  </button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}