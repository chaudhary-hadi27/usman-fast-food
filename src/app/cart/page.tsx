'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

export default function Cart() {
  const router = useRouter();
  const { 
    cart, 
    isLoading: cartLoading,
    removeItem, 
    incrementQuantity, 
    decrementQuantity,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    
    if (updateQuantity(id, quantity)) {
      toast.success('Quantity updated');
    } else {
      toast.error('Maximum quantity is 20');
    }
  };

  const handleIncrement = (id: string) => {
    if (!incrementQuantity(id)) {
      toast.error('Maximum quantity reached');
    }
  };

  const handleDecrement = (id: string) => {
    decrementQuantity(id);
  };

  const totalAmount = getTotal();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        specialInstructions,
        items: cart.map(item => ({
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
        clearCart();
        toast.success('Order placed successfully! 🎉');
        router.push(`/track?orderId=${data.orderId}`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header cartCount={0} />
        <div className="text-center py-20">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartCount={getItemCount()} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-8 sm:mb-12"
        >
          Your <span className="text-gradient">Cart</span>
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-20"
          >
            <ShoppingBag className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">Add some delicious items from our menu!</p>
            <a href="/menu">
              <button className="btn-primary text-base sm:text-lg">
                Browse Menu <ArrowRight className="inline w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </a>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="card flex items-center p-3 sm:p-4 md:p-6 gap-3 sm:gap-4"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-cover rounded-lg shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-black truncate">{item.name}</h3>
                      <p className="text-yellow-600 font-bold text-sm sm:text-base md:text-lg">Rs. {item.price}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Rs. {item.price * item.quantity} total</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          className="bg-white hover:bg-gray-200 p-1.5 sm:p-2 rounded-lg transition shadow-sm"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          className="w-12 sm:w-14 text-center font-black border-0 bg-transparent text-sm sm:text-base focus:outline-none"
                        />
                        <button
                          onClick={() => handleIncrement(item._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 p-1.5 sm:p-2 rounded-lg transition shadow-sm"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        className="text-red-500 hover:text-red-700 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
                className="card p-4 sm:p-6 lg:sticky lg:top-24"
              >
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Order Details</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      rows={3}
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Special Instructions (Optional)</label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      rows={2}
                      placeholder="Extra spicy, no onions, etc."
                      maxLength={500}
                    />
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-3 sm:pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-bold">Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Delivery:</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl sm:text-2xl font-black border-t-2 border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-yellow-600">Rs. {totalAmount}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4 sm:w-5 sm:h-5 border-2"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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