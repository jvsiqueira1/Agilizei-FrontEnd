import { api } from './api'
import { ClientFormData } from '@/types/ClientFormTypes'

<<<<<<< HEAD:src/services/servico.ts
export const criarServico = async (data: ClientFormData) => {
  const formData = new FormData()
=======
export const criarOrcamento = async (data: ClientFormData) => {
  console.log('data criar serviço:', data)
>>>>>>> 66e56ec57fcf5d47ed94cc8b5069d35b30b088b0:src/services/orcamento.ts

  try {
    const telefoneLimpo = data.telefone.replace(/\D/g, '')
    console.log('telefone limpo:', telefoneLimpo)

    // Estrutura do cliente conforme solicitado
    const clienteData = {
      nome: data.nome,
      email: data.email,
      telefone: telefoneLimpo,
      cpf: data.cpf,
      enderecos: {
        create: {
          rua: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep.replace(/\D/g, ''),
          complemento: data.complemento,
        },
      },
    }

<<<<<<< HEAD:src/services/servico.ts
  const response = await api.post('/servicos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
=======
    // Prepara os dados do serviço
    const formData = new FormData()
    formData.append('servico', data.servico)
    formData.append('descricao', data.descricao)
>>>>>>> 66e56ec57fcf5d47ed94cc8b5069d35b30b088b0:src/services/orcamento.ts

    // Adiciona campos específicos do serviço se existirem
    if (data.tamanhoImovel) formData.append('tamanhoImovel', data.tamanhoImovel)
    if (data.tipoLimpeza) formData.append('tipoLimpeza', data.tipoLimpeza)
    if (data.frequencia) formData.append('frequencia', data.frequencia)
    if (data.horario) formData.append('horario', data.horario)
    if (data.extras) formData.append('extras', data.extras)
    if (data.tipoImovel) formData.append('tipoImovel', data.tipoImovel)
    if (data.superficie) formData.append('superficie', data.superficie)
    if (data.condicao) formData.append('condicao', data.condicao)
    if (data.prazo) formData.append('prazo', data.prazo)
    if (data.tipoServico) formData.append('tipoServico', data.tipoServico)
    if (data.descricaoProblema)
      formData.append('descricaoProblema', data.descricaoProblema)
    if (data.descricaoMoveis)
      formData.append('descricaoMoveis', data.descricaoMoveis)
    if (data.quantidadeMoveis)
      formData.append('quantidadeMoveis', data.quantidadeMoveis.toString())
    if (data.descricaoServico)
      formData.append('descricaoServico', data.descricaoServico)
    if (data.areaMetragem) formData.append('areaMetragem', data.areaMetragem)
    if (data.descricaoItens)
      formData.append('descricaoItens', data.descricaoItens)
    if (data.origemDestino) formData.append('origemDestino', data.origemDestino)

    // Adiciona a foto se existir
    if (data.foto?.[0]) {
      formData.append('foto', data.foto[0])
    }

    api
      .get(`/clientes/telefone/${telefoneLimpo}`)
      .then((clientResponse) => {
        console.log('clienteResponse:', clientResponse)
      })
      .catch(async () => {
        await criarCliente(clienteData)
        await criarServico(formData)
      })

    //função para criar o cliente
    const criarCliente = async (cliente: typeof clienteData) => {
      const response = await api.post('/clientes', cliente)
      return response.data
    }

    //função para criar o serviço
    const criarServico = async (servico: FormData) => {
      const response = await api.post('/servicos', servico, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    }
  } catch (error) {
    console.error('Erro ao criar orçamento:', error)
    throw error
  }
}
