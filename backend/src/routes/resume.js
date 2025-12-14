const express = require('express')
const router = express.Router()
const resumeController = require('../controllers/resumeController')
const { authenticateToken, checkUsageLimits } = require('../middleware/auth')
const fileService = require('../services/fileService')

// Apply authentication to all routes
router.use(authenticateToken)

// Upload resume
router.post('/upload', 
  checkUsageLimits('resumesUploaded'),
  (req, res, next) => {
    fileService.upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          error: 'Upload Error',
          message: err.message
        })
      }
      next()
    })
  },
  resumeController.uploadResume
)

// Analyze resume
router.post('/analyze/:resumeId', 
  checkUsageLimits('analysesPerformed'),
  resumeController.analyzeResume
)

// Match job description
router.post('/match/:resumeId', 
  checkUsageLimits('jobMatches'),
  resumeController.matchJobDescription
)

// Get resume analysis
router.get('/analysis/:resumeId', resumeController.getResumeAnalysis)

// Get user's resumes
router.get('/list', resumeController.getUserResumes)

// Get job matches for a resume
router.get('/:resumeId/matches', resumeController.getJobMatches)

// Delete resume
router.delete('/:resumeId', resumeController.deleteResume)

module.exports = router