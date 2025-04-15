export interface Servico {
  id: number
  titulo: string
  descricao: string
  status: string
  tipoServicoId: number
  cliente: {
    nome: string
  }
  profissional?: {
    nome: string
  } | null
  createdAt: string
}
