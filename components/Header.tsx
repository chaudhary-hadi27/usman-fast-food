// FILE: components/Header.tsx (UPDATED)
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface HeaderProps {
  cartCount?: number;
}

interface UserData {
  name: string;
  email: string;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setShowUserMenu(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-xl">

      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0">
            🍔 Usman Fast Food
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-4 xl:space-x-8 items-center">
            {[
              { href: '/', label: 'Home' },
              { href: '/menu', label: 'Menu' },
              { href: '/track', label: 'Track Order' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="text-white hover:text-yellow-400 transition-colors font-semibold relative group text-sm xl:text-base whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
            
            {/* Cart Icon */}
            <li>
              <Link href="/cart" className="relative hover:text-yellow-400 transition flex items-center group ml-2">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-white group-hover:text-yellow-400 transition" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </div>
              </Link>
            </li>

            {/* User Menu */}
            {user ? (
              <li className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline">{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border-2 border-gray-100"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 transition font-semibold"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 transition font-semibold"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li>
                <Link
                  href="/auth/login"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-yellow-400 p-2 hover:bg-yellow-400/10 rounded-lg transition flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <ul className="mt-6 space-y-4 pb-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/menu', label: 'Menu' },
                  { href: '/track', label: 'Track Order' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ].map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      className="block text-white hover:text-yellow-400 transition py-2 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    href="/cart" 
                    className="flex items-center text-white hover:text-yellow-400 transition py-2 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                </motion.li>

                {/* Mobile User Menu */}
                {user ? (
                  <>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-4 border-t border-gray-700"
                    >
                      <div className="flex items-center gap-2 text-yellow-400 py-2 font-bold">
                        <User className="w-5 h-5" />
                        {user.name}
                      </div>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        href="/profile"
                        className="block text-white hover:text-yellow-400 transition py-2 font-semibold pl-7"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left text-red-400 hover:text-red-300 transition py-2 font-semibold pl-7 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4 border-t border-gray-700"
                  >
                    <Link
                      href="/auth/login"
                      className="block bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-4 rounded-lg font-bold text-center transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login / Sign Up
                    </Link>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}