'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Target, TrendingUp, Edit3, Copy, Zap, Award, BarChart3, Eye, Download } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Navbar } from '@/components/Navbar'
import { WaveBackground } from '@/components/WaveBackground'
import { resumeAPI } from '@/lib/api'
import { Resume, ResumeAnalysis } from '@/types'
import toast from 'react-hot-toast'

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null)
  const [parsedContent, setParsedContent] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<any>({
    overallScore: 85,
    atsScore: 92,
    keywordMatch: 76,
    sections: {
      summary: { score: 88, feedback: 'Strong professional summary with clear value proposition' },
      experience: { score: 82, feedback: 'Good experience section, could use more quantified achievements' },
      skills: { score: 90, feedback: 'Comprehensive skills list with relevant technologies' },
      education: { score: 85, feedback: 'Education section is well-formatted and complete' }
    },
    suggestions: [
      'Add more quantified achievements in experience section',
      'Include industry-specific keywords for better ATS compatibility',
      'Optimize bullet points with stronger action verbs'
    ]
  })

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      // Simulate file parsing
      setTimeout(() => {
        setUploadProgress(100)
        setParsedContent(`Name: John Doe
Email: john.doe@email.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Led development of microservices architecture serving 1M+ users
• Improved application performance by 40% through optimization
• Mentored 3 junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React and TypeScript
• Implemented CI/CD pipelines reducing deployment time by 60%
• Collaborated with product team to deliver features on schedule

SKILLS
Technical: React, Node.js, TypeScript, Python, AWS, Docker, Kubernetes
Soft Skills: Leadership, Problem-solving, Communication, Team collaboration

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2019`)
        
        setUploadedResume({
          id: '1',
          userId: 'user1',
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          status: 'processed'
        })
        
        toast.success('Resume uploaded and parsed successfully!')
        setActiveTab('analysis')
      }, 2000)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('Failed to upload resume')
    } finally {
      setUploading(false)
      clearInterval(progressInterval)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading
  })

  const CircularProgress = ({ value, size = 120, strokeWidth = 8, color = "blue" }: {
    value: number
    size?: number
    strokeWidth?: number
    color?: string
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WaveBackground />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Navbar />
      
      <div className="pt-20 px-4 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
            <p className="text-xl text-slate-300 font-light">
              Upload, analyze, and optimize your resume with advanced AI
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="backdrop-blur-xl bg-white/5 p-2 rounded-3xl border border-white/10">
              {[
                { id: 'upload', label: 'Upload & Parse', icon: Upload },
                { id: 'analysis', label: 'AI Analysis', icon: Brain },
                { id: 'optimization', label: 'Optimization', icon: Zap }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Upload Options */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Upload Resume File</h3>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                      isDragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} />
                    
                    {uploading ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto">
                          <CircularProgress value={uploadProgress} size={64} strokeWidth={4} />
                        </div>
                        <p className="text-lg font-medium text-white">Uploading & Parsing...</p>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 mx-auto text-slate-400" />
                        <div>
                          <p className="text-xl font-medium text-white mb-2">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                          </p>
                          <p className="text-slate-300">
                            Supports PDF, DOCX, TXT • Max 10MB
                          </p>
                        </div>
                        <button className="btn-primary">
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Paste Text */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Paste Resume Text</h3>
                  
                  <textarea
                    placeholder="Paste your resume content here..."
                    className="w-full h-64 bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-400 transition-colors"
                    value={parsedContent}
                    onChange={(e) => setParsedContent(e.target.value)}
                  />
                  
                  <button 
                    className="btn-primary w-full mt-4"
                    onClick={() => {
                      if (parsedContent.trim()) {
                        setActiveTab('analysis')
                        toast.success('Resume content processed!')
                      }
                    }}
                  >
                    Analyze Text
                  </button>
                </div>
              </div>

              {/* Parsed Content Preview */}
              {parsedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Parsed Content Preview</h3>
                    <div className="flex space-x-2">
                      <button className="btn-secondary flex items-center space-x-2">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 max-h-96 overflow-y-auto">
                    <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                      {parsedContent}
                    </pre>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Overall Scores */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-6">Overall Score</h3>
                  <CircularProgress value={analysis.overallScore} color="blue" />
                  <p className="text-slate-300 mt-4">Excellent resume with strong content structure</p>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-6">ATS Compatibility</h3>
                  <CircularProgress value={analysis.atsScore} color="green" />
                  <p className="text-slate-300 mt-4">Highly compatible with ATS systems</p>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-6">Keyword Match</h3>
                  <CircularProgress value={analysis.keywordMatch} color="purple" />
                  <p className="text-slate-300 mt-4">Good keyword alignment with job requirements</p>
                </div>
              </div>

              {/* Job Description Matcher */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Job Description Match</h3>
                <textarea
                  placeholder="Paste job description here to analyze keyword match..."
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-400 transition-colors mb-4"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <button className="btn-primary">
                  Analyze Match
                </button>
              </div>

              {/* Section-wise Analysis */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Section-wise Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(analysis.sections).map(([section, data]: [string, any]) => (
                    <div key={section} className="bg-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white capitalize">{section}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          data.score >= 85 ? 'bg-green-500/20 text-green-400' :
                          data.score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {data.score}%
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{data.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Optimization Tab */}
          {activeTab === 'optimization' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* AI Recommendations */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">AI Recommendations</h3>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{suggestion}</p>
                      </div>
                      <button className="btn-secondary text-sm">
                        Apply Fix
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Export Optimized Resume</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download DOCX</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}