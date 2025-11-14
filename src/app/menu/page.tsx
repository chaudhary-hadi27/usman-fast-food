import { useEffect, useState } from 'react';
import Head from 'next/head';
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

  const categories = ['All', 'Burger', 'Pizza', 'Fries', 'Drinks'];

  useEffect(() => {
    fetchMenuItems();
    updateCartCount();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
  };

  const addToCart = (item: MenuItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((i: any) => i._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    alert(`${item.name} added to cart!`);
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Menu - Usman Fast Food</title>
      </Head>

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

          {/* Menu Items Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading menu...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <div key={item._id} className="card">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
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
          )}

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No items found in this category</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        {cartCount > 0 && (
          <a href="/cart">
            <button className="fixed bottom-8 right-8 bg-yellow-400 text-black p-4 rounded-full shadow-2xl hover:bg-yellow-500 transition-all transform hover:scale-110">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-black text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
            </button>
          </a>
        )}
      </div>
    </>
  );
}