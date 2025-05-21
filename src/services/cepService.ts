import axios from 'axios'

export interface Endereco {
  logradouro: string
  bairro: string
  cidade: string
  estado: string
}

export const getCep = async (cep: string) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    const data = response.data

    if (data.erro) {
      throw new Error('CEP não encontrado.')
    }

    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    throw new Error('Erro ao buscar o endereço.')
  }
}
