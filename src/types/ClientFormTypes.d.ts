export interface ClientFormData {
  telefone: string
  servico: string
  nome: string
  email: string
  cpf: string
  cep: string
  logradouro: string
  dataAgendada: string
  complemento: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  descricao: string
  foto: FileList | null

  tamanhoImovel?: string
  tipoLimpeza?: string
  frequencia?: string
  horario?: string
  extras?: string

  tipoImovel?: string
  superficie?: string
  condicao?: string
  prazo?: string

  tipoServicoEletrico?: string
  descricaoProblema?: string

  descricaoMoveis?: string
  quantidadeMoveis?: number

  descricaoServicoPedreiro?: string
  areaMetragem?: string

  descricaoItens?: string
  origemDestino?: string
}
