import { z } from 'zod'

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
  dataAgendada: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
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
