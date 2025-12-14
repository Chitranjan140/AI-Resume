const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String
  },
  subscription: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due'],
    default: 'inactive'
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  usageStats: {
    resumesUploaded: { type: Number, default: 0 },
    analysesPerformed: { type: Number, default: 0 },
    jobMatches: { type: Number, default: 0 }
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
})

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ firebaseUid: 1 })
userSchema.index({ createdAt: -1 })

module.exports = mongoose.model('User', userSchema)