// FILE: components/DealsSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: number;
  title: string;
  description: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  endTime: Date;
  tag: string;
}

export default function DealsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});

  const deals: Deal[] = [
    {
      id: 1,
      title: 'Mega Burger Combo',
      description: 'Double Beef Burger + Fries + Drink',
      discount: '40% OFF',
      originalPrice: 1200,
      discountedPrice: 720,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      tag: 'HOT DEAL'
    },
    {
      id: 2,
      title: 'Family Pizza Party',
      description: '2 Large Pizzas + 2L Drink + 4 Sides',
      discount: '50% OFF',
      originalPrice: 3500,
      discountedPrice: 1750,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      tag: 'FAMILY SPECIAL'
    },
    {
      id: 3,
      title: 'Chicken Wings Blast',
      description: '20 Spicy Wings + 2 Dips + Fries',
      discount: '35% OFF',
      originalPrice: 1500,
      discountedPrice: 975,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=600&fit=crop',
      endTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
      tag: 'TRENDING'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: number]: string } = {};
      deals.forEach(deal => {
        const diff = deal.endTime.getTime() - Date.now();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[deal.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[deal.id] = 'EXPIRED';
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [deals.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Today's <span className="text-gradient">Hot Deals</span>
            </h2>
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Limited time offers - Grab them before they're gone!
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Slider Container */}
          <div className="relative h-[500px] sm:h-[550px] md:h-[600px] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${deals[currentSlide].image})`,
                      filter: 'brightness(0.4)'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16">
                      <div className="max-w-2xl">
                        {/* Tag */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-lg"
                        >
                          <Flame className="w-4 h-4" />
                          {deals[currentSlide].tag}
                        </motion.div>

                        {/* Discount Badge */}
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-2xl sm:text-3xl md:text-4xl font-black px-6 py-3 rounded-lg mb-4 sm:mb-6 shadow-2xl"
                        >
                          {deals[currentSlide].discount}
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 leading-tight"
                        >
                          {deals[currentSlide].title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6"
                        >
                          {deals[currentSlide].description}
                        </motion.p>

                        {/* Price */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-4 mb-4 sm:mb-6"
                        >
                          <span className="text-gray-500 line-through text-xl sm:text-2xl md:text-3xl">
                            Rs. {deals[currentSlide].originalPrice}
                          </span>
                          <span className="text-yellow-400 text-3xl sm:text-4xl md:text-5xl font-black">
                            Rs. {deals[currentSlide].discountedPrice}
                          </span>
                        </motion.div>

                        {/* Countdown Timer */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex items-center gap-2 mb-6 sm:mb-8"
                        >
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse" />
                          <span className="text-white text-base sm:text-lg md:text-xl font-bold">
                            Ends in: <span className="text-red-500">{timeLeft[deals[currentSlide].id] || 'Loading...'}</span>
                          </span>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Link href="/menu">
                            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-3 sm:py-4 px-6 sm:px-10 rounded-lg text-base sm:text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl">
                              Order Now 🔥
                            </button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all z-10 backdrop-blur-sm"
              aria-label="Previous deal"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all z-10 backdrop-blur-sm"
              aria-label="Next deal"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {deals.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 sm:h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-yellow-400 w-8 sm:w-12' 
                    : 'bg-gray-600 w-2 sm:w-3 hover:bg-gray-500'
                }`}
                aria-label={`Go to deal ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}