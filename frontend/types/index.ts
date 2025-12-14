export interface User {
  id: string
  email: string
  name: string
  subscription?: string
  createdAt: string
}

export interface Resume {
  id: string
  userId: string
  filename: string
  fileUrl?: string
  extractedText?: string
  uploadedAt: string
  status: string
  analysis?: ResumeAnalysis
}

export interface ResumeAnalysis {
  id: string
  resumeId: string
  technicalSkills: Skill[]
  softSkills: string[]
  experience: ExperienceLevel
  education: Education[]
  jobRoles: string[]
  overallScore: number
  suggestions: string[]
  atsScore: number
  strengths: string[]
  weaknesses: string[]
  createdAt: string
}

export interface Skill {
  name: string
  category: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsOfExperience?: number
}

export interface ExperienceLevel {
  totalYears: number
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'
  roles: string[]
}

export interface Education {
  degree: string
  institution: string
  year?: string
  field?: string
}

export interface JobMatch {
  id: string
  resumeId: string
  jobTitle: string
  company: string
  jobDescription: string
  matchScore: number
  strengths: string[]
  weaknesses: string[]
  missingSkills: string[]
  recommendations: string[]
  analysis: {
    strengths: string[]
    weaknesses: string[]
    missingSkills: {
      skill: string
      category?: string
      importance: 'High' | 'Medium' | 'Low'
    }[]
    recommendations: string[]
  }
  createdAt: string
}

export interface DashboardStats {
  stats: {
    totalResumes: number
    analyzedResumes: number
    totalMatches: number
    averageScore: number
    averageAtsScore: number
    averageMatchScore: number
    highMatches: number
  }
  topSkills: {
    name: string
    category: string
    count: number
    experience: number
  }[]
  recentActivity: Activity[]
  usageStats: {
    resumesUploaded: number
    analysesPerformed: number
    jobMatches: number
  }
}

export interface Activity {
  id: string
  type: 'upload' | 'analysis' | 'match' | 'resume'
  title: string
  subtitle: string
  description: string
  timestamp: string
  status?: 'completed' | 'processing' | 'failed'
}