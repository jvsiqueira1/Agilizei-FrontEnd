import { api } from './api'

interface Cliente {
  id: string
  telefone: string
  nome: string
  email: string
  cpf: string
  enderecos: {
    create: {
      cep: string
      rua: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      estado: string
    }
  }
}

export const clientService = {
  // Verifica se um cliente existe pelo telefone
  async verificarCliente(telefone: string): Promise<Cliente | null> {
    try {
      const telefoneLimpo = telefone.replace(/\D/g, '')
      const { data } = await api.get(`/clientes/telefone/${telefoneLimpo}`)
      return data.data
    } catch (error) {
      console.error(error)
      return null
    }
  },

  // Cria um novo cliente
  async criarCliente(dados: Omit<Cliente, 'id'>): Promise<Cliente> {
    const { data } = await api.post('/clientes', dados)
    return data.data
  },
}
