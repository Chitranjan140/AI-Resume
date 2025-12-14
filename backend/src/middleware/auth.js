const admin = require('firebase-admin')
const User = require('../models/User')

// Initialize Firebase Admin (temporarily disabled for development)
let firebaseInitialized = false
try {
  if (!admin.apps.length && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY !== 'YOUR_PRIVATE_KEY') {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    })
    firebaseInitialized = true
  }
} catch (error) {
  console.warn('Firebase Admin not initialized:', error.message)
}

const authenticateToken = async (req, res, next) => {
  try {
    // Skip authentication in development if Firebase is not configured
    if (!firebaseInitialized) {
      req.user = {
        firebaseUid: 'dev-user',
        email: 'dev@example.com',
        name: 'Development User',
        subscription: 'free',
        usageStats: {
          resumesUploaded: 0,
          analysesPerformed: 0,
          jobMatches: 0
        }
      }
      return next()
    }

    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token)
    
    // Find or create user in our database
    let user = await User.findOne({ firebaseUid: decodedToken.uid })
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        profilePicture: decodedToken.picture
      })
      await user.save()
    }

    // Attach user to request
    req.user = user
    req.firebaseUser = decodedToken
    
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Please sign in again'
      })
    }
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  }
}

const requireSubscription = (requiredLevel = 'free') => {
  return (req, res, next) => {
    const subscriptionLevels = {
      'free': 0,
      'premium': 1,
      'enterprise': 2
    }
    
    const userLevel = subscriptionLevels[req.user.subscription] || 0
    const requiredLevelNum = subscriptionLevels[requiredLevel] || 0
    
    if (userLevel < requiredLevelNum) {
      return res.status(403).json({
        error: 'Subscription Required',
        message: `This feature requires ${requiredLevel} subscription`,
        currentSubscription: req.user.subscription,
        requiredSubscription: requiredLevel
      })
    }
    
    next()
  }
}

const checkUsageLimits = (feature) => {
  return async (req, res, next) => {
    try {
      // Skip usage limits in development
      if (process.env.NODE_ENV === 'development') {
        return next()
      }
      
      const limits = {
        free: {
          resumesUploaded: 3,
          analysesPerformed: 5,
          jobMatches: 10
        },
        premium: {
          resumesUploaded: 20,
          analysesPerformed: 50,
          jobMatches: 100
        },
        enterprise: {
          resumesUploaded: Infinity,
          analysesPerformed: Infinity,
          jobMatches: Infinity
        }
      }
      
      const userLimits = limits[req.user.subscription] || limits.free
      const currentUsage = req.user.usageStats[feature] || 0
      
      if (currentUsage >= userLimits[feature]) {
        return res.status(429).json({
          error: 'Usage Limit Exceeded',
          message: `You have reached your ${feature} limit for ${req.user.subscription} plan`,
          currentUsage,
          limit: userLimits[feature],
          upgradeRequired: req.user.subscription === 'free'
        })
      }
      
      next()
    } catch (error) {
      console.error('Usage limit check error:', error)
      next(error)
    }
  }
}

module.exports = {
  authenticateToken,
  requireSubscription,
  checkUsageLimits
}