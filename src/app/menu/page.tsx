'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { ShoppingCart, Plus, Search } from 'lucide-react';

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

  const categories = ['All', 'Burger', 'Pizza', 'Fries', 'Drinks'];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartCount={cartCount} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight">
            Our <span className="text-gradient">Menu</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Choose from our delicious selection of fresh, handcrafted meals
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all shadow-sm text-sm sm:text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all transform hover:scale-105 text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-center">
              <p className="font-bold mb-2 text-sm sm:text-base">{error}</p>
              <button 
                onClick={fetchMenuItems}
                className="text-xs sm:text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold text-sm sm:text-base">Loading delicious menu...</p>
          </div>
        ) : (
          <>
            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="card group flex flex-col"
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black shadow-lg text-sm sm:text-base">
                          Rs. {item.price}
                        </div>
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2 text-gray-900 leading-tight">{item.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-xs sm:text-sm md:text-base flex-grow">{item.description}</p>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all transform text-sm sm:text-base ${
                            item.available 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-md hover:shadow-lg' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          {item.available ? 'Add to Cart' : 'Unavailable'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                {!error && menuItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto px-4"
                  >
                    <div className="text-6xl sm:text-7xl md:text-8xl mb-6">🍔</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Menu Coming Soon!</h2>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8">
                      We're preparing delicious items for you. Check back soon!
                    </p>
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 sm:p-6">
                      <p className="text-xs sm:text-sm text-gray-700 mb-4">
                        <strong>Admin:</strong> Login to add menu items
                      </p>
                      <a href="/admin/login">
                        <button className="bg-black text-yellow-400 hover:bg-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition text-sm sm:text-base">
                          Go to Admin Panel
                        </button>
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto px-4"
                  >
                    <div className="text-6xl sm:text-7xl md:text-8xl mb-6">🔍</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">No Items Found</h2>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8">
                      We couldn't find any items matching your search.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </div>
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 sm:p-5 rounded-full shadow-2xl z-40 group"
          >
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-black text-yellow-400 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-black shadow-lg"
            >
              {cartCount}
            </motion.span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}