// "use client";

// import Link from 'next/link';
// import Image from 'next/image';
// import Header from '../../components/Header';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Header />
//       <div className="hero bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Burgers')" }}>
//         <div className="text-center">
//           <Image src="https://via.placeholder.com/150?text=Owner" alt="Owner" width={150} height={150} className="mx-auto mb-4 rounded-full" />
//           <h1 className="text-4xl font-bold text-yellow-400">Welcome to Usman Fast Food</h1>
//           <Link href="/menu">
//             <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded">Order Now</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
  }, []);

  return (
    <>
      <Head>
        <title>Usman Fast Food - Delicious Food Delivered Fast</title>
        <meta name="description" content="Order delicious burgers, pizzas, fries and drinks from Usman Fast Food" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header cartCount={cartCount} />

        {/* Hero Section */}
        <section 
          className="relative h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200')"
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 animate-fadeIn">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
                  alt="Owner Usman"
                  className="w-40 h-40 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl object-cover"
                />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-400">
                Welcome to Usman Fast Food
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                Your favorite fast food, delivered fresh and fast to your doorstep
              </p>
              <Link href="/menu">
                <button className="btn-primary text-lg flex items-center mx-auto gap-2">
                  Order Now <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center p-8">
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quality Food</h3>
                <p className="text-gray-600">Fresh ingredients, authentic taste, made with love</p>
              </div>
              <div className="card text-center p-8">
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Fast Service</h3>
                <p className="text-gray-600">Quick preparation and delivery to satisfy your hunger</p>
              </div>
              <div className="card text-center p-8">
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Free Delivery</h3>
                <p className="text-gray-600">Fast and free delivery to your location</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Hungry? Order Now!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Browse our delicious menu and place your order in minutes
            </p>
            <Link href="/menu">
              <button className="btn-primary text-lg">View Menu</button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">&copy; 2024 Usman Fast Food. All rights reserved.</p>
            <p className="text-gray-400">Made with ❤️ in Pakistan</p>
          </div>
        </footer>
      </div>
    </>
  );
}