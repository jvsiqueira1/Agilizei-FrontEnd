export interface PartnerFormType {
  nome: string
  email: string
  cpfCnpj: string
  dataNascimento: string
  telefone: string
  tipoServico: string
  fotoDocumento?: FileList
  termosAceitos: boolean

  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}
