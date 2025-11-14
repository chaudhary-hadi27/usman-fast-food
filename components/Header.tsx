'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition">
            Usman Fast Food
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li><Link href="/" className="hover:text-yellow-400 transition">Home</Link></li>
            <li><Link href="/menu" className="hover:text-yellow-400 transition">Menu</Link></li>
            <li><Link href="/track" className="hover:text-yellow-400 transition">Track Order</Link></li>
            <li><Link href="/about" className="hover:text-yellow-400 transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
            <li>
              <Link href="/cart" className="relative hover:text-yellow-400 transition flex items-center">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-yellow-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-3 pb-4">
            <li><Link href="/" className="block hover:text-yellow-400 transition">Home</Link></li>
            <li><Link href="/menu" className="block hover:text-yellow-400 transition">Menu</Link></li>
            <li><Link href="/track" className="block hover:text-yellow-400 transition">Track Order</Link></li>
            <li><Link href="/about" className="block hover:text-yellow-400 transition">About</Link></li>
            <li><Link href="/contact" className="block hover:text-yellow-400 transition">Contact</Link></li>
            <li>
              <Link href="/cart" className="flex items-center hover:text-yellow-400 transition">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}