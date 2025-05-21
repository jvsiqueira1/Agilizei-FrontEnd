import { api } from '@/services/api'

export interface PartnerPayload {
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  endereco: string
  tipoServicoId: number
  cpfCnpj: string
  fotoDocumento?: File
}

export const partnerService = {
  async verificarPartner(telefone: string) {
    try {
      const telefoneLimpo = telefone.replace(/\D/g, '')
      const { data } = await api.get(`/profissionais/telefone/${telefoneLimpo}`)
      return data.data
    } catch (error) {
      console.error(error)
      return null
    }
  },

  async criarPartner(dados: PartnerPayload) {
    const formData = new FormData()

    formData.append('nome', dados.nome)
    formData.append('email', dados.email)
    formData.append('telefone', dados.telefone)
    formData.append('dataNascimento', dados.dataNascimento)
    formData.append('endereco', dados.endereco)
    formData.append('tipoServicoId', dados.tipoServicoId.toString())
    formData.append('cpfCnpj', dados.cpfCnpj)

    if (dados.fotoDocumento) {
      formData.append('foto_documento', dados.fotoDocumento)
    }

    const { data } = await api.post('/profissionais', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data.data
  },
}
