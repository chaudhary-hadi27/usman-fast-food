// FILE: components/LiveOrderCounter.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, TrendingUp } from 'lucide-react';

interface RecentOrder {
  id: number;
  customerName: string;
  item: string;
  location: string;
  time: string;
}

export default function LiveOrderCounter() {
  const [orderCount, setOrderCount] = useState(1247);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const dummyOrders: RecentOrder[] = [
    { id: 1, customerName: 'Ahmed K.', item: 'Double Beef Burger', location: 'DHA, Lahore', time: 'Just now' },
    { id: 2, customerName: 'Sara M.', item: 'Margherita Pizza', location: 'Gulberg, Lahore', time: '2 mins ago' },
    { id: 3, customerName: 'Hassan A.', item: 'Chicken Wings', location: 'Johar Town, Lahore', time: '5 mins ago' },
    { id: 4, customerName: 'Fatima N.', item: 'Family Combo', location: 'Model Town, Lahore', time: '8 mins ago' },
    { id: 5, customerName: 'Ali R.', item: 'Crispy Fries', location: 'Cantt, Lahore', time: '12 mins ago' }
  ];

  useEffect(() => {
    setRecentOrders(dummyOrders);

    // Increment order count every 10 seconds
    const countInterval = setInterval(() => {
      setOrderCount(prev => prev + 1);
    }, 10000);

    // Rotate through recent orders every 4 seconds
    const orderInterval = setInterval(() => {
      setCurrentOrderIndex(prev => (prev + 1) % dummyOrders.length);
    }, 4000);

    return () => {
      clearInterval(countInterval);
      clearInterval(orderInterval);
    };
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Order Counter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 sm:gap-6"
          >
            <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border-2 border-white/30">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
            </div>
            <div className="text-white">
              <motion.div
                key={orderCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 sm:mb-2 drop-shadow-lg"
              >
                {orderCount.toLocaleString()}
              </motion.div>
              <div className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 drop-shadow-md">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-white">Orders Delivered This Month</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders Ticker */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full lg:max-w-2xl"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 min-h-[120px] sm:min-h-[140px] border-2 border-white/30">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse shadow-lg" />
                <span className="text-white font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider drop-shadow-md">
                  Live Orders
                </span>
              </div>

              <AnimatePresence mode="wait">
                {recentOrders.length > 0 && (
                  <motion.div
                    key={currentOrderIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="font-black text-base sm:text-lg md:text-xl mb-1 drop-shadow-md">
                          {recentOrders[currentOrderIndex].customerName}
                        </div>
                        <div className="text-white/95 text-sm sm:text-base font-semibold drop-shadow-sm">
                          ordered <span className="font-bold">{recentOrders[currentOrderIndex].item}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs sm:text-sm text-white/90 font-semibold drop-shadow-sm">
                          {recentOrders[currentOrderIndex].time}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-white/90 flex items-center gap-1 font-medium drop-shadow-sm">
                      📍 {recentOrders[currentOrderIndex].location}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 justify-center">
                {dummyOrders.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentOrderIndex
                        ? 'bg-white w-6 sm:w-8 shadow-lg'
                        : 'bg-white/50 w-1.5 sm:w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}