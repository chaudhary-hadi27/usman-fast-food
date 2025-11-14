'use client';
import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { ShoppingCart, Plus } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Burger', 'Pizza', 'Fries', 'Drinks'];

  useEffect(() => {
    fetchMenuItems();
    updateCartCount();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMenuItems(data);
        setError('');
      } else {
        console.error('API did not return an array:', data);
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
      console.error('Error loading cart:', error);
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
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  // Ensure filteredItems is always an array
  const filteredItems = Array.isArray(menuItems) 
    ? (selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4 text-black">Our Menu</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">Choose from our delicious selection</p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              <p className="font-semibold">{error}</p>
              <button 
                onClick={fetchMenuItems}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <>
            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                  <div key={item._id} className="card">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
                        Rs. {item.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className={`w-full flex items-center justify-center gap-2 ${
                          item.available 
                            ? 'btn-primary' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-6 rounded-lg'
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                        {item.available ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                {/* Empty State - Jab database khali ho */}
                {!error && menuItems.length === 0 ? (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">🍔</div>
                    <h2 className="text-3xl font-bold mb-4 text-black">Menu Coming Soon!</h2>
                    <p className="text-gray-600 text-lg mb-6">
                      We're preparing delicious items for you. Check back soon!
                    </p>
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mt-8">
                      <p className="text-sm text-gray-700">
                        <strong>Admin:</strong> Login to the admin dashboard to add menu items
                      </p>
                      <a href="/admin/login" className="inline-block mt-4">
                        <button className="bg-black text-yellow-400 hover:bg-gray-800 px-6 py-2 rounded-lg font-semibold transition">
                          Go to Admin Panel
                        </button>
                      </a>
                    </div>
                  </div>
                ) : error ? (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h2 className="text-3xl font-bold mb-4 text-black">Unable to Load Menu</h2>
                    <p className="text-gray-600 text-lg mb-6">{error}</p>
                    <button onClick={fetchMenuItems} className="btn-primary">
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">🔍</div>
                    <h2 className="text-3xl font-bold mb-4 text-black">No {selectedCategory} Items Found</h2>
                    <p className="text-gray-600 text-lg mb-6">
                      We don't have any {selectedCategory.toLowerCase()} items yet.
                    </p>
                    <button onClick={() => setSelectedCategory('All')} className="btn-primary">
                      View All Categories
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <a href="/cart">
          <button className="fixed bottom-8 right-8 bg-yellow-400 text-black p-4 rounded-full shadow-2xl hover:bg-yellow-500 transition-all transform hover:scale-110 z-50">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-black text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cartCount}
            </span>
          </button>
        </a>
      )}
    </div>
  );
}