// FILE: components/FeaturedMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  popular?: boolean;
}

interface FeaturedMenuProps {
  onCartUpdate: () => void;
}

export default function FeaturedMenu({ onCartUpdate }: FeaturedMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      // Get first 6 items or add dummy data if database is empty
      if (Array.isArray(data) && data.length > 0) {
        setMenuItems(data.slice(0, 6));
      } else {
        // Dummy featured items
        setMenuItems([
          {
            _id: 'featured-1',
            name: 'Classic Beef Burger',
            description: 'Juicy beef patty with fresh veggies and special sauce',
            price: 450,
            category: 'Burger',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
            rating: 4.8,
            popular: true
          },
          {
            _id: 'featured-2',
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomatoes and basil on thin crust',
            price: 850,
            category: 'Pizza',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
            rating: 4.9,
            popular: true
          },
          {
            _id: 'featured-3',
            name: 'Crispy Fries',
            description: 'Golden crispy fries with special seasoning',
            price: 250,
            category: 'Fries',
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop',
            rating: 4.7,
            popular: false
          },
          {
            _id: 'featured-4',
            name: 'Chicken Burger',
            description: 'Crispy chicken fillet with lettuce and mayo',
            price: 400,
            category: 'Burger',
            image: 'https://images.unsplash.com/photo-1562547900-5b2b8e2d9e9f?w=400&h=400&fit=crop',
            rating: 4.6,
            popular: false
          },
          {
            _id: 'featured-5',
            name: 'Pepperoni Pizza',
            description: 'Loaded with pepperoni and extra cheese',
            price: 950,
            category: 'Pizza',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
            rating: 4.9,
            popular: true
          },
          {
            _id: 'featured-6',
            name: 'Fresh Lemonade',
            description: 'Refreshing homemade lemonade with mint',
            price: 150,
            category: 'Drinks',
            image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe1f33?w=400&h=400&fit=crop',
            rating: 4.5,
            popular: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
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
      onCartUpdate();
      
      toast.success(`${item.name} added to cart!`, {
        icon: '🛒',
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
              Featured <span className="text-gradient">Menu</span>
            </h2>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">
            Our most popular and delicious items loved by customers
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold text-sm sm:text-base">Loading featured items...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="card group relative overflow-hidden"
                >
                  {/* Popular Badge */}
                  {item.popular && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      POPULAR
                    </div>
                  )}

                  {/* Image */}
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
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black shadow-lg text-sm sm:text-base">
                      Rs. {item.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight flex-1">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-xs sm:text-sm">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View Full Menu Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link href="/menu">
                <button className="bg-black text-yellow-400 hover:bg-gray-900 font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto">
                  View Full Menu
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}