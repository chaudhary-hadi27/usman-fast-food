// FILE: src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import { User, Mail, Phone, MapPin, Package, Heart, LogOut, Edit2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  loyaltyPoints?: number;
}

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Get user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch orders
      const ordersRes = await fetch('/api/orders?all=true');
      const ordersData = await ordersRes.json();
      setOrders(ordersData.slice(0, 5)); // Last 5 orders

      // Load wishlist
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(savedWishlist);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-white/90 font-medium">{user.email}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="bg-white text-orange-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Loyalty Points */}
            {user.loyaltyPoints !== undefined && (
              <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/30 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">Loyalty Points</p>
                    <p className="text-2xl font-black text-white">{user.loyaltyPoints || 0}</p>
                  </div>
                </div>
                <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition">
                  Redeem
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm sm:text-base">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-sm sm:text-base">Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm sm:text-base">Favorites</span>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="card p-6">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-gray-900">
                  <Mail className="w-6 h-6 text-orange-500" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-lg text-gray-900 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-lg text-gray-900 font-medium">{user.phone}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-gray-900">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  Delivery Address
                </h2>
                {user.address ? (
                  <p className="text-lg text-gray-900 font-medium">{user.address}</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">No address saved yet</p>
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition">
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order._id} className="card p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Cooking' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-2xl font-black text-orange-500">Rs. {order.totalAmount}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/track?orderId=${order.orderId}`)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2 text-gray-900">No Orders Yet</h3>
                  <p className="text-gray-600 mb-6">Start ordering delicious food!</p>
                  <button
                    onClick={() => router.push('/menu')}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {wishlist.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(itemId => (
                    <div key={itemId} className="card p-4">
                      <p className="text-center text-gray-600">Item ID: {itemId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2 text-gray-900">No Favorites Yet</h3>
                  <p className="text-gray-600 mb-6">Save your favorite items!</p>
                  <button
                    onClick={() => router.push('/menu')}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}