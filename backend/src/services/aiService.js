const OpenAI = require('openai')

// Check if OpenAI API key is configured
let openai = null
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-') && process.env.OPENAI_API_KEY.length > 20) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
} else {
  console.warn('OpenAI API key not configured or invalid')
}

class AIService {
  async analyzeResume(resumeText) {
    try {
      // Return mock analysis if OpenAI is not configured
      if (!openai) {
        return this.getMockAnalysis(resumeText)
      }
      const prompt = `
        Analyze the following resume and provide a comprehensive analysis in JSON format:

        Resume Text:
        ${resumeText}

        Please provide analysis in this exact JSON structure:
        {
          "technicalSkills": [
            {
              "name": "skill name",
              "category": "Frontend|Backend|Database|DevOps|AI/ML|Mobile|Design|Other",
              "proficiency": "Beginner|Intermediate|Advanced|Expert",
              "yearsOfExperience": number
            }
          ],
          "softSkills": ["skill1", "skill2"],
          "experience": {
            "totalYears": number,
            "level": "Entry|Mid|Senior|Lead|Executive",
            "roles": ["role1", "role2"],
            "companies": ["company1", "company2"]
          },
          "education": [
            {
              "degree": "degree name",
              "institution": "institution name",
              "year": "year",
              "field": "field of study"
            }
          ],
          "jobRoles": ["role1", "role2"],
          "overallScore": number (0-100),
          "atsScore": number (0-100),
          "suggestions": ["suggestion1", "suggestion2"],
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "keywordDensity": {"keyword": count}
        }

        Focus on:
        1. Extracting all technical and soft skills
        2. Calculating years of experience accurately
        3. Providing actionable improvement suggestions
        4. ATS optimization recommendations
        5. Overall resume quality assessment
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyzer and career counselor. Provide detailed, accurate analysis in the requested JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const analysisText = response.choices[0].message.content
      
      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI')
      }

      const analysis = JSON.parse(jsonMatch[0])
      
      // Validate and sanitize the response
      return this.validateAnalysis(analysis)
      
    } catch (error) {
      console.error('AI Resume Analysis Error:', error)
      throw new Error('Failed to analyze resume with AI')
    }
  }

  async matchJobDescription(resumeText, jobDescription, resumeAnalysis) {
    try {
      const prompt = `
        Compare this resume with the job description and provide a detailed match analysis:

        Resume Analysis:
        ${JSON.stringify(resumeAnalysis, null, 2)}

        Job Description:
        ${jobDescription}

        Provide analysis in this JSON format:
        {
          "matchScore": number (0-100),
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "missingSkills": [
            {
              "skill": "skill name",
              "category": "category",
              "importance": "Low|Medium|High"
            }
          ],
          "matchedSkills": [
            {
              "skill": "skill name",
              "category": "category",
              "proficiency": "Beginner|Intermediate|Advanced|Expert"
            }
          ],
          "recommendations": ["recommendation1", "recommendation2"],
          "experienceMatch": {
            "required": number,
            "candidate": number,
            "score": number (0-100)
          }
        }

        Focus on:
        1. Precise skill matching
        2. Experience level alignment
        3. Identifying critical gaps
        4. Actionable improvement recommendations
        5. Realistic match percentage
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruiter and job matching specialist. Provide accurate, detailed job-resume matching analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })

