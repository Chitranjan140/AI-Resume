# AI-Powered Resume Analyzer & Job Match Platform

A comprehensive web platform that uses AI to analyze resumes, provide detailed feedback, and match candidates with job descriptions. Built with modern technologies for production-ready deployment.

## 🚀 Features

### Core Functionality
- **AI Resume Analysis**: Advanced OpenAI-powered analysis of resume content
- **Job Matching**: Compare resumes against job descriptions with match scores
- **Skill Extraction**: Automatic identification and categorization of technical/soft skills
- **ATS Optimization**: Ensure resumes pass Applicant Tracking Systems
- **Real-time Dashboard**: Comprehensive analytics and progress tracking

### User Experience
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Dark/Light Mode**: Automatic theme switching with user preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Drag & Drop Upload**: Intuitive file upload with validation
- **Real-time Feedback**: Instant notifications and progress indicators

### Security & Performance
- **Firebase Authentication**: Secure login with Google OAuth
- **Rate Limiting**: API protection against abuse
- **File Validation**: Secure file handling with type/size checks
- **Usage Limits**: Subscription-based feature access
- **Error Handling**: Comprehensive error management

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Recharts**: Data visualization
- **React Dropzone**: File upload handling

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **OpenAI API**: AI-powered analysis
- **Firebase Admin**: Authentication management

### Infrastructure
- **Cloudinary**: File storage and management
- **Firebase**: Authentication and hosting
- **MongoDB Atlas**: Cloud database
- **Vercel/Netlify**: Frontend deployment
- **Railway/Heroku**: Backend deployment

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database
- OpenAI API key
- Firebase project
- Cloudinary account

### Backend Setup

1. **Clone and navigate to backend**
```bash
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Configure the following variables in `.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resume-analyzer

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Start Backend Server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

3. **Start Frontend Server**
```bash
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user

### Resume Management
- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/analyze/:id` - Analyze resume with AI
- `GET /api/resume/analysis/:id` - Get analysis results
- `GET /api/resume/list` - Get user's resumes
- `DELETE /api/resume/:id` - Delete resume

### Job Matching
- `POST /api/resume/match/:id` - Match resume with job description
- `GET /api/resume/:id/matches` - Get job matches for resume

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/usage` - Get usage statistics

### Admin (Admin access required)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/health` - System health check

## 📊 Database Schema

### User Model
```javascript
{
  firebaseUid: String,
  email: String,
  name: String,
  subscription: 'free' | 'premium' | 'enterprise',
  usageStats: {
    resumesUploaded: Number,
    analysesPerformed: Number,
    jobMatches: Number
  }
}
```

### Resume Model
```javascript
{
  userId: ObjectId,
  filename: String,
  fileUrl: String,
  extractedText: String,
  analysis: {
    technicalSkills: [Skill],
    softSkills: [String],
    experience: Experience,
    education: [Education],
    overallScore: Number,
    atsScore: Number,
    suggestions: [String]
  }
}
```

### JobMatch Model
```javascript
{
  userId: ObjectId,
  resumeId: ObjectId,
  jobDescription: String,
  matchScore: Number,
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingSkills: [Skill],
    recommendations: [String]
  }
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Configure environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Configure network access and users
3. Update connection string in environment

## 🔒 Security Features

- **Input Validation**: Joi schema validation
- **Rate Limiting**: Express rate limiter
- **File Security**: Type and size validation
- **Authentication**: Firebase JWT verification
- **CORS Protection**: Configured origins
- **Helmet.js**: Security headers
- **Usage Limits**: Subscription-based restrictions

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries
- **File Compression**: Gzip compression
- **Caching**: Response caching strategies
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Component lazy loading

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Usage Limits

### Free Tier
- 3 resume uploads
- 5 AI analyses
- 10 job matches

### Premium Tier
- 20 resume uploads
- 50 AI analyses
- 100 job matches

### Enterprise Tier
- Unlimited usage
- Priority support
- Custom integrations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@resumeanalyzer.com or join our Slack channel.

## 🙏 Acknowledgments

- OpenAI for powerful AI capabilities
- Firebase for authentication infrastructure
- Cloudinary for file management
- MongoDB for flexible data storage
- Vercel for seamless deployment