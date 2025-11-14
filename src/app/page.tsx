'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import { ArrowRight, Star, Clock, Truck, ChefHat, Shield, Heart } from 'lucide-react';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    } catch (error) {
      setCartCount(0);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header cartCount={cartCount} />

      {/* Hero Section - FIXED */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto py-12 sm:py-16 md:py-20"
        >
          <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
              alt="Owner Usman"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl object-cover"
            />
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight"
          >
            Welcome to <span className="text-yellow-400">Usman Fast Food</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed px-4"
          >
            Delicious food made with ❤️, delivered fresh and fast to your doorstep
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/menu" className="w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto text-base sm:text-lg">
                Order Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <button className="btn-secondary w-full sm:w-auto text-base sm:text-lg">
                Learn More <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section - FIXED */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-black leading-tight">
              Why Choose <span className="text-gradient">Usman Fast Food?</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              We're committed to serving you the best food experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Premium Quality',
                description: 'Fresh ingredients, authentic taste, made with love every single time'
              },
              {
                icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Lightning Fast',
                description: 'Quick preparation and delivery to satisfy your hunger in no time'
              },
              {
                icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Free Delivery',
                description: 'Fast and free delivery to your doorstep, every single order'
              },
              {
                icon: <ChefHat className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Expert Chefs',
                description: 'Professionally trained chefs with years of experience'
              },
              {
                icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Hygienic & Safe',
                description: 'Maintained highest hygiene standards for your safety'
              },
              {
                icon: <Heart className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Made with Love',
                description: 'Every dish prepared with passion and care for your satisfaction'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center p-6 sm:p-8 group"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-black group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - FIXED */}
      <section className="py-12 sm:py-16 md:py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '50+', label: 'Menu Items' },
              { number: '24/7', label: 'Service' },
              { number: '4.9★', label: 'Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - FIXED */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-r from-yellow-400 to-orange-400">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-black leading-tight">
            Hungry? Order Now!
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-900 px-4">
            Browse our delicious menu and get your favorite food delivered in minutes
          </p>
          <Link href="/menu">
            <button className="bg-black text-yellow-400 font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-lg text-base sm:text-lg hover:bg-gray-900 transition-all transform hover:scale-105 shadow-2xl">
              View Full Menu
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer - FIXED */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">Usman Fast Food</h3>
              <p className="text-gray-400 text-sm sm:text-base">Serving delicious food with love since 2020</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link href="/menu" className="hover:text-yellow-400 transition">Menu</Link></li>
                <li><Link href="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
                <li><Link href="/track" className="hover:text-yellow-400 transition">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Contact Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>📞 +92 300 1234567</li>
                <li>📧 info@usmanfastfood.com</li>
                <li>📍 Lahore, Punjab, Pakistan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2024 Usman Fast Food. All rights reserved. Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}