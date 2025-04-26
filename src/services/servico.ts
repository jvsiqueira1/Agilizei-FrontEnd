import { ClientFormData } from '@/types/ClientFormTypes'
import { api } from './api'

export const criarServico = async (data: ClientFormData) => {
  try {
    // Envia o serviço para a API
    const response = await api.post('/servicos', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    throw error
  }
}
