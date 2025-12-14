const multer = require('multer')
const path = require('path')
const fs = require('fs').promises
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

class FileService {
  constructor() {
    // Configure multer for file uploads
    this.upload = multer({
      dest: 'uploads/',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false)
        }
      }
    }).single('resume')
  }

  async extractTextFromFile(filePath, mimeType) {
    try {
      let extractedText = ''

      if (mimeType === 'application/pdf') {
        extractedText = await this.extractTextFromPDF(filePath)
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await this.extractTextFromDOCX(filePath)
      } else {
        throw new Error('Unsupported file type')
      }

      // Clean and validate extracted text
      extractedText = this.cleanExtractedText(extractedText)
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Unable to extract sufficient text from the file')
      }

      return extractedText
    } catch (error) {
      console.error('Text extraction error:', error)
      throw new Error('Failed to extract text from file')
    }
  }

  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath)
      const data = await pdfParse(dataBuffer)
      return data.text
    } catch (error) {
      console.error('PDF extraction error:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  async extractTextFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath })
      return result.value
    } catch (error) {
      console.error('DOCX extraction error:', error)
      throw new Error('Failed to extract text from DOCX')
    }
  }

  cleanExtractedText(text) {
    if (!text) return ''
    
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might interfere with AI processing
      .replace(/[^\w\s\-.,;:()\[\]{}@#$%&*+=<>?/\\|'"]/g, '')
      // Trim whitespace
      .trim()
  }

  async uploadToCloudinary(filePath, originalName, userId) {
    try {
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
        // Return local file path if Cloudinary not configured
        const stats = await fs.stat(filePath)
        return {
          url: `/uploads/${path.basename(filePath)}`,
          publicId: null,
          size: stats.size
        }
      }

      const result = await cloudinary.uploader.upload(filePath, {
        folder: `resumes/${userId}`,
        resource_type: 'raw',
        public_id: `${Date.now()}_${path.parse(originalName).name}`,
        use_filename: true,
        unique_filename: true,
      })

      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      // Fallback to local storage
      const stats = await fs.stat(filePath)
      return {
        url: `/uploads/${path.basename(filePath)}`,
        publicId: null,
        size: stats.size
      }
    }
  }

  async deleteFromCloudinary(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
    } catch (error) {
      console.error('Cloudinary deletion error:', error)
      // Don't throw error for deletion failures
    }
  }

  async cleanupLocalFile(filePath) {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Local file cleanup error:', error)
      // Don't throw error for cleanup failures
    }
  }

  validateFileSize(size) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    return size <= maxSize
  }

  validateFileType(mimeType) {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    return allowedTypes.includes(mimeType)
  }

  generateUniqueFilename(originalName) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
    
    return `${baseName}_${timestamp}_${random}${extension}`
  }
}

module.exports = new FileService()