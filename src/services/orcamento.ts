import { api } from './api'
import { ClientFormData } from '@/types/ClientFormTypes'

export const criarOrcamento = async (data: ClientFormData) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'foto' && value?.[0]) {
      formData.append('foto', value[0])
    } else {
      formData.append(key, value as string)
    }
  })

  const response = await api.post('/orcamentos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
