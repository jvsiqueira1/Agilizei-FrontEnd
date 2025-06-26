import { z } from 'zod'

// Função para validar data no formato brasileiro (DD/MM/YYYY)
const validateBrazilianDate = (dateString: string) => {
  if (!dateString) return false

  // Regex para formato DD/MM/YYYY
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = dateString.match(regex)

  if (!match) return false

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1 // Mês começa em 0 no JavaScript
  const year = parseInt(match[3], 10)

  // Cria a data e verifica se é válida
  const date = new Date(year, month, day)

  return (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year &&
    date >= new Date() // Data não pode ser no passado
  )
}

export const clientSchema = z.object({
  telefone: z.string().min(14, 'Telefone é obrigatório'),
  servico: z.string().nonempty('Selecione um serviço'),
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(14, 'CPF inválido'),
  cep: z.string().min(9, 'CEP obrigatório'),
  logradouro: z.string().nonempty('Logradouro obrigatório'),
  numero: z.string().nonempty('Número obrigatório'),
  bairro: z.string().nonempty('Bairro obrigatório'),
  cidade: z.string().nonempty('Cidade obrigatória'),
  estado: z.string().nonempty('Estado obrigatório'),
  dataAgendada: z.string().refine(validateBrazilianDate, {
    message:
      'Data inválida. Use o formato DD/MM/AAAA e certifique-se de que a data não é no passado.',
  }),
  complemento: z.string(),

  descricao: z.string().optional(),
  foto: z.any().optional(),

  tipoLimpeza: z.string().optional(),
  horario: z.string().optional(),
  extras: z.string().optional(),
  tipoImovel: z.string().optional(),
  tamanhoImovel: z.string().optional(),
  frequencia: z.string().optional(),
  superficie: z.string().optional(),
  condicao: z.string().optional(),
  prazo: z.string().optional(),

  tipoServicoEletrico: z.string().optional(),
  descricaoProblema: z.string().optional(),

  descricaoMoveis: z.string().optional(),
  quantidadeMoveis: z.coerce.number().optional(),

  descricaoServicoPedreiro: z.string().optional(),
  areaMetragem: z.string().optional(),

  descricaoItens: z.string().optional(),
  origemDestino: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>
