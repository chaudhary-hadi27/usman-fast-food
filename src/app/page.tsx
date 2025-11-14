// FILE: src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import DealsSlider from '../../components/DealsSlider';
import FeaturedMenu from '../../components/FeaturedMenu';
import Testimonials from '../../components/Testimonials';
import LiveOrderCounter from '../../components/LiveOrderCounter';
import { ArrowRight, Star, Clock, Truck, ChefHat, Shield, Heart, Zap, Award, Users } from 'lucide-react';

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

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        
        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-24 left-4 md:left-12 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-5 py-3 rounded-full font-bold shadow-2xl hidden md:flex items-center gap-2 border-2 border-amber-600"
        >
          <Zap className="w-5 h-5" />
          <span className="text-sm">30 Min Delivery</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute top-24 right-4 md:right-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-full font-bold shadow-2xl hidden md:flex items-center gap-2 border-2 border-orange-600"
        >
          <Award className="w-5 h-5" />
          <span className="text-sm">10K+ Customers</span>
        </motion.div>
        
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto py-20"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight px-2 text-white drop-shadow-2xl"
          >
            Welcome to <span className="text-yellow-400 drop-shadow-lg block sm:inline mt-2 sm:mt-0">Usman Fast Food</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-100 px-4 font-semibold drop-shadow-lg"
          >
            Delicious food made with ❤️, delivered fresh and fast to your doorstep
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/menu" className="w-full sm:w-auto">
              <button className="btn-primary text-base sm:text-lg flex items-center justify-center gap-2 w-full shadow-2xl">
                Order Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <button className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 sm:py-4 px-8 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 w-full">
                Learn More <Heart className="w-5 h-5" />
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

      {/* Live Order Counter */}
      <LiveOrderCounter />

      {/* Deals Slider Section */}
      <DealsSlider />

      {/* Featured Menu Section */}
      <FeaturedMenu onCartUpdate={updateCartCount} />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Features Section */}
      <section className="py-12 sm:py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 text-gray-900 px-4">
              Why Choose <span className="text-gradient block sm:inline mt-2 sm:mt-0">Usman Fast Food?</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 font-medium">
              We're committed to serving you the best food experience
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Premium Quality',
                description: 'Fresh ingredients, authentic taste, made with love every single time',
                color: 'from-yellow-400 to-amber-500'
              },
              {
                icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Lightning Fast',
                description: 'Quick preparation and delivery to satisfy your hunger in no time',
                color: 'from-orange-400 to-red-500'
              },
              {
                icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Free Delivery',
                description: 'Fast and free delivery to your doorstep, every single order',
                color: 'from-blue-400 to-indigo-500'
              },
              {
                icon: <ChefHat className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Expert Chefs',
                description: 'Professionally trained chefs with years of experience',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Hygienic & Safe',
                description: 'Maintained highest hygiene standards for your safety',
                color: 'from-teal-400 to-cyan-500'
              },
              {
                icon: <Heart className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: 'Made with Love',
                description: 'Every dish prepared with passion and care for your satisfaction',
                color: 'from-rose-400 to-red-500'
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
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '10K+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
              { number: '50+', label: 'Menu Items', icon: <ChefHat className="w-6 h-6" /> },
              { number: '24/7', label: 'Service', icon: <Clock className="w-6 h-6" /> },
              { number: '4.9★', label: 'Rating', icon: <Star className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-3 text-yellow-400">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-xs sm:text-sm md:text-base font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 md:py-32 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-gray-900">
            Hungry? Order Now!
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-800 px-4 font-semibold">
            Browse our delicious menu and get your favorite food delivered in minutes
          </p>
          <Link href="/menu">
            <button className="bg-black text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-lg text-base sm:text-lg hover:bg-gray-900 transition-all transform hover:scale-105 shadow-2xl border-2 border-gray-800">
              View Full Menu
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Usman Fast Food</h3>
              <p className="text-gray-400 text-sm sm:text-base">Serving delicious food with love since 2020</p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link href="/menu" className="hover:text-yellow-400 transition">Menu</Link></li>
                <li><Link href="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
                <li><Link href="/track" className="hover:text-yellow-400 transition">Track Order</Link></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg white">Contact Us</h4>
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