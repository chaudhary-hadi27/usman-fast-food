'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../../components/Header';
import { Search, Package, Clock, Truck, CheckCircle, Phone, MapPin, ChefHat } from 'lucide-react';

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

  const statuses = [
    { name: 'Pending', icon: Clock, color: 'from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-50', desc: 'Order received' },
    { name: 'Cooking', icon: ChefHat, color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-50', desc: 'Being prepared' },
    { name: 'Out for Delivery', icon: Truck, color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50', desc: 'On the way' },
    { name: 'Delivered', icon: CheckCircle, color: 'from-green-400 to-green-500', bgColor: 'bg-green-50', desc: 'Completed' }
  ];
  
  const currentStatusIndex = order ? statuses.findIndex(s => s.name === order.status) : -1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-full">
                <Package className="w-16 h-16 text-black" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Track Your <span className="text-yellow-400 block sm:inline mt-2 sm:mt-0">Order</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
              Enter your order ID to see real-time delivery status and get live updates
            </p>

            {/* Search Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-yellow-400 transition" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., ORD-XXXXX)"
                  className="w-full pl-16 pr-40 py-5 bg-white/95 backdrop-blur-sm border-2 border-transparent rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all shadow-2xl text-black placeholder:text-gray-400 text-lg font-semibold"
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black px-8 py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Tracking...' : 'Track'}
                </motion.button>
              </div>
            </motion.form>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-bold shadow-xl"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Package className="w-20 h-20 text-yellow-500" />
            </motion.div>
            <p className="text-gray-600 font-bold text-xl mt-6">Tracking your order...</p>
          </motion.div>
        )}

        <AnimatePresence>
          {order && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-6xl mx-auto"
            >
              {/* Order Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-8 mb-8 shadow-2xl text-white"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-sm">
                        ORDER #{order.orderId}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <h2 className="text-3xl font-black mb-2">Hello, {order.customerName}! 👋</h2>
                    <p className="text-gray-300">Your order is being processed with care</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-2">Total Amount</p>
                    <p className="text-5xl font-black text-yellow-400">Rs. {order.totalAmount}</p>
                  </div>
                </div>
              </motion.div>

              {/* Progress Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border-2 border-gray-100"
              >
                <h3 className="text-3xl font-black mb-12 flex items-center gap-3">
                  <Truck className="w-8 h-8 text-yellow-500" />
                  Order Status
                </h3>

                {/* Desktop Timeline */}
                <div className="hidden md:block">
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${statuses[currentStatusIndex]?.color} rounded-full`}
                      />
                    </div>

                    <div className="relative flex justify-between">
                      {statuses.map((status, index) => {
                        const Icon = status.icon;
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return (
                          <motion.div
                            key={status.name}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center flex-1"
                          >
                            <motion.div
                              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${
                                isCompleted 
                                  ? `bg-gradient-to-br ${status.color}` 
                                  : 'bg-gray-200'
                              }`}
                            >
                              <Icon className={`w-12 h-12 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                              {isCurrent && (
                                <motion.div
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${status.color}`}
                                />
                              )}
                            </motion.div>
                            <div className={`mt-6 text-center ${isCompleted ? status.bgColor : 'bg-gray-50'} px-6 py-4 rounded-xl`}>
                              <p className={`font-black text-lg mb-1 ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                {status.name}
                              </p>
                              <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                                {status.desc}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden space-y-6">
                  {statuses.map((status, index) => {
                    const Icon = status.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <motion.div
                        key={status.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center gap-4"
                      >
                        <motion.div
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                            isCompleted 
                              ? `bg-gradient-to-br ${status.color}` 
                              : 'bg-gray-200'
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                        </motion.div>
                        <div className={`flex-1 p-4 rounded-xl ${isCompleted ? status.bgColor : 'bg-gray-50'}`}>
                          <p className={`font-black text-lg mb-1 ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                            {status.name}
                          </p>
                          <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                            {status.desc}
                          </p>
                        </div>
                        {index < statuses.length - 1 && (
                          <div className="absolute left-8 top-20 w-0.5 h-10 bg-gray-200" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Current Status Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`mt-12 text-center p-10 bg-gradient-to-br ${statuses[currentStatusIndex]?.color} rounded-2xl shadow-2xl`}
                >
                  <div className="text-white text-6xl mb-4">
                    {order.status === 'Delivered' ? '🎉' : '⏳'}
                  </div>
                  <h3 className="text-3xl font-black mb-3 text-white">
                    {order.status === 'Delivered' ? 'Order Delivered!' : `Order is ${order.status}`}
                  </h3>
                  <p className="text-white/90 text-xl max-w-2xl mx-auto">
                    {order.status === 'Pending' && '✨ Your order has been received and is being prepared'}
                    {order.status === 'Cooking' && '👨‍🍳 Our chef is preparing your delicious food right now'}
                    {order.status === 'Out for Delivery' && '🚗 Your order is on its way! Should arrive soon'}
                    {order.status === 'Delivered' && '✅ Your order has been delivered. Enjoy your meal!'}
                  </p>
                </motion.div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100"
                >
                  <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                    <Package className="w-8 h-8 text-yellow-500" />
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center font-black">
                            {item.quantity}×
                          </div>
                          <span className="font-black text-lg text-gray-900">{item.name}</span>
                        </div>
                        <span className="font-black text-xl text-yellow-600">Rs. {item.price * item.quantity}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black">Total:</span>
                      <span className="text-3xl font-black text-yellow-600">Rs. {order.totalAmount}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-yellow-500" />
                      Delivery Address
                    </h3>
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100">
                      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Help Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl shadow-2xl p-8"
                  >
                    <h3 className="text-3xl font-black mb-3 text-black">Need Help?</h3>
                    <p className="text-gray-900 mb-6 text-lg font-semibold">Contact us for any questions</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <a href="tel:+923001234567">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-black text-yellow-400 font-black py-4 px-6 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Phone className="w-5 h-5" />
                          Call Us
                        </motion.button>
                      </a>
                      <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Phone className="w-5 h-5" />
                          WhatsApp
                        </motion.button>
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}