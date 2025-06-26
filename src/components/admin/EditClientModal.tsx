import { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DayPicker, Modal } from '@/components'

interface Servico {
  id: number
  nome: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  descricao?: string
  descricaoProblema?: string
  descricaoServicoPedreiro?: string
  dataAgendada?: string | null
}

interface Client {
  id: number
  nome: string
  email: string
  telefone: string
  cpf?: string
  cnpj?: string
  servicos?: Servico[]
}

type FormData = Client

interface EditClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  onSave: (data: FormData) => Promise<void>
}

export default function EditClientModal({
  isOpen,
  onClose,
  client,
  onSave,
}: EditClientModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: client || {},
  })

  const { fields } = useFieldArray({
    control,
    name: 'servicos',
  })
  const [servicoAberto, setServicoAberto] = useState<number | null>(null)

  useEffect(() => {
    reset(client || {})
    setServicoAberto(null)
  }, [client, reset])

  const onSubmit = async (data: FormData) => {
    if (client && !data.id) {
      data.id = client.id
    }
    if (data.servicos) {
      data.servicos = data.servicos.map((s) => ({
        ...s,
        dataAgendada: s.dataAgendada
          ? new Date(s.dataAgendada).toISOString()
          : null,
      }))
    }

    await onSave(data)
    onClose()
  }

  return (
    <Modal isVisible={isOpen} onClose={onClose}>
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Editar Cliente - {client?.nome || ''}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos básicos */}
          <div>
            <label className="block font-medium mb-1" htmlFor="nome">
              Nome
            </label>
            <Input
              id="nome"
              {...register('nome', { required: true })}
              className="border-black"
            />
            {errors.nome && (
              <span className="text-red-600 text-sm">Nome é obrigatório</span>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              {...register('email', { required: true })}
              className="border-black"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">Email é obrigatório</span>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="telefone">
              Telefone
            </label>
            <Input
              id="telefone"
              {...register('telefone')}
              className="border-black"
            />
          </div>

          {/* CPF e CNPJ */}
          {client?.cpf && (
            <div>
              <label className="block font-medium mb-1" htmlFor="cpf">
                CPF
              </label>
              <Input id="cpf" {...register('cpf')} className="border-black" />
            </div>
          )}

          {client?.cnpj && (
            <div>
              <label className="block font-medium mb-1" htmlFor="cnpj">
                CNPJ
              </label>
              <Input id="cnpj" {...register('cnpj')} className="border-black" />
            </div>
          )}

          {/* Cards de serviços com endereços */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Endereços por Serviço
            </h3>
            {fields.length === 0 && <p>Cliente sem serviços cadastrados.</p>}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-black rounded p-4 mb-4 cursor-pointer"
                onClick={() =>
                  setServicoAberto(servicoAberto === index ? null : index)
                }
              >
                <h4 className="font-semibold mb-1">
                  Serviço:{' '}
                  {field.descricao ||
                    field.descricaoProblema ||
                    field.descricaoServicoPedreiro}
                </h4>
                <p>
                  {field.logradouro || ''}, {field.numero || ''}
                </p>
                <p>
                  {field.bairro || ''} - {field.cidade || ''}/
                  {field.estado || ''}
                </p>
                <p>CEP: {field.cep || ''}</p>
                <p>
                  Data Agendada:{' '}
                  {field.dataAgendada
                    ? new Date(field.dataAgendada).toLocaleDateString('pt-BR')
                    : ''}
                </p>

                {servicoAberto === index && (
                  <div className="mt-4 space-y-2">
                    <Input
                      placeholder="Logradouro"
                      {...register(`servicos.${index}.logradouro` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="Número"
                      {...register(`servicos.${index}.numero` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="Bairro"
                      {...register(`servicos.${index}.bairro` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="Cidade"
                      {...register(`servicos.${index}.cidade` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="Estado"
                      {...register(`servicos.${index}.estado` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="CEP"
                      {...register(`servicos.${index}.cep` as const, {
                        required: true,
                      })}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                      placeholder="Complemento"
                      {...register(`servicos.${index}.complemento` as const)}
                      className="border-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Controller
                      control={control}
                      name={`servicos.${index}.dataAgendada` as const}
                      defaultValue=""
                      render={({ field }) => (
                        <DayPicker
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          className="border-black hover:bg-white"
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-black hover:bg-opacity-70 ml-2">
              Salvar Cliente
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
