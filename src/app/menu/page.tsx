// FILE: src/app/menu/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { ShoppingCart, Plus, Search, SlidersHorizontal, Heart, X, TrendingUp, Sparkles } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  rating?: number;
  popular?: boolean;
  dietary?: string[];
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'popular' | 'rating'>('default');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);

  const categories = ['All', 'Burger', 'Pizza', 'Fries', 'Drinks'];
  const dietaryOptions = ['Vegetarian', 'Spicy', 'Halal', 'Kids Friendly'];

  useEffect(() => {
    fetchMenuItems();
    updateCartCount();
    loadWishlist();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Add dummy ratings and flags if not present
        const enhancedData = data.map(item => ({
          ...item,
          rating: item.rating || (4 + Math.random()).toFixed(1),
          popular: item.popular || Math.random() > 0.7,
          dietary: item.dietary || []
        }));
        setMenuItems(enhancedData);
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

  const loadWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(saved);
    } catch (error) {
      setWishlist([]);
    }
  };

  const toggleWishlist = (itemId: string) => {
    let updated: string[];
    if (wishlist.includes(itemId)) {
      updated = wishlist.filter(id => id !== itemId);
      toast.success('Removed from favorites');
    } else {
      updated = [...wishlist, itemId];
      toast.success('Added to favorites');
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
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

  const getFilteredAndSortedItems = () => {
    let filtered = Array.isArray(menuItems) ? [...menuItems] : [];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Dietary filter
    if (dietaryFilter.length > 0) {
      filtered = filtered.filter(item =>
        item.dietary && dietaryFilter.some(diet => item.dietary?.includes(diet))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setSortBy('default');
    setDietaryFilter([]);
  };

  const toggleDietaryFilter = (option: string) => {
    if (dietaryFilter.includes(option)) {
      setDietaryFilter(dietaryFilter.filter(f => f !== option));
    } else {
      setDietaryFilter([...dietaryFilter, option]);
    }
  };

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

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-6 sm:mb-8"
        >
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all shadow-sm text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all shadow-md ${
                showFilters
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-6 sm:mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-gray-200">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-sm sm:text-base"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Dietary Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => toggleDietaryFilter(option)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            dietaryFilter.includes(option)
                              ? 'bg-yellow-400 text-black'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-6 text-gray-600 text-sm sm:text-base">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </div>
        )}

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
                      className="card group flex flex-col relative"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlist.includes(item._id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>

                      {/* Popular Badge */}
                      {item.popular && (
                        <div className="absolute top-3 left-14 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                          HOT
                        </div>
                      )}

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
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black shadow-lg text-sm sm:text-base">
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
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2 text-gray-900 leading-tight flex-1">
                            {item.name}
                          </h3>
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-gray-900">⭐ {item.rating}</span>
                            </div>
                          )}
                        </div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto px-4"
                >
                  <div className="text-6xl sm:text-7xl md:text-8xl mb-6">🔍</div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">No Items Found</h2>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8">
                    We couldn't find any items matching your filters.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </motion.div>
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