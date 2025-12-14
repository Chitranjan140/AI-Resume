const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticateToken } = require('../middleware/auth')

// Apply authentication to all routes
router.use(authenticateToken)

// Get user profile
router.get('/profile', userController.getProfile)

// Update user profile
router.put('/profile', userController.updateProfile)

// Get dashboard data
router.get('/dashboard', userController.getDashboard)

// Get usage statistics
router.get('/usage', userController.getUsageStats)

module.exports = router