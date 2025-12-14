const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Mobile', 'Design', 'Other'],
    required: true 
  },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  yearsOfExperience: { type: Number, min: 0 }
})

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String },
  field: { type: String },
  gpa: { type: String }
})

const experienceSchema = new mongoose.Schema({
  totalYears: { type: Number, required: true, min: 0 },
  level: { 
    type: String, 
    enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
    required: true 
  },
  roles: [{ type: String }],
  companies: [{ type: String }]
})

const resumeAnalysisSchema = new mongoose.Schema({
  technicalSkills: [skillSchema],
  softSkills: [{ type: String }],
  experience: experienceSchema,
  education: [educationSchema],
  jobRoles: [{ type: String }],
  overallScore: { type: Number, min: 0, max: 100, required: true },
  atsScore: { type: Number, min: 0, max: 100, required: true },
  suggestions: [{ type: String }],
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  keywordDensity: { type: Map, of: Number },
  analysisMetadata: {
    processingTime: { type: Number },
    aiModel: { type: String, default: 'gpt-3.5-turbo' },
    confidence: { type: Number, min: 0, max: 1 }
  }
}, { timestamps: true })

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  extractedText: {
    type: String,
    required: true
  },
  textLength: {
    type: Number,
    required: true
  },
  analysis: resumeAnalysisSchema,
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'error'],
    default: 'uploaded'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes for performance
resumeSchema.index({ userId: 1, createdAt: -1 })
resumeSchema.index({ status: 1 })
resumeSchema.index({ 'analysis.overallScore': -1 })

// Virtual for analysis status
resumeSchema.virtual('isAnalyzed').get(function() {
  return this.status === 'analyzed' && this.analysis
})

module.exports = mongoose.model('Resume', resumeSchema)