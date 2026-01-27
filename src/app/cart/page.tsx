// src/app/cart/page.tsx - COMPLETE WITH IMPROVED LOCATION
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, Navigation, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  accuracy: number;
  source: 'gps' | 'wifi' | 'ip';
}

export default function Cart() {
  const router = useRouter();
  const { 
    cart, 
    isLoading: cartLoading,
    removeItem, 
    incrementQuantity, 
    decrementQuantity,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Location states
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Multiple API Reverse Geocoding
  const reverseGeocode = async (lat: number, lon: number) => {
    // Try API 1: OpenStreetMap
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        { headers: { 'User-Agent': 'UsmanFastFood/1.0' } }
      );
      const data = await response.json();
      if (data.display_name) {
        return {
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
          country: data.address?.country || 'Unknown'
        };
      }
    } catch (error) {
      console.log('OSM failed, trying fallback...');
    }

    // Try API 2: BigDataCloud (No API key needed)
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      if (data.locality) {
        return {
          address: `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`,
          city: data.locality || 'Unknown',
          country: data.countryName || 'Unknown'
        };
      }
    } catch (error) {
      console.log('BigDataCloud failed');
    }

    // Fallback
    return {
      address: `Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      city: 'Unknown',
      country: 'Unknown'
    };
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Location not supported');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Determine source
        let source: 'gps' | 'wifi' | 'ip' = 'ip';
        if (accuracy < 20) source = 'gps';
        else if (accuracy < 100) source = 'wifi';
        
        try {
          const geocodeResult = await reverseGeocode(latitude, longitude);
          
          const locationInfo: LocationData = {
            latitude,
            longitude,
            address: geocodeResult.address,
            city: geocodeResult.city,
            country: geocodeResult.country,
            accuracy: Math.round(accuracy),
            source
          };
          
          setLocationData(locationInfo);
          setDeliveryAddress(geocodeResult.address);
          
          if (accuracy < 20) {
            toast.success('📍 Exact location detected! (GPS)', { icon: '✅' });
          } else if (accuracy < 100) {
            toast.success('📍 Location detected (Wi-Fi)', { icon: '⚠️' });
          } else {
            toast.success('📍 Approximate location', { icon: 'ℹ️' });
          }
        } catch (error) {
          const fallbackAddress = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
          setLocationData({
            latitude,
            longitude,
            address: fallbackAddress,
            city: 'Unknown',
            country: 'Unknown',
            accuracy: Math.round(accuracy),
            source
          });
          setDeliveryAddress(fallbackAddress);
          toast.success('Location coordinates captured!');
        }
        
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '❌ Location permission denied. Please enable in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Location unavailable. Try moving to an open area.';
            break;
          case error.TIMEOUT:
            errorMessage = '❌ Request timed out. Please try again.';
            break;
        }
        
        setLocationError(errorMessage);
        toast.error(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    
    if (updateQuantity(id, quantity)) {
      toast.success('Quantity updated');
    } else {
      toast.error('Maximum quantity is 20');
    }
  };

  const totalAmount = getTotal();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        specialInstructions,
        locationData: locationData ? {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          detectedCity: locationData.city,
          detectedCountry: locationData.country,
          accuracy: locationData.accuracy,
          source: locationData.source
        } : null,
        items: cart.map(item => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        toast.success('Order placed successfully! 🎉');
        router.push(`/track?orderId=${data.orderId}`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyInfo = () => {
    if (!locationData) return null;
    const acc = locationData.accuracy;
    
    if (acc < 20) {
      return {
        color: 'green',
        icon: CheckCircle,
        label: 'Excellent',
        description: 'GPS - Very precise location',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        borderColor: 'border-green-300'
      };
    } else if (acc < 100) {
      return {
        color: 'yellow',
        icon: AlertCircle,
        label: 'Good',
        description: 'Wi-Fi - Good accuracy',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-300'
      };
    } else {
      return {
        color: 'orange',
        icon: AlertCircle,
        label: 'Fair',
        description: 'Network - Approximate location',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-900',
        borderColor: 'border-orange-300'
      };
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="text-center py-20">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-8 sm:mb-12"
        >
          Your <span className="text-gradient">Cart</span>
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-20"
          >
            <ShoppingBag className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">Add some delicious items from our menu!</p>
            <a href="/menu">
              <button className="btn-primary text-base sm:text-lg">
                Browse Menu <ArrowRight className="inline w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </a>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="card flex items-center p-3 sm:p-4 md:p-6 gap-3 sm:gap-4"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-cover rounded-lg shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-black truncate">{item.name}</h3>
                      <p className="text-yellow-600 font-bold text-sm sm:text-base md:text-lg">Rs. {item.price}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Rs. {item.price * item.quantity} total</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => decrementQuantity(item._id)}
                          className="bg-white hover:bg-gray-200 p-1.5 sm:p-2 rounded-lg transition shadow-sm"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          className="w-12 sm:w-14 text-center font-black border-0 bg-transparent text-sm sm:text-base focus:outline-none"
                        />
                        <button
                          onClick={() => incrementQuantity(item._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 p-1.5 sm:p-2 rounded-lg transition shadow-sm"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        className="text-red-500 hover:text-red-700 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 sm:p-6 lg:sticky lg:top-24"
              >
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Order Details</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  
                  {/* AUTO LOCATION SECTION */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Delivery Address *</label>
                    
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="w-full mb-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Detecting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5" />
                          Auto Detect Location (High Accuracy)
                        </>
                      )}
                    </button>

                    {/* Accuracy Indicator */}
                    {locationData && (() => {
                      const info = getAccuracyInfo();
                      if (!info) return null;
                      const Icon = info.icon;
                      return (
                        <div className={`${info.bgColor} ${info.textColor} ${info.borderColor} border-2 rounded-lg p-3 mb-3`}>
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-xs">
                                  Accuracy: {info.label} ({locationData.accuracy}m)
                                </p>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-white rounded-full">
                                  {locationData.source.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs opacity-90">{info.description}</p>
                              {locationData.accuracy > 50 && (
                                <p className="text-xs mt-1 font-semibold">
                                  💡 Go near window for better accuracy
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {locationData && (
                      <div className="mb-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-green-900 mb-1">Location Detected:</p>
                            <p className="text-xs text-green-700">{locationData.city}, {locationData.country}</p>
                            <p className="text-xs text-green-600 mt-1">
                              📍 {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {locationError && (
                      <div className="mb-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="text-xs text-red-700">{locationError}</p>
                      </div>
                    )}

                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      rows={3}
                      placeholder="Enter or edit your address"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Use mobile phone for best GPS accuracy
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Special Instructions (Optional)</label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      rows={2}
                      placeholder="Extra spicy, no onions, etc."
                      maxLength={500}
                    />
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-3 sm:pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-bold">Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Delivery:</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl sm:text-2xl font-black border-t-2 border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-yellow-600">Rs. {totalAmount}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4 sm:w-5 sm:h-5 border-2"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}