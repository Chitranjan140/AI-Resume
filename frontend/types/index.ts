export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Resume {
  id: string
  userId: string
  filename: string
  fileUrl: string
  extractedText: string
  uploadedAt: string
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
  jobDescription: string
  matchScore: number
  strengths: string[]
  weaknesses: string[]
  missingSkills: string[]
  recommendations: string[]
  createdAt: string
}

export interface DashboardStats {
  totalResumes: number
  averageScore: number
  totalMatches: number
  topSkills: string[]
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'upload' | 'analysis' | 'match'
  description: string
  timestamp: string
}