      const analysisText = response.choices[0].message.content
      
      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI')
      }

      const matchAnalysis = JSON.parse(jsonMatch[0])
      
      return this.validateJobMatch(matchAnalysis)
      
    } catch (error) {
      console.error('AI Job Matching Error:', error)
      throw new Error('Failed to match job description with AI')
    }
  }

  validateAnalysis(analysis) {
    // Ensure required fields exist with defaults
    return {
      technicalSkills: Array.isArray(analysis.technicalSkills) ? analysis.technicalSkills : [],
      softSkills: Array.isArray(analysis.softSkills) ? analysis.softSkills : [],
      experience: {
        totalYears: Math.max(0, analysis.experience?.totalYears || 0),
        level: analysis.experience?.level || 'Entry',
        roles: Array.isArray(analysis.experience?.roles) ? analysis.experience.roles : [],
        companies: Array.isArray(analysis.experience?.companies) ? analysis.experience.companies : []
      },
      education: Array.isArray(analysis.education) ? analysis.education : [],
      jobRoles: Array.isArray(analysis.jobRoles) ? analysis.jobRoles : [],
      overallScore: Math.min(100, Math.max(0, analysis.overallScore || 0)),
      atsScore: Math.min(100, Math.max(0, analysis.atsScore || 0)),
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      keywordDensity: analysis.keywordDensity || {}
    }
  }

  getMockAnalysis(resumeText) {
    const skillKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql']
    const foundSkills = skillKeywords.filter(skill => resumeText.toLowerCase().includes(skill))
    
    // Calculate scores based on resume content
    const overallScore = this.calculateOverallScore(resumeText, foundSkills)
    const atsScore = this.calculateATSScore(resumeText)
    
    return {
      technicalSkills: foundSkills.map(skill => ({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        category: this.getSkillCategory(skill),
        proficiency: this.getSkillProficiency(resumeText, skill),
        yearsOfExperience: this.extractExperience(resumeText, skill)
      })),
      softSkills: this.extractSoftSkills(resumeText),
      experience: this.extractExperience(resumeText),
      education: this.extractEducation(resumeText),
      jobRoles: this.extractJobRoles(resumeText),
      overallScore,
      atsScore,
      suggestions: this.generateSuggestions(resumeText, overallScore, atsScore),
      strengths: this.identifyStrengths(resumeText, foundSkills),
      weaknesses: this.identifyWeaknesses(resumeText, overallScore, atsScore),
      keywordDensity: this.calculateKeywordDensity(resumeText)
    }
  }

  calculateOverallScore(resumeText, skills) {
    let score = 0
    const text = resumeText.toLowerCase()
    
    // Skills (30 points)
    score += Math.min(30, skills.length * 3)
    
    // Experience (25 points)
    if (text.includes('experience') || text.includes('worked') || text.includes('developed')) score += 15
    if (text.match(/\d+\s*(year|yr)/)) score += 10
    
    // Education (20 points)
    if (text.includes('degree') || text.includes('university') || text.includes('college')) score += 15
    if (text.includes('bachelor') || text.includes('master') || text.includes('phd')) score += 5
    
    // Contact Info (10 points)
    if (text.includes('@') && text.includes('.com')) score += 5
    if (text.match(/\d{10}/)) score += 5
    
    // Achievements (15 points)
    if (text.includes('achieved') || text.includes('improved') || text.includes('%')) score += 10
    if (text.includes('led') || text.includes('managed') || text.includes('team')) score += 5
    
    return Math.min(100, score)
  }

  calculateATSScore(resumeText) {
    let score = 0
    const text = resumeText.toLowerCase()
    
    // Keywords density (40 points)
    const keywords = ['experience', 'skills', 'education', 'work', 'project', 'team', 'management']
    const foundKeywords = keywords.filter(keyword => text.includes(keyword))
    score += Math.min(40, foundKeywords.length * 6)
    
    // Structure (30 points)
    if (text.includes('experience') && text.includes('education')) score += 15
    if (text.includes('skills') || text.includes('technical')) score += 10
    if (text.length > 500) score += 5
    
    // Format (30 points)
    if (!text.includes('image') && !text.includes('graphic')) score += 15
    if (text.match(/\d{4}/)) score += 10 // Years
    if (text.includes('email') || text.includes('@')) score += 5
    
    return Math.min(100, score)
  }

  getSkillCategory(skill) {
    const categories = {
      'javascript': 'Frontend', 'react': 'Frontend', 'vue': 'Frontend', 'angular': 'Frontend', 'html': 'Frontend', 'css': 'Frontend',
      'node': 'Backend', 'python': 'Backend', 'java': 'Backend',
      'sql': 'Database', 'mongodb': 'Database', 'postgresql': 'Database'
    }
    return categories[skill.toLowerCase()] || 'Other'
  }

  getSkillProficiency(text, skill) {
    const skillText = text.toLowerCase()
    if (skillText.includes(`expert ${skill}`) || skillText.includes(`advanced ${skill}`)) return 'Expert'
    if (skillText.includes(`senior ${skill}`) || skillText.includes(`lead ${skill}`)) return 'Advanced'
    if (skillText.includes(`intermediate ${skill}`)) return 'Intermediate'
    return 'Beginner'
  }

  extractExperience(resumeText) {
    const yearMatch = resumeText.match(/(\d+)\s*(year|yr)/i)
    const totalYears = yearMatch ? parseInt(yearMatch[1]) : Math.floor(Math.random() * 5) + 1
    
    return {
      totalYears,
      level: totalYears < 2 ? 'Entry' : totalYears < 5 ? 'Mid' : 'Senior',
      roles: this.extractJobRoles(resumeText),
      companies: this.extractCompanies(resumeText)
    }
  }

  extractSoftSkills(text) {
    const softSkills = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking']
    const found = []
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('team') || lowerText.includes('collaborate')) found.push('Teamwork')
    if (lowerText.includes('lead') || lowerText.includes('manage')) found.push('Leadership')
    if (lowerText.includes('problem') || lowerText.includes('solve')) found.push('Problem Solving')
    if (lowerText.includes('communicate') || lowerText.includes('present')) found.push('Communication')
    
    return found.length > 0 ? found : softSkills.slice(0, 3)
  }

  extractEducation(text) {
    const education = []
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('bachelor') || lowerText.includes('bs') || lowerText.includes('ba')) {
      education.push({ degree: 'Bachelor\'s Degree', institution: 'University', year: '2020', field: 'Computer Science' })
    }
    if (lowerText.includes('master') || lowerText.includes('ms') || lowerText.includes('ma')) {
      education.push({ degree: 'Master\'s Degree', institution: 'University', year: '2022', field: 'Computer Science' })
    }
    
    return education.length > 0 ? education : [{ degree: 'Bachelor\'s Degree', institution: 'University', year: '2020', field: 'Computer Science' }]
  }

  extractJobRoles(text) {
    const roles = ['Developer', 'Engineer', 'Analyst', 'Manager', 'Consultant', 'Specialist']
    const found = []
    const lowerText = text.toLowerCase()
    
    roles.forEach(role => {
      if (lowerText.includes(role.toLowerCase())) found.push(role)
    })
    
    return found.length > 0 ? found : ['Software Developer']
  }

  extractCompanies(text) {
    // Simple extraction - in real implementation, use NER
    const companies = ['Tech Corp', 'Innovation Inc', 'Digital Solutions']
    return companies.slice(0, Math.floor(Math.random() * 2) + 1)
  }

  generateSuggestions(text, overallScore, atsScore) {
    const suggestions = []
    
    if (overallScore < 70) suggestions.push('Add more specific technical skills and achievements')
    if (atsScore < 70) suggestions.push('Improve keyword optimization for ATS systems')
    if (!text.toLowerCase().includes('project')) suggestions.push('Include relevant project experience')
    if (!text.includes('%') && !text.includes('increase')) suggestions.push('Add quantifiable achievements with metrics')
    
    return suggestions.length > 0 ? suggestions : ['Great resume! Consider adding more specific examples of your achievements.']
  }

  identifyStrengths(text, skills) {
    const strengths = []
    
    if (skills.length > 5) strengths.push('Strong technical skill set')
    if (text.toLowerCase().includes('lead') || text.toLowerCase().includes('manage')) strengths.push('Leadership experience')
    if (text.toLowerCase().includes('project')) strengths.push('Project experience')
    
    return strengths.length > 0 ? strengths : ['Technical background', 'Relevant experience']
  }

  identifyWeaknesses(text, overallScore, atsScore) {
    const weaknesses = []
    
    if (overallScore < 60) weaknesses.push('Could benefit from more detailed experience descriptions')
    if (atsScore < 60) weaknesses.push('Needs better keyword optimization')
    if (!text.includes('@')) weaknesses.push('Missing contact information')
    
    return weaknesses.length > 0 ? weaknesses : ['Consider adding more quantifiable achievements']
  }

  calculateKeywordDensity(text) {
    const keywords = ['experience', 'skills', 'project', 'team', 'development', 'management']
    const density = {}
    const words = text.toLowerCase().split(/\s+/)
    
    keywords.forEach(keyword => {
      const count = words.filter(word => word.includes(keyword)).length
      if (count > 0) density[keyword] = count
    })
    
    return density
  }

  validateJobMatch(matchAnalysis) {
    return {
      matchScore: Math.min(100, Math.max(0, matchAnalysis.matchScore || 0)),
      strengths: Array.isArray(matchAnalysis.strengths) ? matchAnalysis.strengths : [],
      weaknesses: Array.isArray(matchAnalysis.weaknesses) ? matchAnalysis.weaknesses : [],
      missingSkills: Array.isArray(matchAnalysis.missingSkills) ? matchAnalysis.missingSkills : [],
      matchedSkills: Array.isArray(matchAnalysis.matchedSkills) ? matchAnalysis.matchedSkills : [],
      recommendations: Array.isArray(matchAnalysis.recommendations) ? matchAnalysis.recommendations : [],
      experienceMatch: {
        required: matchAnalysis.experienceMatch?.required || 0,
        candidate: matchAnalysis.experienceMatch?.candidate || 0,
        score: Math.min(100, Math.max(0, matchAnalysis.experienceMatch?.score || 0))
      }
    }
  }
}

module.exports = new AIService()