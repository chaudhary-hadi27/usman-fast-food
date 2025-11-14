'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

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
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
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
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
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
        alert(`Order placed successfully! Your Order ID is: ${data.orderId}`);
        router.push(`/track?orderId=${data.orderId}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-12 text-black">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items from our menu!</p>
            <a href="/menu">
              <button className="btn-primary">Browse Menu</button>
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="card flex items-center p-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1 ml-4">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-yellow-600 font-semibold">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Details</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
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
                    <label className="block text-sm font-semibold mb-2">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Subtotal:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Delivery:</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-yellow-600">Rs. {totalAmount}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}