'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { ShoppingCart, Plus, Search, Filter, Star, Clock, Flame } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { name: 'All', icon: '🍽️', color: 'from-yellow-400 to-yellow-500' },
    { name: 'Burger', icon: '🍔', color: 'from-orange-400 to-red-500' },
    { name: 'Pizza', icon: '🍕', color: 'from-red-400 to-pink-500' },
    { name: 'Fries', icon: '🍟', color: 'from-yellow-400 to-orange-500' },
    { name: 'Drinks', icon: '🥤', color: 'from-blue-400 to-cyan-500' }
  ];

  useEffect(() => {
    fetchMenuItems();
    updateCartCount();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setMenuItems(data);
        setError('');
      } else {
        setMenuItems([]);
        setError('Failed to load menu items');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenuItems([]);
      setError('Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    } catch (error) {
      setCartCount(0);
    }
  };

  const addToCart = (item: MenuItem) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((i: any) => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      
      toast.success(`${item.name} added to cart!`, {
        icon: '🛒',
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const filteredItems = Array.isArray(menuItems) 
    ? menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartCount} />

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider">
                🍽️ Our Menu
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Discover Our <span className="text-yellow-400 block sm:inline mt-2 sm:mt-0">Delicious Menu</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
              Handcrafted with love, served with a smile. Every bite tells a story of passion and quality.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-yellow-400 transition" />
                <input
                  type="text"
                  placeholder="Search for your favorite food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/95 backdrop-blur-sm border-2 border-transparent rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all shadow-2xl text-black placeholder:text-gray-400 text-lg font-semibold"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="bg-black text-yellow-400 px-3 py-1 rounded-lg text-xs font-bold">
                    {filteredItems.length} items
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-black flex items-center gap-3">
              <Filter className="w-8 h-8 text-yellow-500" />
              Categories
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-black text-yellow-400 px-4 py-2 rounded-lg font-bold"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-4 ${!showFilters && 'hidden lg:grid'}`}>
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.name)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-br ${category.color} text-white shadow-2xl`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <div className="font-black text-lg">{category.name}</div>
                  <div className="text-sm opacity-90 mt-1">
                    {menuItems.filter(item => category.name === 'All' || item.category === category.name).length} items
                  </div>
                </div>
                {selectedCategory === category.name && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-black/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center shadow-lg">
              <div className="text-5xl mb-4">😔</div>
              <p className="font-bold text-red-700 text-xl mb-4">{error}</p>
              <button 
                onClick={fetchMenuItems}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Flame className="w-16 h-16 text-yellow-500" />
            </motion.div>
            <p className="text-gray-600 font-bold text-xl mt-6">Loading delicious menu...</p>
          </div>
        ) : (
          <>
            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ y: -10 }}
                      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-yellow-400"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                          }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Price Badge */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="absolute top-4 right-4"
                        >
                          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black px-5 py-3 rounded-2xl font-black shadow-2xl text-lg backdrop-blur-sm border-2 border-white/50">
                            Rs. {item.price}
                          </div>
                        </motion.div>

                        {/* Quick View Badge */}
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/80 backdrop-blur-sm text-yellow-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span>Popular</span>
                          </div>
                        </div>

                        {/* Availability Overlay */}
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                              <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-lg shadow-2xl mb-2">
                                Out of Stock
                              </div>
                              <p className="text-white text-sm">Coming Back Soon</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors">
                              {item.name}
                            </h3>
                            <div className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {item.category}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          whileHover={item.available ? { scale: 1.02 } : {}}
                          whileTap={item.available ? { scale: 0.98 } : {}}
                          className={`w-full font-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg ${
                            item.available 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-2xl hover:shadow-yellow-500/50' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {item.available ? (
                            <>
                              <Plus className="w-6 h-6" />
                              <span>Add to Cart</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-6 h-6" />
                              <span>Unavailable</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-8xl mb-8">
                    {menuItems.length === 0 ? '🍔' : '🔍'}
                  </div>
                  <h2 className="text-4xl font-black mb-6 text-gray-900">
                    {menuItems.length === 0 ? 'Menu Coming Soon!' : 'No Items Found'}
                  </h2>
                  <p className="text-gray-600 text-xl mb-10 leading-relaxed">
                    {menuItems.length === 0 
                      ? "We're preparing delicious items for you. Check back soon!" 
                      : "We couldn't find any items matching your search."}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.a
            href="/cart"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 group"
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-6 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 border-4 border-white">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-black text-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-black shadow-xl border-4 border-white"
              >
                {cartCount}
              </motion.div>
              
              {/* Pulse Effect */}
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20" />
            </div>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}