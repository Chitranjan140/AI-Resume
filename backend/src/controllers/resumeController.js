const Resume = require('../models/Resume')
const JobMatch = require('../models/JobMatch')
const User = require('../models/User')
const fileService = require('../services/fileService')
const aiService = require('../services/aiService')
const crypto = require('crypto')

class ResumeController {
  async uploadResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please select a resume file to upload'
        })
      }

      const { file, user } = req
      
      // Validate file
      if (!fileService.validateFileSize(file.size)) {
        await fileService.cleanupLocalFile(file.path)
        return res.status(400).json({
          error: 'File too large',
          message: 'File size must be less than 10MB'
        })
      }

      if (!fileService.validateFileType(file.mimetype)) {
        await fileService.cleanupLocalFile(file.path)
        return res.status(400).json({
          error: 'Invalid file type',
          message: 'Only PDF and DOCX files are supported'
        })
      }

      // Extract text from file
      const extractedText = await fileService.extractTextFromFile(file.path, file.mimetype)
      
      // Upload to Cloudinary
      const cloudinaryResult = await fileService.uploadToCloudinary(
        file.path, 
        file.originalname, 
        user._id.toString()
      )

      // Create resume record
      const resume = new Resume({
        userId: user._id,
        filename: fileService.generateUniqueFilename(file.originalname),
        originalName: file.originalname,
        fileUrl: cloudinaryResult.url,
        fileSize: file.size,
        mimeType: file.mimetype,
        extractedText,
        textLength: extractedText.length,
        status: 'uploaded'
      })

      await resume.save()

      // Update user stats
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'usageStats.resumesUploaded': 1 }
      })

      // Cleanup local file
      await fileService.cleanupLocalFile(file.path)

      res.status(201).json({
        message: 'Resume uploaded successfully',
        resume: {
          id: resume._id,
          filename: resume.originalName,
          status: resume.status,
          uploadedAt: resume.createdAt
        }
      })

    } catch (error) {
      console.error('Resume upload error:', error)
      
      // Cleanup on error
      if (req.file?.path) {
        await fileService.cleanupLocalFile(req.file.path)
      }

      res.status(500).json({
        error: 'Upload failed',
        message: error.message || 'Failed to upload resume'
      })
    }
  }

  async analyzeResume(req, res) {
    try {
      const { resumeId } = req.params
      const { user } = req

      const resume = await Resume.findOne({ 
        _id: resumeId, 
        userId: user._id 
      })

      if (!resume) {
        return res.status(404).json({
          error: 'Resume not found',
          message: 'Resume not found or access denied'
        })
      }

      if (resume.status === 'processing') {
        return res.status(409).json({
          error: 'Already processing',
          message: 'Resume analysis is already in progress'
        })
      }

      if (resume.status === 'analyzed' && resume.analysis) {
        return res.json({
          message: 'Resume already analyzed',
          analysis: resume.analysis
        })
      }

      // Update status to processing
      resume.status = 'processing'
      await resume.save()

      try {
        const startTime = Date.now()
        
        // Analyze with AI
        const analysis = await aiService.analyzeResume(resume.extractedText)
        
        const processingTime = Date.now() - startTime

        // Add metadata
        analysis.analysisMetadata = {
          processingTime,
          aiModel: 'gpt-3.5-turbo',
          confidence: 0.85
        }

        // Update resume with analysis
        resume.analysis = analysis
        resume.status = 'analyzed'
        await resume.save()

        // Update user stats
        await User.findByIdAndUpdate(user._id, {
          $inc: { 'usageStats.analysesPerformed': 1 }
        })

        res.json({
          message: 'Resume analyzed successfully',
          analysis: resume.analysis
        })

      } catch (aiError) {
        console.error('AI Analysis error:', aiError)
        
        resume.status = 'error'
        resume.errorMessage = aiError.message
        await resume.save()

        res.status(500).json({
          error: 'Analysis failed',
          message: 'Failed to analyze resume with AI'
        })
      }

    } catch (error) {
      console.error('Resume analysis error:', error)
      res.status(500).json({
        error: 'Analysis failed',
        message: error.message || 'Failed to analyze resume'
      })
    }
  }

  async matchJobDescription(req, res) {
    try {
      const { resumeId } = req.params
      const { jobDescription, jobTitle, company } = req.body
      const { user } = req

      if (!jobDescription || jobDescription.trim().length < 50) {
        return res.status(400).json({
          error: 'Invalid job description',
          message: 'Job description must be at least 50 characters long'
        })
      }

      const resume = await Resume.findOne({ 
        _id: resumeId, 
        userId: user._id,
        status: 'analyzed'
      })

      if (!resume || !resume.analysis) {
        return res.status(404).json({
          error: 'Resume not found or not analyzed',
          message: 'Please analyze your resume first before job matching'
        })
      }

      // Create hash of job description to prevent duplicates
      const jobDescriptionHash = crypto
        .createHash('md5')
        .update(jobDescription.trim().toLowerCase())
        .digest('hex')

      // Check if this job match already exists
      let existingMatch = await JobMatch.findOne({
        resumeId,
        jobDescriptionHash
      })

      if (existingMatch) {
        return res.json({
          message: 'Job match already exists',
          match: existingMatch
        })
      }

      const startTime = Date.now()

      // Perform AI job matching
      const matchAnalysis = await aiService.matchJobDescription(
        resume.extractedText,
        jobDescription,
        resume.analysis
      )

      const processingTime = Date.now() - startTime

      // Create job match record
      const jobMatch = new JobMatch({
        userId: user._id,
        resumeId,
        jobTitle: jobTitle || 'Untitled Position',
        company: company || '',
        jobDescription,
        jobDescriptionHash,
        matchScore: matchAnalysis.matchScore,
        analysis: matchAnalysis,
        metadata: {
          processingTime,
          aiModel: 'gpt-3.5-turbo',
          confidence: 0.85
        }
      })

      await jobMatch.save()

      // Update user stats
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'usageStats.jobMatches': 1 }
      })

      res.status(201).json({
        message: 'Job match completed successfully',
        match: jobMatch
      })

    } catch (error) {
      console.error('Job matching error:', error)
      res.status(500).json({
        error: 'Job matching failed',
        message: error.message || 'Failed to match job description'
      })
    }
  }

  async getResumeAnalysis(req, res) {
    try {
      const { resumeId } = req.params
      const { user } = req

      const resume = await Resume.findOne({ 
        _id: resumeId, 
        userId: user._id 
      }).select('analysis status createdAt originalName')

      if (!resume) {
        return res.status(404).json({
          error: 'Resume not found',
          message: 'Resume not found or access denied'
        })
      }

      res.json({
        resume: {
          id: resume._id,
          filename: resume.originalName,
          status: resume.status,
          analysis: resume.analysis,
          analyzedAt: resume.createdAt
        }
      })

    } catch (error) {
      console.error('Get resume analysis error:', error)
      res.status(500).json({
        error: 'Failed to get analysis',
        message: error.message || 'Failed to retrieve resume analysis'
      })
    }
  }

  async getUserResumes(req, res) {
    try {
      const { user } = req
      const { page = 1, limit = 10 } = req.query

      const resumes = await Resume.find({ userId: user._id })
        .select('originalName status createdAt analysis.overallScore analysis.atsScore')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await Resume.countDocuments({ userId: user._id })

      res.json({
        resumes: resumes.map(resume => ({
          id: resume._id,
          filename: resume.originalName,
          status: resume.status,
          overallScore: resume.analysis?.overallScore || null,
          atsScore: resume.analysis?.atsScore || null,
          uploadedAt: resume.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: resumes.length,
          totalResumes: total
        }
      })

    } catch (error) {
      console.error('Get user resumes error:', error)
      res.status(500).json({
        error: 'Failed to get resumes',
        message: error.message || 'Failed to retrieve resumes'
      })
    }
  }

  async getJobMatches(req, res) {
    try {
      const { resumeId } = req.params
      const { user } = req
      const { page = 1, limit = 10 } = req.query

      const matches = await JobMatch.find({ 
        resumeId, 
        userId: user._id 
      })
        .select('jobTitle company matchScore createdAt analysis.strengths analysis.weaknesses')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await JobMatch.countDocuments({ resumeId, userId: user._id })

      res.json({
        matches: matches.map(match => ({
          id: match._id,
          jobTitle: match.jobTitle,
          company: match.company,
          matchScore: match.matchScore,
          strengths: match.analysis.strengths,
          weaknesses: match.analysis.weaknesses,
          matchedAt: match.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: matches.length,
          totalMatches: total
        }
      })

    } catch (error) {
      console.error('Get job matches error:', error)
      res.status(500).json({
        error: 'Failed to get job matches',
        message: error.message || 'Failed to retrieve job matches'
      })
    }
  }

  async deleteResume(req, res) {
    try {
      const { resumeId } = req.params
      const { user } = req

      const resume = await Resume.findOne({ 
        _id: resumeId, 
        userId: user._id 
      })

      if (!resume) {
        return res.status(404).json({
          error: 'Resume not found',
          message: 'Resume not found or access denied'
        })
      }

      // Delete from Cloudinary (extract public_id from URL)
      const publicId = resume.fileUrl.split('/').pop().split('.')[0]
      await fileService.deleteFromCloudinary(publicId)

      // Delete associated job matches
      await JobMatch.deleteMany({ resumeId })

      // Delete resume
      await Resume.findByIdAndDelete(resumeId)

      res.json({
        message: 'Resume deleted successfully'
      })

    } catch (error) {
      console.error('Delete resume error:', error)
      res.status(500).json({
        error: 'Failed to delete resume',
        message: error.message || 'Failed to delete resume'
      })
    }
  }
}

module.exports = new ResumeController()