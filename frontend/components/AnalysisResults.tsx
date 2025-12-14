'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Briefcase, 
  Lightbulb,
  RefreshCw,
  Share2
} from 'lucide-react'
import { ResumeAnalysis } from '@/types'
import { JobMatchModal } from '@/components/JobMatchModal'

interface AnalysisResultsProps {
  analysis: ResumeAnalysis
  resumeId: string
  onReset: () => void
}

export const AnalysisResults = ({ analysis, resumeId, onReset }: AnalysisResultsProps) => {
  const [showJobMatch, setShowJobMatch] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Here's your comprehensive resume analysis
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowJobMatch(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>Match Job</span>
          </button>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </motion.div>

      {/* Score Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Overall Score */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
              <div 
                className={`bg-gradient-to-r ${getScoreGradient(analysis.overallScore)} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Resume Quality Assessment
            </p>
          </div>
        </div>

        {/* ATS Score */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ATS Score</h3>
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.atsScore)}`}>
              {analysis.atsScore}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
              <div 
                className={`bg-gradient-to-r ${getScoreGradient(analysis.atsScore)} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${analysis.atsScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ATS Compatibility
            </p>
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2 text-blue-600" />
          Technical Skills
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.technicalSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{skill.name}</h4>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>{skill.proficiency}</span>
                {skill.yearsOfExperience && (
                  <span>{skill.yearsOfExperience}+ years</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience & Education */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-green-600" />
            Experience
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Total Years</span>
              <span className="font-semibold">{analysis.experience.totalYears} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Level</span>
              <span className="font-semibold">{analysis.experience.level}</span>
            </div>
            {analysis.experience.roles.length > 0 && (
              <div>
                <span className="text-slate-600 dark:text-slate-300 block mb-2">Roles</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.experience.roles.slice(0, 3).map((role, index) => (
                    <span key={index} className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
            Education
          </h3>
          <div className="space-y-3">
            {analysis.education.length > 0 ? (
              analysis.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{edu.institution}</p>
                  {edu.year && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{edu.year}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No education information found</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
          AI Suggestions
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-600 mb-3">Strengths</h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-600 mb-3">Improvements</h4>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Job Match Modal */}
      {showJobMatch && (
        <JobMatchModal
          resumeId={resumeId}
          onClose={() => setShowJobMatch(false)}
        />
      )}
    </div>
  )
}