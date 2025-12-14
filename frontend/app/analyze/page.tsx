'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Navbar } from '@/components/Navbar'
import { resumeAPI } from '@/lib/api'
import { Resume, ResumeAnalysis } from '@/types'
import { AnalysisResults } from '@/components/AnalysisResults'
import toast from 'react-hot-toast'

export default function AnalyzePage() {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await resumeAPI.upload(formData)
      setUploadedResume(response.data.resume)
      toast.success('Resume uploaded successfully!')
      
      // Auto-start analysis
      await analyzeResume(response.data.resume.id)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const analyzeResume = async (resumeId: string) => {
    setAnalyzing(true)
    
    try {
      const response = await resumeAPI.analyze(resumeId)
      setAnalysis(response.data.analysis)
      toast.success('Resume analyzed successfully!')
    } catch (error: any) {
      console.error('Analysis error:', error)
      toast.error(error.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || analyzing
  })

  const resetAnalysis = () => {
    setUploadedResume(null)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">AI Resume Analysis</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Upload your resume and get instant AI-powered insights
            </p>
          </motion.div>

          {!analysis ? (
            <>
              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div
                  {...getRootProps()}
                  className={`glass-card p-12 border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                  } ${(uploading || analyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} />
                  
                  <div className="text-center">
                    {uploading ? (
                      <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-lg font-medium">Uploading resume...</p>
                      </div>
                    ) : analyzing ? (
                      <div className="space-y-4">
                        <Brain className="w-12 h-12 mx-auto text-blue-600 animate-pulse" />
                        <p className="text-lg font-medium">Analyzing with AI...</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          This may take a few moments
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-slate-400" />
                        <div>
                          <p className="text-lg font-medium mb-2">
                            {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            Drag & drop or click to select • PDF or DOCX • Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Upload Status */}
              {uploadedResume && !analysis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 mb-8"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">Resume uploaded successfully!</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {uploadedResume.filename} • {uploadedResume.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {features.map((feature, index) => (
                  <div key={feature.title} className="glass-card p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </>
          ) : (
            /* Analysis Results */
            <AnalysisResults 
              analysis={analysis} 
              resumeId={uploadedResume?.id || ''} 
              onReset={resetAnalysis}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI analyzes your resume content, structure, and optimization opportunities"
  },
  {
    icon: FileText,
    title: "Skill Extraction",
    description: "Automatically identifies and categorizes your technical and soft skills"
  },
  {
    icon: CheckCircle,
    title: "ATS Optimization",
    description: "Ensures your resume passes Applicant Tracking Systems with optimization tips"
  }
]