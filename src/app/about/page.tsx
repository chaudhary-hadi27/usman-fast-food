import Head from 'next/head';
import Header from '../../../components/Header';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-black">About Usman Fast Food</h1>
            <p className="text-xl text-gray-600">
              Serving delicious food with love since 2020
            </p>
          </div>

          {/* Owner Story */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="card overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="p-8">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
                    alt="Owner Usman"
                    className="w-full h-96 object-cover rounded-lg shadow-xl"
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-yellow-600">Meet the Owner</h2>
                  <h3 className="text-2xl font-semibold mb-4">Muhammad Usman</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Hi! I'm Usman, the proud owner of Usman Fast Food. My passion for cooking started in my 
                    mother's kitchen, where I learned the art of creating delicious meals with love and care.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In 2020, I decided to turn my passion into a business and opened Usman Fast Food. 
                    Our mission is simple: serve high-quality, delicious fast food made with fresh ingredients 
                    and a whole lot of heart.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Every burger, pizza, and fries we serve is prepared with the same care I would use when 
                    cooking for my own family. Thank you for being part of our journey!
                  </p>
                  <p className="text-xl font-semibold text-yellow-600">- Muhammad Usman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <div className="text-5xl mb-4">🍔</div>
                <h3 className="text-2xl font-bold mb-4">Quality First</h3>
                <p className="text-gray-600">
                  We use only the freshest ingredients to ensure every bite is perfect
                </p>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold mb-4">Made with Love</h3>
                <p className="text-gray-600">
                  Every dish is prepared with care and passion for great food
                </p>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4">Fast Service</h3>
                <p className="text-gray-600">
                  Quick preparation and delivery without compromising on quality
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 bg-black text-white">
              <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">Get In Touch</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-gray-300">+92 300 1234567</p>
                    <p className="text-gray-300">+92 321 7654321</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-gray-300">info@usmanfastfood.com</p>
                    <p className="text-gray-300">orders@usmanfastfood.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Location</h3>
                    <p className="text-gray-300">123 Food Street</p>
                    <p className="text-gray-300">Lahore, Punjab, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Hours</h3>
                    <p className="text-gray-300">Mon - Sun: 11:00 AM - 11:00 PM</p>
                    <p className="text-gray-300">Always Open for Orders!</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <a 
                  href="https://wa.me/923001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}