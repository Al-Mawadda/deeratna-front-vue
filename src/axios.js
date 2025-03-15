import axios from 'axios'
import { useAuthStore } from './stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  //baseURL: 'https://app.deeratna.net/public/api/',
  //baseURL: 'https://test.deeratna.net/backend/public/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})
export function GetServerPath() {
  const baseURL = api.defaults.baseURL // Get the baseURL
  try {
    const url = new URL(baseURL)
    const pathWithoutAPI = url.pathname.replace(/\/api\/?$/, '') // Remove '/api/' from the pathname
    return `${url.origin}${pathWithoutAPI}` // Combine origin and modified pathname
  } catch (error) {
    console.error('Invalid URL', error)
    return null
  }
}

export { api }
