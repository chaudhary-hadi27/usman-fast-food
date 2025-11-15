import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true, // Performance: Add index
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
    index: true, // Performance: Search by email
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
      max: 99, // Prevent abuse
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
    index: true, // Performance: Filter by status
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
    maxlength: 500,
  },
  cancelledAt: {
    type: Date,
  },
  cancelReason: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Performance: Compound index for common queries
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);