const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Verify token endpoint
router.post('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      subscription: req.user.subscription
    }
  })
})

// Refresh user data
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      profilePicture: req.user.profilePicture,
      subscription: req.user.subscription,
      usageStats: req.user.usageStats,
      preferences: req.user.preferences,
      memberSince: req.user.createdAt
    }
  })
})

module.exports = router