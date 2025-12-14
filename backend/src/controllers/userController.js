const User = require('../models/User')
const Resume = require('../models/Resume')
const JobMatch = require('../models/JobMatch')

class UserController {
  async getProfile(req, res) {
    try {
      const { user } = req

      res.json({
        profile: {
          id: user._id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
          subscription: user.subscription,
          usageStats: user.usageStats,
          preferences: user.preferences,
          memberSince: user.createdAt
        }
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        error: 'Failed to get profile',
        message: error.message || 'Failed to retrieve user profile'
      })
    }
  }

  async updateProfile(req, res) {
    try {
      const { user } = req
      const { name, preferences } = req.body

      const updateData = {}
      
      if (name && name.trim()) {
        updateData.name = name.trim()
      }
      
      if (preferences) {
        if (preferences.theme && ['light', 'dark'].includes(preferences.theme)) {
          updateData['preferences.theme'] = preferences.theme
        }
        if (typeof preferences.notifications === 'boolean') {
          updateData['preferences.notifications'] = preferences.notifications
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      )

      res.json({
        message: 'Profile updated successfully',
        profile: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          profilePicture: updatedUser.profilePicture,
          subscription: updatedUser.subscription,
          preferences: updatedUser.preferences
        }
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        error: 'Failed to update profile',
        message: error.message || 'Failed to update user profile'
      })
    }
  }

  async getDashboard(req, res) {
    try {
      const { user } = req

      // Get user's resume statistics
      const resumeStats = await Resume.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: null,
            totalResumes: { $sum: 1 },
            analyzedResumes: {
              $sum: { $cond: [{ $eq: ['$status', 'analyzed'] }, 1, 0] }
            },
            averageScore: {
              $avg: '$analysis.overallScore'
            },
            averageAtsScore: {
              $avg: '$analysis.atsScore'
            }
          }
        }
      ])

      // Get job match statistics
      const matchStats = await JobMatch.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: null,
            totalMatches: { $sum: 1 },
            averageMatchScore: { $avg: '$matchScore' },
            highMatches: {
              $sum: { $cond: [{ $gte: ['$matchScore', 80] }, 1, 0] }
            }
          }
        }
      ])

      // Get top skills from analyzed resumes
      const topSkills = await Resume.aggregate([
        { $match: { userId: user._id, status: 'analyzed' } },
        { $unwind: '$analysis.technicalSkills' },
        {
          $group: {
            _id: '$analysis.technicalSkills.name',
            category: { $first: '$analysis.technicalSkills.category' },
            count: { $sum: 1 },
            avgProficiency: { $avg: '$analysis.technicalSkills.yearsOfExperience' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])

      // Get recent activity
      const recentResumes = await Resume.find({ userId: user._id })
        .select('originalName status createdAt analysis.overallScore')
        .sort({ createdAt: -1 })
        .limit(5)

      const recentMatches = await JobMatch.find({ userId: user._id })
        .select('jobTitle company matchScore createdAt')
        .sort({ createdAt: -1 })
        .limit(5)

      // Combine and sort recent activity
      const recentActivity = [
        ...recentResumes.map(resume => ({
          id: resume._id,
          type: 'resume',
          title: `Uploaded "${resume.originalName}"`,
          subtitle: `Score: ${resume.analysis?.overallScore || 'Not analyzed'}`,
          timestamp: resume.createdAt,
          status: resume.status
        })),
        ...recentMatches.map(match => ({
          id: match._id,
          type: 'match',
          title: `Matched with "${match.jobTitle}"`,
          subtitle: `${match.company} - ${match.matchScore}% match`,
          timestamp: match.createdAt,
          status: 'completed'
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)

      const stats = resumeStats[0] || {
        totalResumes: 0,
        analyzedResumes: 0,
        averageScore: 0,
        averageAtsScore: 0
      }

      const matches = matchStats[0] || {
        totalMatches: 0,
        averageMatchScore: 0,
        highMatches: 0
      }

      res.json({
        dashboard: {
          stats: {
            totalResumes: stats.totalResumes,
            analyzedResumes: stats.analyzedResumes,
            totalMatches: matches.totalMatches,
            averageScore: Math.round(stats.averageScore || 0),
            averageAtsScore: Math.round(stats.averageAtsScore || 0),
            averageMatchScore: Math.round(matches.averageMatchScore || 0),
            highMatches: matches.highMatches
          },
          topSkills: topSkills.map(skill => ({
            name: skill._id,
            category: skill.category,
            count: skill.count,
            experience: Math.round(skill.avgProficiency || 0)
          })),
          recentActivity,
          usageStats: user.usageStats,
          subscription: user.subscription
        }
      })
    } catch (error) {
      console.error('Get dashboard error:', error)
      res.status(500).json({
        error: 'Failed to get dashboard',
        message: error.message || 'Failed to retrieve dashboard data'
      })
    }
  }

  async getUsageStats(req, res) {
    try {
      const { user } = req

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

      const userLimits = limits[user.subscription] || limits.free

      res.json({
        usage: {
          current: user.usageStats,
          limits: userLimits,
          subscription: user.subscription,
          percentageUsed: {
            resumesUploaded: userLimits.resumesUploaded === Infinity 
              ? 0 
              : Math.round((user.usageStats.resumesUploaded / userLimits.resumesUploaded) * 100),
            analysesPerformed: userLimits.analysesPerformed === Infinity 
              ? 0 
              : Math.round((user.usageStats.analysesPerformed / userLimits.analysesPerformed) * 100),
            jobMatches: userLimits.jobMatches === Infinity 
              ? 0 
              : Math.round((user.usageStats.jobMatches / userLimits.jobMatches) * 100)
          }
        }
      })
    } catch (error) {
      console.error('Get usage stats error:', error)
      res.status(500).json({
        error: 'Failed to get usage stats',
        message: error.message || 'Failed to retrieve usage statistics'
      })
    }
  }
}

module.exports = new UserController()