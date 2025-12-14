const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Resume = require('../models/Resume')
const JobMatch = require('../models/JobMatch')
const { authenticateToken } = require('../middleware/auth')

// Admin middleware (simple check - in production, use proper role-based auth)
const requireAdmin = (req, res, next) => {
  // For demo purposes, check if user email contains 'admin'
  // In production, implement proper role-based authentication
  if (!req.user.email.includes('admin')) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Admin access required'
    })
  }
  next()
}

// Apply authentication and admin check to all routes
router.use(authenticateToken)
router.use(requireAdmin)

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [userStats, resumeStats, matchStats] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            freeUsers: { $sum: { $cond: [{ $eq: ['$subscription', 'free'] }, 1, 0] } },
            premiumUsers: { $sum: { $cond: [{ $eq: ['$subscription', 'premium'] }, 1, 0] } },
            enterpriseUsers: { $sum: { $cond: [{ $eq: ['$subscription', 'enterprise'] }, 1, 0] } }
          }
        }
      ]),
      
      // Resume statistics
      Resume.aggregate([
        {
          $group: {
            _id: null,
            totalResumes: { $sum: 1 },
            analyzedResumes: { $sum: { $cond: [{ $eq: ['$status', 'analyzed'] }, 1, 0] } },
            processingResumes: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
            errorResumes: { $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] } },
            averageScore: { $avg: '$analysis.overallScore' }
          }
        }
      ]),
      
      // Job match statistics
      JobMatch.aggregate([
        {
          $group: {
            _id: null,
            totalMatches: { $sum: 1 },
            averageMatchScore: { $avg: '$matchScore' },
            highMatches: { $sum: { $cond: [{ $gte: ['$matchScore', 80] }, 1, 0] } }
          }
        }
      ])
    ])

    // Get recent activity
    const recentUsers = await User.find()
      .select('email name subscription createdAt')
      .sort({ createdAt: -1 })
      .limit(10)

    const recentResumes = await Resume.find()
      .populate('userId', 'email name')
      .select('originalName status createdAt userId')
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      dashboard: {
        stats: {
          users: userStats[0] || { totalUsers: 0, freeUsers: 0, premiumUsers: 0, enterpriseUsers: 0 },
          resumes: resumeStats[0] || { totalResumes: 0, analyzedResumes: 0, processingResumes: 0, errorResumes: 0, averageScore: 0 },
          matches: matchStats[0] || { totalMatches: 0, averageMatchScore: 0, highMatches: 0 }
        },
        recentActivity: {
          users: recentUsers,
          resumes: recentResumes
        }
      }
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    res.status(500).json({
      error: 'Failed to get admin dashboard',
      message: error.message
    })
  }
})

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query

    const query = search 
      ? { 
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } }
          ]
        }
      : {}

    const users = await User.find(query)
      .select('email name subscription usageStats createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Failed to get users',
      message: error.message
    })
  }
})

// Get system health
router.get('/health', async (req, res) => {
  try {
    const [dbStats, systemStats] = await Promise.all([
      // Database statistics
      Promise.all([
        User.countDocuments(),
        Resume.countDocuments(),
        JobMatch.countDocuments()
      ]),
      
      // System statistics
      {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    ])

    res.json({
      health: {
        status: 'healthy',
        database: {
          users: dbStats[0],
          resumes: dbStats[1],
          jobMatches: dbStats[2]
        },
        system: systemStats,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      health: {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    })
  }
})

module.exports = router