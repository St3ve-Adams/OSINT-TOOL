import axios from 'axios'

const API_BASE = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || ''
  : ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const ipLookup = async (ip) => {
  const response = await api.get(`/api/ip/${encodeURIComponent(ip)}`)
  return response.data
}

export const macLookup = async (mac) => {
  const response = await api.get(`/api/mac/${encodeURIComponent(mac)}`)
  return response.data
}

export const getHistory = async (type = null, page = 1, limit = 20) => {
  const params = new URLSearchParams({ page, limit })
  if (type) params.append('type', type)
  const response = await api.get(`/api/history?${params}`)
  return response.data
}

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/api/history/${id}`)
  return response.data
}

export const clearHistory = async () => {
  const response = await api.delete('/api/history')
  return response.data
}

export default api
