'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Sparkles, Brain, Target, Zap, Award, TrendingUp, BarChart3 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { WaveBackground } from '@/components/WaveBackground'
import { DashboardCard } from '@/components/DashboardCard'

export default function ResumeMakerPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  
  // Predefined options
  const summaryTemplates = [
    "Experienced software engineer with 5+ years of expertise in full-stack development",
    "Results-driven marketing professional with proven track record in digital campaigns",
    "Dedicated project manager with strong leadership and organizational skills",
    "Creative designer with passion for user-centered design and brand development",
    "Data analyst with expertise in statistical analysis and business intelligence",
    "Sales professional with consistent record of exceeding targets and building relationships"
  ]
  
  const experienceTemplates = [
    "Led development of microservices architecture serving 1M+ users",
    "Improved application performance by 40% through optimization techniques",
    "Managed cross-functional team of 8 developers and designers",
    "Increased sales revenue by 25% through strategic client relationships",
    "Implemented CI/CD pipelines reducing deployment time by 60%",
    "Designed user interfaces that improved user engagement by 35%"
  ]
  
  const technicalSkills = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "C++", "C#",
    "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "MySQL", "Redis",
    "Git", "Jenkins", "Terraform", "Angular", "Vue.js", "Express.js", "Django",
    "Flask", "Spring Boot", "GraphQL", "REST API", "Microservices", "DevOps"
  ]
  
  const softSkills = [
    "Leadership", "Communication", "Problem Solving", "Team Collaboration", "Project Management",
    "Critical Thinking", "Adaptability", "Time Management", "Creativity", "Analytical Skills",
    "Attention to Detail", "Customer Service", "Negotiation", "Public Speaking", "Mentoring"
  ]
  
  const universities = [
    "Parul University", "Indian Institute of Technology (IIT)", "Indian Institute of Management (IIM)",
    "Delhi University", "Mumbai University", "Pune University", "Bangalore University",
    "Anna University", "Jawaharlal Nehru University", "Banaras Hindu University",
    "Aligarh Muslim University", "Jamia Millia Islamia", "Manipal University",
    "VIT University", "SRM University", "Amity University", "Lovely Professional University",
    "Chandigarh University", "Sharda University", "Bennett University", "MIT", "Stanford University",
    "Harvard University", "University of California", "Carnegie Mellon University"
  ]
  
  const degrees = [
    "Bachelor of Technology (B.Tech)", "Bachelor of Engineering (B.E.)", "Bachelor of Science (B.Sc.)",
    "Bachelor of Computer Applications (BCA)", "Bachelor of Business Administration (BBA)",
    "Bachelor of Commerce (B.Com)", "Bachelor of Arts (B.A.)", "Bachelor of Fine Arts (BFA)",
    "Master of Technology (M.Tech)", "Master of Engineering (M.E.)", "Master of Science (M.Sc.)",
    "Master of Computer Applications (MCA)", "Master of Business Administration (MBA)",
    "Master of Commerce (M.Com)", "Master of Arts (M.A.)", "Master of Fine Arts (MFA)",
    "Doctor of Philosophy (Ph.D.)", "Doctor of Medicine (M.D.)", "Bachelor of Medicine (MBBS)",
    "Bachelor of Dental Surgery (BDS)", "Bachelor of Pharmacy (B.Pharm)", "Master of Pharmacy (M.Pharm)",
    "Bachelor of Architecture (B.Arch)", "Master of Architecture (M.Arch)", "Bachelor of Law (LLB)",
    "Master of Law (LLM)", "Diploma", "Certificate Course", "Associate Degree"
  ]
  
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i) // 2000 to 2030

  const applyTemplate = (templateName) => {
    const templateData = {
      'Simple One-Column': {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '(555) 123-4567',
          location: 'New York, NY',
          summary: 'Recent graduate with strong academic background and passion for technology'
        },
        experience: [{
          company: 'Tech Startup',
          position: 'Intern',
          duration: 'Summer 2023',
          description: 'Assisted with web development projects and learned modern frameworks'
        }],
        education: [{
          institution: 'University of Technology',
          degree: 'Bachelor of Science in Computer Science',
          year: '2024',
          gpa: '3.8'
        }],
        skills: {
          technical: ['HTML', 'CSS', 'JavaScript', 'React'],
          soft: ['Communication', 'Problem Solving', 'Team Work']
        }
      },
      'Software Developer': {
        personalInfo: {
          name: 'Alex Chen',
          email: 'alex.chen@email.com',
          phone: '(555) 987-6543',
          location: 'San Francisco, CA',
          summary: 'Experienced software engineer with 5+ years in full-stack development'
        },
        experience: [{
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          duration: '2021 - Present',
          description: 'Led development of microservices architecture serving 1M+ users'
        }],
        skills: {
          technical: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
          soft: ['Leadership', 'Mentoring', 'Project Management']
        }
      },
      'Modern Gradient': {
        personalInfo: {
          name: 'Sarah Modern',
          email: 'sarah.modern@email.com',
          phone: '(555) 456-7890',
          location: 'Los Angeles, CA',
          summary: 'Creative professional with modern design thinking and innovative solutions'
        },
        experience: [{
          company: 'Design Studio',
          position: 'Creative Director',
          duration: '2022 - Present',
          description: 'Leading creative campaigns and brand development for modern companies'
        }],
        skills: {
          technical: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Webflow'],
          soft: ['Creativity', 'Innovation', 'Visual Communication']
        }
      }
    }
    
    if (templateData[templateName]) {
      setResumeData(prev => ({
        ...prev,
        ...templateData[templateName],
        projects: prev.projects,
        certifications: prev.certifications
      }))
    }
  }

  const downloadResume = () => {
    // Create a simple text version for download
    const resumeText = `
${resumeData.personalInfo.name || 'Your Name'}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}

${resumeData.personalInfo.summary ? `PROFESSIONAL SUMMARY\n${resumeData.personalInfo.summary}\n\n` : ''}
${resumeData.experience.some(exp => exp.company) ? `EXPERIENCE\n${resumeData.experience.filter(exp => exp.company).map(exp => `${exp.position} at ${exp.company} (${exp.duration})\n${exp.description}`).join('\n\n')}\n\n` : ''}
${resumeData.education.some(edu => edu.institution) ? `EDUCATION\n${resumeData.education.filter(edu => edu.institution).map(edu => `${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}\n\n` : ''}
${resumeData.skills.technical.some(skill => skill) || resumeData.skills.soft.some(skill => skill) ? `SKILLS\nTechnical: ${resumeData.skills.technical.filter(skill => skill).join(', ')}\nSoft Skills: ${resumeData.skills.soft.filter(skill => skill).join(', ')}\n\n` : ''}
${resumeData.projects.some(project => project.name) ? `PROJECTS\n${resumeData.projects.filter(project => project.name).map(project => `${project.name}\n${project.description}\nTechnologies: ${project.technologies}`).join('\n\n')}` : ''}
    `
    
    const blob = new Blob([resumeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resumeData.personalInfo.name || 'Resume'}_${selectedTemplate || 'Standard'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      portfolio: ''
    },
    experience: [{ company: '', position: '', duration: '', description: '', achievements: [''] }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    skills: { technical: [''], soft: [''], languages: [''] },
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    certifications: [{ name: '', issuer: '', date: '', id: '' }]
  })
  
  const [resumeStats] = useState({
    completeness: 85,
    atsScore: 92,
    readability: 88,
    keywordMatch: 76
  })

  return (
    <div className="min-h-screen relative">
      <WaveBackground />
      <Navbar />
      
      <div className="pt-20 px-4 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Resume Maker
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
              Create professional resumes with AI-powered suggestions
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Resume Score"
                value={`${resumeStats.completeness}%`}
                icon={Target}
                gradient="from-blue-500 to-cyan-500"
                delay={0.1}
                trend={{ value: 12, isPositive: true }}
              />
              <DashboardCard
                title="ATS Score"
                value={`${resumeStats.atsScore}%`}
                icon={Brain}
                gradient="from-green-500 to-emerald-500"
                delay={0.2}
                trend={{ value: 8, isPositive: true }}
              />
              <DashboardCard
                title="Readability"
                value={`${resumeStats.readability}%`}
                icon={Eye}
                gradient="from-purple-500 to-pink-500"
                delay={0.3}
                trend={{ value: 15, isPositive: true }}
              />
              <DashboardCard
                title="Keywords"
                value={`${resumeStats.keywordMatch}%`}
                icon={Zap}
                gradient="from-orange-500 to-red-500"
                delay={0.4}
                trend={{ value: 5, isPositive: false }}
              />
            </div>
            
            <div className="glass-card p-2 mb-8 inline-flex rounded-lg">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'builder', label: 'Builder', icon: FileText },
                { id: 'templates', label: 'Templates', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {activeTab === 'dashboard' && (
            <div className="grid md:grid-cols-3 gap-6">
              <button 
                onClick={() => setActiveTab('builder')}
                className="glass-card p-6 hover:scale-105 transition-transform group text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Build Resume</h3>
                <p className="text-slate-600 dark:text-slate-300">Create your professional resume</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('templates')}
                className="glass-card p-6 hover:scale-105 transition-transform group text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Templates</h3>
                <p className="text-slate-600 dark:text-slate-300">Choose from professional templates</p>
              </button>
              
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-slate-600 dark:text-slate-300">Track performance</p>
              </div>
            </div>
          )}
          
          {activeTab === 'builder' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Resume Information</h2>
                      <p className="text-slate-300 text-sm">
                        {selectedTemplate ? `Using ${selectedTemplate} template` : 'Build your professional profile'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('templates')}
                    className="btn-secondary text-sm"
                  >
                    Change Template
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input-field"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="input-field"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="input-field"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="input-field"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="relative mt-4">
                    <label className="block text-sm font-medium mb-2">Professional Summary</label>
                    <select 
                      className="input-field mb-2"
                      onChange={(e) => {
                        if (e.target.value) {
                          setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, summary: e.target.value }
                          }))
                        }
                      }}
                    >
                      <option value="">Choose a template or write your own</option>
                      {summaryTemplates.map((template, index) => (
                        <option key={index} value={template}>
                          {template.substring(0, 50)}...
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Professional Summary"
                      className="input-field"
                      rows={3}
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value }
                      }))}
                    />
                    <button className="absolute top-12 right-2 p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <button 
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        experience: [...prev.experience, { company: '', position: '', duration: '', description: '', achievements: [''] }]
                      }))}
                      className="btn-secondary text-sm"
                    >
                      Add Experience
                    </button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="glass-card p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Company"
                          className="input-field"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience]
                            newExp[index].company = e.target.value
                            setResumeData(prev => ({ ...prev, experience: newExp }))
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          className="input-field"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience]
                            newExp[index].position = e.target.value
                            setResumeData(prev => ({ ...prev, experience: newExp }))
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Duration"
                        className="input-field mb-4"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience]
                          newExp[index].duration = e.target.value
                          setResumeData(prev => ({ ...prev, experience: newExp }))
                        }}
                      />
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Job Description</label>
                        <select 
                          className="input-field mb-2"
                          onChange={(e) => {
                            if (e.target.value) {
                              const newExp = [...resumeData.experience]
                              newExp[index].description = e.target.value
                              setResumeData(prev => ({ ...prev, experience: newExp }))
                            }
                          }}
                        >
                          <option value="">Choose a template or write your own</option>
                          {experienceTemplates.map((template, idx) => (
                            <option key={idx} value={template}>
                              {template.substring(0, 40)}...
                            </option>
                          ))}
                        </select>
                        <textarea
                          placeholder="Job Description"
                          className="input-field"
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience]
                            newExp[index].description = e.target.value
                            setResumeData(prev => ({ ...prev, experience: newExp }))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <button 
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
                      }))}
                      className="btn-secondary text-sm"
                    >
                      Add Education
                    </button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="glass-card p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Institution</label>
                          <select 
                            className="input-field mb-2"
                            onChange={(e) => {
                              if (e.target.value) {
                                const newEdu = [...resumeData.education]
                                newEdu[index].institution = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }
                            }}
                          >
                            <option value="">Select University</option>
                            {universities.map((uni, idx) => (
                              <option key={idx} value={uni}>{uni}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Or type custom institution name"
                            className="input-field"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education]
                              newEdu[index].institution = e.target.value
                              setResumeData(prev => ({ ...prev, education: newEdu }))
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Degree</label>
                          <select 
                            className="input-field mb-2"
                            onChange={(e) => {
                              if (e.target.value) {
                                const newEdu = [...resumeData.education]
                                newEdu[index].degree = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }
                            }}
                          >
                            <option value="">Select Degree</option>
                            {degrees.map((degree, idx) => (
                              <option key={idx} value={degree}>{degree}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Or type custom degree"
                            className="input-field"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education]
                              newEdu[index].degree = e.target.value
                              setResumeData(prev => ({ ...prev, education: newEdu }))
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Year</label>
                          <select 
                            className="input-field mb-2"
                            onChange={(e) => {
                              if (e.target.value) {
                                const newEdu = [...resumeData.education]
                                newEdu[index].year = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }
                            }}
                          >
                            <option value="">Select Year</option>
                            {years.reverse().map((year, idx) => (
                              <option key={idx} value={year}>{year}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Or type custom year"
                            className="input-field"
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education]
                              newEdu[index].year = e.target.value
                              setResumeData(prev => ({ ...prev, education: newEdu }))
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="GPA (Optional)"
                          className="input-field"
                          value={edu.gpa}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education]
                            newEdu[index].gpa = e.target.value
                            setResumeData(prev => ({ ...prev, education: newEdu }))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Technical Skills</label>
                      <select 
                        className="input-field mb-2"
                        onChange={(e) => {
                          if (e.target.value && !resumeData.skills.technical.includes(e.target.value)) {
                            const newSkills = [...resumeData.skills.technical]
                            const emptyIndex = newSkills.findIndex(skill => skill === '')
                            if (emptyIndex !== -1) {
                              newSkills[emptyIndex] = e.target.value
                            } else {
                              newSkills.push(e.target.value)
                            }
                            setResumeData(prev => ({ ...prev, skills: { ...prev.skills, technical: newSkills } }))
                          }
                        }}
                      >
                        <option value="">Add from popular skills</option>
                        {technicalSkills.map((skill, idx) => (
                          <option key={idx} value={skill}>{skill}</option>
                        ))}
                      </select>
                      <div className="grid md:grid-cols-2 gap-4">
                        {resumeData.skills.technical.map((skill, index) => (
                          <input
                            key={index}
                            type="text"
                            placeholder="e.g., React, Python"
                            className="input-field"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...resumeData.skills.technical]
                              newSkills[index] = e.target.value
                              setResumeData(prev => ({ ...prev, skills: { ...prev.skills, technical: newSkills } }))
                            }}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, technical: [...prev.skills.technical, ''] } }))}
                        className="btn-secondary text-sm mt-2"
                      >
                        Add Technical Skill
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Soft Skills</label>
                      <select 
                        className="input-field mb-2"
                        onChange={(e) => {
                          if (e.target.value && !resumeData.skills.soft.includes(e.target.value)) {
                            const newSkills = [...resumeData.skills.soft]
                            const emptyIndex = newSkills.findIndex(skill => skill === '')
                            if (emptyIndex !== -1) {
                              newSkills[emptyIndex] = e.target.value
                            } else {
                              newSkills.push(e.target.value)
                            }
                            setResumeData(prev => ({ ...prev, skills: { ...prev.skills, soft: newSkills } }))
                          }
                        }}
                      >
                        <option value="">Add from popular skills</option>
                        {softSkills.map((skill, idx) => (
                          <option key={idx} value={skill}>{skill}</option>
                        ))}
                      </select>
                      <div className="grid md:grid-cols-2 gap-4">
                        {resumeData.skills.soft.map((skill, index) => (
                          <input
                            key={index}
                            type="text"
                            placeholder="e.g., Leadership"
                            className="input-field"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...resumeData.skills.soft]
                              newSkills[index] = e.target.value
                              setResumeData(prev => ({ ...prev, skills: { ...prev.skills, soft: newSkills } }))
                            }}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, soft: [...prev.skills.soft, ''] } }))}
                        className="btn-secondary text-sm mt-2"
                      >
                        Add Soft Skill
                      </button>
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <button 
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
                      }))}
                      className="btn-secondary text-sm"
                    >
                      Add Project
                    </button>
                  </div>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="glass-card p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Project Name"
                          className="input-field"
                          value={project.name}
                          onChange={(e) => {
                            const newProjects = [...resumeData.projects]
                            newProjects[index].name = e.target.value
                            setResumeData(prev => ({ ...prev, projects: newProjects }))
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Technologies"
                          className="input-field"
                          value={project.technologies}
                          onChange={(e) => {
                            const newProjects = [...resumeData.projects]
                            newProjects[index].technologies = e.target.value
                            setResumeData(prev => ({ ...prev, projects: newProjects }))
                          }}
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        className="input-field mb-4"
                        rows={3}
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...resumeData.projects]
                          newProjects[index].description = e.target.value
                          setResumeData(prev => ({ ...prev, projects: newProjects }))
                        }}
                      />
                      <input
                        type="url"
                        placeholder="Project Link (Optional)"
                        className="input-field"
                        value={project.link}
                        onChange={(e) => {
                          const newProjects = [...resumeData.projects]
                          newProjects[index].link = e.target.value
                          setResumeData(prev => ({ ...prev, projects: newProjects }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Preview</h2>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button 
                      onClick={downloadResume}
                      className="btn-primary text-sm flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg min-h-[600px] text-black">
                  <div className="border-b-2 border-blue-600 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">
                      {resumeData.personalInfo.name || 'Your Name'}
                    </h1>
                    <div className="text-sm text-gray-600 mt-2">
                      {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                      {resumeData.personalInfo.phone && <span> • {resumeData.personalInfo.phone}</span>}
                      {resumeData.personalInfo.location && <span> • {resumeData.personalInfo.location}</span>}
                    </div>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-2">PROFESSIONAL SUMMARY</h2>
                      <p className="text-sm">{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {resumeData.experience.some(exp => exp.company) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-2">EXPERIENCE</h2>
                      {resumeData.experience.map((exp, index) => (
                        exp.company && (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{exp.position}</h3>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                              </div>
                              <span className="text-sm text-gray-500">{exp.duration}</span>
                            </div>
                            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {resumeData.education.some(edu => edu.institution) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-2">EDUCATION</h2>
                      {resumeData.education.map((edu, index) => (
                        edu.institution && (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-gray-500">{edu.year}</span>
                                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {(resumeData.skills.technical.some(skill => skill) || resumeData.skills.soft.some(skill => skill)) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-2">SKILLS</h2>
                      <div className="space-y-2">
                        {resumeData.skills.technical.some(skill => skill) && (
                          <div>
                            <h4 className="font-medium text-sm">Technical:</h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.technical.filter(skill => skill).map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {resumeData.skills.soft.some(skill => skill) && (
                          <div>
                            <h4 className="font-medium text-sm">Soft Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.soft.filter(skill => skill).map((skill, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {resumeData.projects.some(project => project.name) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-2">PROJECTS</h2>
                      {resumeData.projects.map((project, index) => (
                        project.name && (
                          <div key={index} className="mb-4">
                            <h3 className="font-semibold">{project.name}</h3>
                            {project.technologies && <p className="text-sm text-gray-600">{project.technologies}</p>}
                            {project.description && <p className="text-sm mt-1">{project.description}</p>}
                            {project.link && (
                              <a href={project.link} className="text-sm text-blue-600 hover:underline">
                                View Project
                              </a>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div className="space-y-8">
              {/* Template Filters */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Filter Templates</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400">
                    <option value="all">All Categories</option>
                    <option value="basic">Basic / Fresher</option>
                    <option value="professional">Professional</option>
                    <option value="modern">Modern</option>
                    <option value="technical">Technical / IT</option>
                  </select>
                  <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400">
                    <option value="all">All Experience Levels</option>
                    <option value="entry">Entry Level (0-1 years)</option>
                    <option value="mid">Mid-Level (2-5 years)</option>
                    <option value="senior">Senior Level (6+ years)</option>
                  </select>
                  <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400">
                    <option value="all">All Formats</option>
                    <option value="indian">Indian Format</option>
                    <option value="us">US Format</option>
                    <option value="uk">UK CV Format</option>
                  </select>
                </div>
              </div>

              {/* Basic / Fresher Templates */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                  <span>Basic / Fresher Resume Templates</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { name: 'Simple One-Column', color: 'green', features: ['Clean', 'ATS-Friendly'] },
                    { name: 'Minimal Black & White', color: 'gray', features: ['Minimal', 'Professional'] },
                    { name: 'Student Resume', color: 'blue', features: ['Student-Focused', 'Simple'] },
                    { name: 'Internship Resume', color: 'purple', features: ['Internship', 'Fresh Graduate'] }
                  ].map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl"
                    >
                      <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-white shadow-lg">
                        <div className="w-full h-full p-3 text-xs text-gray-800">
                          <div className="border-b border-gray-300 pb-2 mb-2">
                            <h1 className="text-sm font-bold text-gray-800">JOHN DOE</h1>
                            <p className="text-xs text-gray-600">Fresh Graduate</p>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-gray-800 mb-1">EDUCATION</h2>
                            <div className="h-2 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-gray-800 mb-1">PROJECTS</h2>
                            <div className="h-2 bg-gray-300 rounded mb-1 w-2/3"></div>
                            <div className="h-1 bg-gray-200 rounded"></div>
                          </div>
                          <div>
                            <h2 className="text-xs font-bold text-gray-800 mb-1">SKILLS</h2>
                            <div className="flex gap-1">
                              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">React</span>
                              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Python</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">{template.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTemplate(template.name)
                            applyTemplate(template.name)
                            setActiveTab('builder')
                          }}
                          className="w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          Use Template
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Professional Templates */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                  <span>Professional Resume Templates</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { name: 'Corporate Resume', color: 'blue', features: ['Corporate', 'ATS-Optimized'] },
                    { name: 'Business Professional', color: 'indigo', features: ['Business', 'Executive'] },
                    { name: 'Executive Summary', color: 'purple', features: ['Leadership', 'Senior Level'] },
                    { name: 'Two-Column Professional', color: 'cyan', features: ['Modern', 'Structured'] }
                  ].map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl"
                    >
                      <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-white shadow-lg">
                        <div className="w-full h-full p-3 text-xs text-gray-800">
                          <div className="text-center border-b border-gray-300 pb-2 mb-2">
                            <h1 className="text-sm font-bold text-gray-800">MICHAEL SMITH</h1>
                            <p className="text-xs text-gray-600">Senior Manager</p>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-gray-800 mb-1">EXECUTIVE SUMMARY</h2>
                            <div className="h-2 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-gray-800 mb-1">EXPERIENCE</h2>
                            <div className="h-2 bg-gray-300 rounded mb-1 w-3/4"></div>
                            <div className="h-1 bg-gray-200 rounded mb-1"></div>
                            <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">{template.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTemplate(template.name)
                            applyTemplate(template.name)
                            setActiveTab('builder')
                          }}
                          className="w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          Use Template
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Modern Templates */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                  <span>Modern Resume Templates</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { name: 'Modern Gradient', features: ['Colorful', 'Eye-catching'] },
                    { name: 'Glassmorphism', features: ['Trendy', 'Modern'] },
                    { name: 'Dark Theme', features: ['Professional', 'Unique'] },
                    { name: 'Minimalist Modern', features: ['Clean', 'Contemporary'] }
                  ].map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl"
                    >
                      <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg">
                        <div className="w-full h-full p-3 text-xs text-gray-800">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-lg mb-2">
                            <h1 className="text-sm font-bold">SARAH MODERN</h1>
                            <p className="text-xs opacity-90">Creative Professional</p>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-pink-600 mb-1">ABOUT</h2>
                            <div className="h-2 bg-pink-200 rounded mb-1"></div>
                            <div className="h-2 bg-pink-200 rounded w-3/4"></div>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-purple-600 mb-1">EXPERIENCE</h2>
                            <div className="h-2 bg-purple-200 rounded mb-1 w-4/5"></div>
                            <div className="h-1 bg-gray-200 rounded"></div>
                          </div>
                          <div>
                            <h2 className="text-xs font-bold text-pink-600 mb-1">SKILLS</h2>
                            <div className="flex gap-1">
                              <span className="bg-pink-200 text-pink-800 px-1 py-0.5 rounded text-xs">Design</span>
                              <span className="bg-purple-200 text-purple-800 px-1 py-0.5 rounded text-xs">Creative</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">{template.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTemplate(template.name)
                            applyTemplate(template.name)
                            setActiveTab('builder')
                          }}
                          className="w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          Use Template
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Technical / IT Templates */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                  <span>Technical / IT Resume Templates</span>
                </h3>
                <div className="grid md:grid-cols-5 gap-6">
                  {[
                    { name: 'Software Developer', color: 'cyan', features: ['Code-Focused'] },
                    { name: 'Web Developer', color: 'blue', features: ['Frontend/Backend'] },
                    { name: 'Data Scientist', color: 'green', features: ['Analytics'] },
                    { name: 'Cloud / DevOps', color: 'orange', features: ['Infrastructure'] },
                    { name: 'Cyber Security', color: 'red', features: ['Security'] }
                  ].map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl"
                    >
                      <div className="relative w-full h-40 mb-4 rounded-2xl overflow-hidden bg-white shadow-lg">
                        <div className="w-full h-full p-2 text-xs text-gray-800">
                          <div className="border-b border-gray-300 pb-1 mb-2">
                            <h1 className="text-xs font-bold text-gray-800">ALEX CHEN</h1>
                            <p className="text-xs text-gray-600">{template.name}</p>
                          </div>
                          <div className="mb-2">
                            <h2 className="text-xs font-bold text-gray-800 mb-1">TECH STACK</h2>
                            <div className="flex gap-1 flex-wrap">
                              <span className="bg-cyan-100 text-cyan-800 px-1 py-0.5 rounded text-xs">React</span>
                              <span className="bg-cyan-100 text-cyan-800 px-1 py-0.5 rounded text-xs">Node.js</span>
                            </div>
                          </div>
                          <div>
                            <h2 className="text-xs font-bold text-gray-800 mb-1">PROJECTS</h2>
                            <div className="h-1 bg-gray-300 rounded mb-1 w-3/4"></div>
                            <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                          <button className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white">{template.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTemplate(template.name)
                            applyTemplate(template.name)
                            setActiveTab('builder')
                          }}
                          className="w-full py-2 rounded-xl font-semibold text-xs transition-all duration-300 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          Use Template
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}