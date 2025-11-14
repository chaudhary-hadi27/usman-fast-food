'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

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
    toast.success('Cart updated!');
  };

  const removeItem = (id: string, name: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`${name} removed from cart`);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-center mb-12"
        >
          Your <span className="text-gradient">Cart</span>
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-32 h-32 mx-auto mb-6 text-gray-300" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some delicious items from our menu!</p>
            <a href="/menu">
              <button className="btn-primary text-lg">
                Browse Menu <ArrowRight className="inline w-5 h-5 ml-2" />
              </button>
            </a>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="card flex items-center p-4 md:p-6"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 ml-4 md:ml-6">
                      <h3 className="text-lg md:text-xl font-black">{item.name}</h3>
                      <p className="text-yellow-600 font-bold text-lg">Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="bg-white hover:bg-gray-200 p-2 rounded-lg transition shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-black w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg transition shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id, item.name)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-2xl font-black mb-6">Order Details</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="input-field"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-bold">Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Delivery:</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black border-t-2 border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-yellow-600">Rs. {totalAmount}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-5 h-5 border-2"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}