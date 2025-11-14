// FILE: components/Testimonials.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmed Khan',
      role: 'Regular Customer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      rating: 5,
      text: 'Best burgers in Lahore! The quality is always consistent and delivery is super fast. Usman Fast Food never disappoints. Highly recommended! 🍔'
    },
    {
      id: 2,
      name: 'Fatima Malik',
      role: 'Food Blogger',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      rating: 5,
      text: 'As a food blogger, I\'ve tried many places, but Usman Fast Food stands out. Fresh ingredients, amazing taste, and excellent service. A must-try!'
    },
    {
      id: 3,
      name: 'Hassan Ali',
      role: 'Corporate Client',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      rating: 5,
      text: 'We order for our office parties regularly. Always on time, food is delicious, and they handle large orders professionally. Great experience!'
    },
    {
      id: 4,
      name: 'Ayesha Noor',
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop',
      rating: 4,
      text: 'Love their student deals! Affordable, tasty, and quick delivery. Perfect for late-night study sessions. The pizza is my absolute favorite! 🍕'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-black px-4">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Real reviews from real customers
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial */}
          <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="card p-6 sm:p-8 md:p-12 relative">
                  {/* Quote Icon */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-yellow-400 opacity-20">
                    <Quote className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                  </div>

                  {/* Customer Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10 text-black">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-yellow-400 shadow-xl"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                        {testimonials[currentIndex].role}
                      </p>
                      {/* Rating Stars */}
                      <div className="flex gap-1 justify-center sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div className="relative z-10">
                    <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed text-center sm:text-left italic">
                      "{testimonials[currentIndex].text}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 sm:-left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black p-2 sm:p-3 rounded-full shadow-xl transition-all z-20 border-2 border-gray-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 sm:-right-4 md:-right-12 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black p-2 sm:p-3 rounded-full shadow-xl transition-all z-20 border-2 border-gray-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 sm:h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-yellow-400 w-8 sm:w-12'
                    : 'bg-gray-300 w-2 sm:w-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-8 sm:mt-12"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-1">
                4.9
              </div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" />
                ))}
              </div>
              <div className="text-xs sm:text-sm text-gray-900 font-semibold">
                Average Rating
              </div>
            </div>
            <div className="text-center border-x-2 border-black/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-1">
                2500+
              </div>
              <div className="text-xs sm:text-sm text-gray-900 font-semibold">
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-1">
                98%
              </div>
              <div className="text-xs sm:text-sm text-gray-900 font-semibold">
                Satisfaction
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}