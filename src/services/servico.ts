import { ClientFormData } from '@/types/ClientFormTypes'
import { api } from './api'

export const criarServico = async (data: ClientFormData | FormData) => {
  try {
    const config =
      data instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : { headers: { 'Content-Type': 'application/json' } }

    // Envia o serviço para a API
    const response = await api.post('/servicos', data, config)
    return response.data
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    throw error
  }
}
