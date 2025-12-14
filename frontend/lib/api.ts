import axios from 'axios'

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
  timeout: 30000,
})

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for actual API failures, not navigation
    if (error.response?.status === 401 && 
        !error.config?.url?.includes('/auth/') && 
        !isRedirecting &&
        typeof window !== 'undefined' && 
        !window.location.pathname.includes('/auth/')) {
      
      isRedirecting = true
      // Add a small delay to prevent conflicts with React navigation
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 100)
    }
    return Promise.reject(error)
  }
)

// Reset redirect flag when navigation completes
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    isRedirecting = false
  })
}

export const resumeAPI = {
  upload: (formData: FormData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/resume/list'),
  analyze: (resumeId: string) => api.post(`/resume/analyze/${resumeId}`),
  getAnalysis: (resumeId: string) => api.get(`/resume/analysis/${resumeId}`),
  delete: (resumeId: string) => api.delete(`/resume/${resumeId}`),
  matchJob: (resumeId: string, data: { jobDescription: string; jobTitle?: string; company?: string }) => 
    api.post(`/resume/match/${resumeId}`, data),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getDashboard: () => api.get('/user/dashboard'),
}