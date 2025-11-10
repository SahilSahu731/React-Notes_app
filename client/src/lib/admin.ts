import api from './axios'

export const adminApi = {
  getUsers: async (page: number = 1) => {
    const response = await api.get(`/admin/users?page=${page}`)
    return response.data
  }
}