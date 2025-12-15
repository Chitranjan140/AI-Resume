import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('auth_user')
  if (user) {
    const userData = JSON.parse(user)
    config.headers['x-user-email'] = userData.email
    config.headers['x-user-name'] = userData.name
    config.headers['x-mock-auth'] = 'true'
  }
  return config
})

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
}

export default api