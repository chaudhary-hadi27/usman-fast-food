import Head from 'next/head';
import Header from '../../../components/Header';
import { Phone, Mail, MapPin, Clock, Heart, Award, Users, TrendingUp } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: '🍔',
      title: 'Quality First',
      description: 'We use only the freshest ingredients to ensure every bite is perfect',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: '❤️',
      title: 'Made with Love',
      description: 'Every dish is prepared with care and passion for great food',
      color: 'from-pink-400 to-red-500'
    },
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Quick preparation and delivery without compromising on quality',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  const stats = [
    { icon: Users, number: '10K+', label: 'Happy Customers', color: 'text-blue-500' },
    { icon: Award, number: '4.9★', label: 'Average Rating', color: 'text-yellow-500' },
    { icon: TrendingUp, number: '50+', label: 'Menu Items', color: 'text-green-500' },
    { icon: Clock, number: '24/7', label: 'Service Available', color: 'text-purple-500' }
  ];

  return (
    <>
      <Head>
        <title>About Us - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section 
          className="relative pt-32 pb-20 overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider mb-6">
                ❤️ Our Story
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                About <span className="text-yellow-400 block sm:inline mt-2 sm:mt-0">Usman Fast Food</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200">
                Serving delicious food with love since 2020
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Owner Story */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-96 lg:h-auto">
                  <img 
                    alt="Owner Usman"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-sm mb-3 inline-block">
                      FOUNDER & CEO
                    </div>
                    <h3 className="text-3xl font-black">Muhammad Usman</h3>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h2 className="text-4xl font-black mb-6 text-gray-900 flex items-center gap-3">
                    <Heart className="w-10 h-10 text-yellow-500" />
                    Meet the Owner
                  </h2>
                  
                  <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                    <p>
                      Hi! I'm <strong className="text-yellow-600">Usman</strong>, the proud owner of Usman Fast Food. 
                      My passion for cooking started in my mother's kitchen, where I learned the art of creating 
                      delicious meals with love and care.
                    </p>
                    <p>
                      In <strong>2020</strong>, I decided to turn my passion into a business and opened Usman Fast Food. 
                      Our mission is simple: serve high-quality, delicious fast food made with fresh ingredients 
                      and a whole lot of heart.
                    </p>
                    <p>
                      Every burger, pizza, and fries we serve is prepared with the same care I would use when 
                      cooking for my own family. Thank you for being part of our journey!
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t-2 border-gray-200">
                    <p className="text-2xl font-black text-yellow-600 italic">
                      "Food is not just about taste, it's about memories and love."
                    </p>
                    <p className="text-gray-600 mt-3 font-semibold">- Muhammad Usman, Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl shadow-2xl p-12">
              <h2 className="text-4xl font-black text-center mb-12 text-white">
                Our <span className="text-yellow-400">Achievements</span>
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className={`${stat.color} w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-5xl font-black text-yellow-400 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-300 font-semibold">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-5xl font-black text-center mb-4 text-gray-900">
              Our <span className="text-yellow-600">Values</span>
            </h2>
            <p className="text-center text-gray-600 text-xl mb-12 max-w-3xl mx-auto">
              These core principles guide everything we do, from ingredient selection to customer service
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-yellow-400"
                >
                  <div className={`h-2 bg-gradient-to-r ${value.color}`} />
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl shadow-2xl p-12 text-white">
              <h2 className="text-4xl font-black mb-10 text-center">
                Get In <span className="text-yellow-400">Touch</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/10 transition">
                  <div className="bg-yellow-400 p-4 rounded-2xl flex-shrink-0">
                    <Phone className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2">Phone</h3>
                    <p className="text-gray-300 text-lg">+92 300 1234567</p>
                    <p className="text-gray-300 text-lg">+92 321 7654321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/10 transition">
                  <div className="bg-yellow-400 p-4 rounded-2xl flex-shrink-0">
                    <Mail className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2">Email</h3>
                    <p className="text-gray-300 text-lg">info@usmanfastfood.com</p>
                    <p className="text-gray-300 text-lg">orders@usmanfastfood.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/10 transition">
                  <div className="bg-yellow-400 p-4 rounded-2xl flex-shrink-0">
                    <MapPin className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2">Location</h3>
                    <p className="text-gray-300 text-lg">123 Food Street</p>
                    <p className="text-gray-300 text-lg">Lahore, Punjab, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/10 transition">
                  <div className="bg-yellow-400 p-4 rounded-2xl flex-shrink-0">
                    <Clock className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2">Hours</h3>
                    <p className="text-gray-300 text-lg">Mon - Sun: 11:00 AM - 11:00 PM</p>
                    <p className="text-yellow-400 font-bold text-lg">Always Open for Orders!</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-8 border-t border-white/10">
                <a 
                  href="https://wa.me/923001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-black py-5 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-2xl text-lg"
                >
                  <Phone className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}