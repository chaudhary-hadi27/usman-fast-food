// models/Order.ts - WITH LOCATION DATA
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
    maxlength: 500,
  },
  // 🆕 LOCATION DATA
  locationData: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    detectedCity: {
      type: String,
    },
    detectedCountry: {
      type: String,
    },
    accuracy: {
      type: Number, // in meters
    },
    source: {
      type: String,
      enum: ['gps', 'wifi', 'ip'],
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    }
  },
  // Map Link for easy navigation
  mapLink: {
    type: String,
  },
  cancelledAt: {
    type: Date,
  },
  cancelReason: {
    type: String,
  },
}, {
  timestamps: true,
});

// Performance indexes
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'locationData.latitude': 1, 'locationData.longitude': 1 }); // For location-based queries

// Pre-save hook to generate map link
OrderSchema.pre('save', function(next) {
  if (this.locationData?.latitude && this.locationData?.longitude) {
    // Google Maps link
    this.mapLink = `https://www.google.com/maps?q=${this.locationData.latitude},${this.locationData.longitude}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);