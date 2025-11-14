'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Header from '../../../components/Header';
import { Send, Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+92 300 1234567', '+92 321 7654321'],
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@usmanfastfood.com', 'orders@usmanfastfood.com'],
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['123 Food Street', 'Lahore, Punjab, Pakistan'],
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section 
          className="relative pt-32 pb-20 overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-full">
                  <MessageCircle className="w-16 h-16 text-black" />
                </div>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Get In <span className="text-yellow-400 block sm:inline mt-2 sm:mt-0">Touch</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-gray-100">
                  <h2 className="text-4xl font-black mb-3 text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600 mb-8 text-lg">Fill out the form below and we'll get back to you shortly</p>
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-6 mb-8"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500 p-3 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-green-900 text-lg">Thank you for contacting us!</p>
                          <p className="text-green-700">We'll get back to you as soon as possible.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black mb-2 text-gray-700">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold text-lg"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-black mb-2 text-gray-700">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black mb-2 text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold"
                          placeholder="03XX-XXXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black mb-2 text-gray-700">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all font-semibold resize-none"
                        rows={6}
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black py-5 px-6 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-3 border-black border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Contact Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`${info.bgColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-100`}
                      >
                        <div className="flex items-start gap-5">
                          <div className={`bg-gradient-to-br ${info.color} p-4 rounded-2xl shadow-lg flex-shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-black text-2xl mb-3 text-gray-900">{info.title}</h3>
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-gray-700 text-lg font-semibold mb-1">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* WhatsApp CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-2xl p-8 text-white"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-10 h-10" />
                    <h3 className="text-3xl font-black">Quick Response?</h3>
                  </div>
                  <p className="text-xl mb-6 text-white/90 font-semibold">
                    Chat with us directly on WhatsApp for instant support and quick answers!
                  </p>
                  <a 
                    href="https://wa.me/923001234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-green-600 font-black py-5 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-xl text-lg flex items-center justify-center gap-3"
                    >
                      <Phone className="w-6 h-6" />
                      Chat on WhatsApp
                    </motion.button>
                  </a>
                </motion.div>

                {/* Opening Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-black to-gray-900 rounded-3xl shadow-2xl p-8 text-white"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-400 p-3 rounded-2xl">
                      <Clock className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-3xl font-black">Opening Hours</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                      <span className="font-bold text-lg">Monday - Sunday</span>
                      <span className="font-black text-yellow-400 text-lg">11:00 AM - 11:00 PM</span>
                    </div>
                    <div className="p-4 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-xl">
                      <p className="text-yellow-400 font-black text-center text-lg">
                        🎉 Always Open for Online Orders!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}