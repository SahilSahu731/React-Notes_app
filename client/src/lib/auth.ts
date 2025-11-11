import api from './axios'

export type LoginData = {
  email: string
  password: string
}

export type SignUpData = {
  name: string
  username: string
  email: string
  password: string
}

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: SignUpData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  }
}