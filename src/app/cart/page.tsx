'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield, Clock } from 'lucide-react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      setCartItems([]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Cart updated!', { icon: '✅' });
  };

  const removeItem = (id: string, name: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`${name} removed`, { icon: '🗑️' });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName,
        customerPhone,
        deliveryAddress,
        items: cartItems.map(item => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('cart');
        toast.success('Order placed successfully! 🎉');
        router.push(`/track?orderId=${data.orderId}`);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-neutral-50">
      <Header cartCount={itemCount} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block mb-6"
            >
              <ShoppingBag className="w-20 h-20 text-yellow-400" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4">
              Your <span className="text-yellow-400">Cart</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              {cartItems.length > 0 
                ? `You have ${itemCount} item${itemCount > 1 ? 's' : ''} ready for checkout`
                : 'Your cart is waiting for delicious items'}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShoppingBag className="w-32 h-32 mx-auto mb-8 text-gray-300" />
              </motion.div>
              
              <h2 className="text-4xl font-black mb-6 text-gray-900">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-10 text-xl leading-relaxed">
                Looks like you haven't added any delicious items yet.<br />
                Let's change that!
              </p>
              
              <a href="/menu">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black py-5 px-10 rounded-xl text-xl shadow-2xl hover:shadow-yellow-500/50 transition-all inline-flex items-center gap-3"
                >
                  Browse Menu <ArrowRight className="w-6 h-6" />
                </motion.button>
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-900">Cart Items</h2>
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-black">
                  {itemCount} Items
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, height: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-yellow-400"
                  >
                    <div className="flex items-center p-6 gap-6">
                      {/* Image */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative flex-shrink-0"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-black text-sm shadow-lg">
                          {item.quantity}
                        </div>
                      </motion.div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-yellow-600 font-black text-lg">
                            Rs. {item.price}
                          </div>
                          <div className="text-gray-400">×</div>
                          <div className="text-gray-600 font-bold">
                            {item.quantity}
                          </div>
                          <div className="text-gray-400">=</div>
                          <div className="text-gray-900 font-black text-xl">
                            Rs. {item.price * item.quantity}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2 shadow-inner">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, -1)}
                              className="bg-white hover:bg-yellow-400 hover:text-black p-2 rounded-lg transition shadow-sm"
                            >
                              <Minus className="w-5 h-5" />
                            </motion.button>
                            <span className="font-black w-12 text-center text-lg">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, 1)}
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-2 rounded-lg transition shadow-sm"
                            >
                              <Plus className="w-5 h-5" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item._id, item.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition"
                          >
                            <Trash2 className="w-6 h-6" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: <Truck className="w-6 h-6" />, title: 'Free Delivery', desc: 'On all orders' },
                  { icon: <Shield className="w-6 h-6" />, title: 'Secure Payment', desc: 'Cash on delivery' },
                  { icon: <Clock className="w-6 h-6" />, title: 'Fast Service', desc: '30-45 mins' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100 text-center"
                  >
                    <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      {feature.icon}
                    </div>
                    <div className="font-black text-sm mb-1">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 border-2 border-gray-100"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Tag className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-3xl font-black">Order Summary</h2>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Subtotal ({itemCount} items)</span>
                      <span className="font-bold">Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Delivery Fee</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-black">Total:</span>
                        <span className="text-3xl font-black text-yellow-600">Rs. {totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-5">
                  <div>
                    <label className="block text-sm font-black mb-2 text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black mb-2 text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black mb-2 text-gray-700">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold resize-none"
                      rows={3}
                      placeholder="House #, Street, Area, City"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black py-5 px-6 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-3 border-black border-t-transparent rounded-full"
                        />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Payment Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 text-center font-semibold">
                    🔒 Cash on Delivery • Secure & Safe
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}