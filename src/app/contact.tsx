import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

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

  return (
    <>
      <Head>
        <title>Contact Us - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold text-center mb-4 text-black">Contact Us</h1>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Have questions? We'd love to hear from you!
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold">Thank you for contacting us!</p>
                    <p>We'll get back to you as soon as possible.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="card p-8">
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-400 p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Phone</h3>
                        <p className="text-gray-600">+92 300 1234567</p>
                        <p className="text-gray-600">+92 321 7654321</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-400 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Email</h3>
                        <p className="text-gray-600">info@usmanfastfood.com</p>
                        <p className="text-gray-600">orders@usmanfastfood.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-400 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Location</h3>
                        <p className="text-gray-600">123 Food Street</p>
                        <p className="text-gray-600">Lahore, Punjab</p>
                        <p className="text-gray-600">Pakistan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="card p-8 bg-green-500 text-white">
                  <h3 className="text-2xl font-bold mb-4">Need Quick Help?</h3>
                  <p className="mb-6">Chat with us directly on WhatsApp for instant support!</p>
                  <a 
                    href="https://wa.me/923001234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Opening Hours */}
                <div className="card p-8 bg-black text-white">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">Opening Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Sunday</span>
                      <span className="font-semibold">11:00 AM - 11:00 PM</span>
                    </div>
                    <p className="text-yellow-400 mt-4">We're always open for online orders!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}