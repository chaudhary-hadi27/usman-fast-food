'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock, Truck, ChefHat, Shield, Heart, Sparkles, TrendingUp, Award, Users } from 'lucide-react';

export default function EnhancedHome() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    updateCartCount();
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      setCartCount(0);
    }
  };

  const testimonials = [
    { name: "Ahmed Khan", text: "Best burgers in Lahore! Fast delivery and amazing taste.", rating: 5 },
    { name: "Sara Ali", text: "Fresh ingredients, great service. Highly recommended!", rating: 5 },
    { name: "Hassan Raza", text: "My go-to place for late night cravings. Never disappoints!", rating: 5 }
  ];

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10 pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Simplified Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-400/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black text-yellow-400"
          >
            🍔 Usman Fast Food
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6 items-center"
          >
            {['Menu', 'About', 'Track', 'Contact', 'Cart'].map((item, i) => (
              <motion.a
                key={item}
                href={`/${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-white hover:text-yellow-400 transition font-semibold hidden md:block"
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
            >
              Order Now
            </motion.button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 text-center relative z-10"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-2 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Serving Excellence Since 2020</span>
          </motion.div>

          {/* Main Heading with Gradient */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          >
            <span className="text-white">Taste The</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
              Difference
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Premium burgers, pizzas & more. Made fresh, delivered fast, crafted with passion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(250, 204, 21, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition"
            >
              View Menu <Heart className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Animated Food Images */}
          <div className="relative h-64 mb-16">
            <motion.img
              animate={floatingAnimation}
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop"
              alt="Burger"
              className="absolute left-1/4 top-0 w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-yellow-400/50"
            />
            <motion.img
              animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop"
              alt="Pizza"
              className="absolute right-1/4 top-8 w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-orange-400/50"
            />
            <motion.img
              animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
              src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop"
              alt="Fries"
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 h-40 object-cover rounded-full shadow-2xl border-4 border-red-400/50"
            />
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { icon: Users, value: "10K+", label: "Customers" },
              { icon: Award, value: "4.9★", label: "Rating" },
              { icon: TrendingUp, value: "50+", label: "Items" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-yellow-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-white">Why Choose </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">Us?</span>
            </h2>
            <p className="text-xl text-gray-400">Experience the difference in every bite</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Fresh ingredients, authentic taste, made with love',
                color: 'from-yellow-400 to-orange-400'
              },
              {
                icon: Clock,
                title: 'Lightning Fast',
                description: 'Quick prep & delivery to satisfy your hunger',
                color: 'from-orange-400 to-red-400'
              },
              {
                icon: Truck,
                title: 'Free Delivery',
                description: 'Fast & free delivery to your doorstep',
                color: 'from-red-400 to-pink-400'
              },
              {
                icon: ChefHat,
                title: 'Expert Chefs',
                description: 'Professionally trained with years of experience',
                color: 'from-blue-400 to-cyan-400'
              },
              {
                icon: Shield,
                title: 'Hygienic & Safe',
                description: 'Highest hygiene standards maintained',
                color: 'from-green-400 to-emerald-400'
              },
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Every dish prepared with passion & care',
                color: 'from-pink-400 to-rose-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity -z-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-white">
              What Our <span className="text-yellow-400">Customers</span> Say
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded-3xl p-12 text-center backdrop-blur-sm"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-2xl text-white mb-6 italic">"{testimonials[activeTestimonial].text}"</p>
                <p className="text-yellow-400 font-bold text-xl">- {testimonials[activeTestimonial].name}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-yellow-400 w-8' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-16 text-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black relative z-10">
              Hungry? Order Now!
            </h2>
            <p className="text-xl mb-8 text-black/80 relative z-10">
              Get your favorite food delivered in minutes
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-yellow-400 px-12 py-5 rounded-full font-bold text-xl shadow-2xl relative z-10"
            >
              View Full Menu
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Usman Fast Food</h3>
              <p className="text-gray-400">Serving excellence since 2020</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div><a href="/menu" className="hover:text-yellow-400 transition">Menu</a></div>
                <div><a href="/about" className="hover:text-yellow-400 transition">About</a></div>
                <div><a href="/contact" className="hover:text-yellow-400 transition">Contact</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>📞 +92 300 1234567</div>
                <div>📧 info@usmanfastfood.com</div>
                <div>📍 Lahore, Pakistan</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Usman Fast Food. Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}