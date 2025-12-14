import axios from 'axios'

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
  timeout: 30000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export const resumeAPI = {
  upload: (formData: FormData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyze: (resumeId: string) => api.post(`/resume/analyze/${resumeId}`),
  getAnalysis: (resumeId: string) => api.get(`/resume/analysis/${resumeId}`),
  matchJob: (resumeId: string, jobDescription: string) => 
    api.post(`/resume/match/${resumeId}`, { jobDescription }),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getDashboard: () => api.get('/user/dashboard'),
}