"use client";

import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="hero bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Burgers')" }}>
        <div className="text-center">
          <Image src="https://via.placeholder.com/150?text=Owner" alt="Owner" width={150} height={150} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-4xl font-bold text-yellow-400">Welcome to Usman Fast Food</h1>
          <Link href="/menu">
            <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded">Order Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}