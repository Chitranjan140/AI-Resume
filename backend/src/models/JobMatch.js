const mongoose = require('mongoose')

const jobMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobDescriptionHash: {
    type: String,
    required: true,
    index: true
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analysis: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{
      skill: { type: String, required: true },
      category: { type: String },
      importance: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
    }],
    matchedSkills: [{
      skill: { type: String, required: true },
      category: { type: String },
      proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
    }],
    recommendations: [{ type: String }],
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    experienceMatch: {
      required: { type: Number },
      candidate: { type: Number },
      score: { type: Number, min: 0, max: 100 }
    }
  },
  metadata: {
    processingTime: { type: Number },
    aiModel: { type: String, default: 'gpt-3.5-turbo' },
    confidence: { type: Number, min: 0, max: 1 },
    jobSource: { type: String },
    location: { type: String }
  }
}, {
  timestamps: true
})

// Indexes for performance
jobMatchSchema.index({ userId: 1, createdAt: -1 })
jobMatchSchema.index({ resumeId: 1, createdAt: -1 })
jobMatchSchema.index({ matchScore: -1 })
jobMatchSchema.index({ jobDescriptionHash: 1 })

// Compound index for duplicate prevention
jobMatchSchema.index({ resumeId: 1, jobDescriptionHash: 1 }, { unique: true })

module.exports = mongoose.model('JobMatch', jobMatchSchema)