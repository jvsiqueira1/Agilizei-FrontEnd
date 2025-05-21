/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'

export const serviceTypeList = async () => {
  const response = await api.get('/tipos-servico')
  return response.data
}

export const serviceTypeCreate = async (data: any) => {
  const response = await api.post('tipos-servico', data)
  return response.data
}

export const serviceTypeUpdate = async (id: string, data: any) => {
  const response = await api.put(`/tipos-servico/${id}`, data)
  return response.data
}

export const serviceTypeDelete = async (id: string) => {
  const response = await api.delete(`tipos-servico/${id}`)
  return response.data
}
