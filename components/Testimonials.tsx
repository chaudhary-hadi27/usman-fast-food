'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Khan',
    role: 'Regular Customer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Best burgers in Lahore! The quality is always consistent and delivery is super fast. Usman Fast Food never disappoints. Highly recommended!'
  },
  {
    id: 2,
    name: 'Fatima Malik',
    role: 'Food Blogger',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 5,
    text: 'As a food blogger, I\'ve tried many places, but Usman Fast Food stands out. Fresh ingredients, amazing taste, and excellent service. A must-try!'
  },
  {
    id: 3,
    name: 'Hassan Ali',
    role: 'Corporate Client',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 5,
    text: 'We order for our office parties regularly. Always on time, food is delicious, and they handle large orders professionally. Great experience!'
  },
  {
    id: 4,
    name: 'Ayesha Noor',
    role: 'Student',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Love their student deals! Affordable, tasty, and quick delivery. Perfect for late-night study sessions. The pizza is my absolute favorite!'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 text-black px-2">
            What Our <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl px-4">
            Real reviews from real people who love our food
          </p>
        </motion.div>

        {/* Main Testimonial Container */}
        <div className="max-w-7xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
            >
              {/* Left Side - Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative order-2 md:order-1 w-full flex justify-center md:justify-start"
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl sm:rounded-3xl transform rotate-6 opacity-20 max-w-sm md:max-w-md lg:max-w-lg mx-auto"></div>
                
                {/* Main Image Container */}
                <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl mx-auto max-w-sm md:max-w-md lg:max-w-lg w-full">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square">
                    <motion.img
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Quote Icon Overlay */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-yellow-400 p-2 sm:p-3 rounded-full shadow-lg">
                      <Quote className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                    </div>
                  </div>
                  
                  {/* Image Border Effect */}
                  <div className="absolute -bottom-2 -right-2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-50 blur-xl"></div>
                </div>
              </motion.div>

              {/* Right Side - Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="order-1 md:order-2 space-y-4 sm:space-y-6 w-full px-2 sm:px-0"
              >
                {/* Stars */}
                <div className="flex gap-1 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                    >
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Review Text */}
                <div className="text-center md:text-left">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 opacity-30 mb-3 sm:mb-4 mx-auto md:mx-0" />
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed italic mb-4 sm:mb-6">
                    "{testimonials[currentIndex].text}"
                  </p>
                </div>

                {/* Customer Info */}
                <div className="border-t-2 border-gray-200 pt-4 sm:pt-6 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-1 sm:mb-2">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg font-semibold">
                    {testimonials[currentIndex].role}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center md:justify-start">
                  <button
                    onClick={prevTestimonial}
                    className="bg-white hover:bg-gray-100 text-black p-2.5 sm:p-3 md:p-4 rounded-full shadow-lg transition-all transform hover:scale-110 border-2 border-gray-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black p-2.5 sm:p-3 md:p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 md:mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 w-8 sm:w-10 md:w-12 h-2.5 sm:h-3'
                    : 'bg-gray-300 w-2.5 sm:w-3 h-2.5 sm:h-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}