import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:8000/api/',
  baseURL: 'https://app.deeratna.net/backend/public/api/',
  //baseURL: 'https://test.deeratna.net/backend/public/api/',
  headers: {
    'Content-Type': 'application/json',
  },
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
export default api
export { api }
