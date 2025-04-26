import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { Modal } from '@/components'
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '../ui/table'

interface Client {
  id: number
  nome: string
  email: string
  telefone: string
  cpf?: string
  cnpj?: string
  enderecos?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }[]
}

export default function AdminClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { register, handleSubmit, setValue, reset } = useForm<Client>()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get('/clientes')
        setClients(data.data)
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
      }
    }

    fetchClients()
  }, [])

  const openClientDetails = (client: Client) => {
    setSelectedClient(client)
    reset(client)

    setValue('nome', client.nome)
    setValue('email', client.email)
    setValue('telefone', client.telefone)

    if (client.cpf) {
      setValue('cpf', client.cpf)
    } else if (client.cnpj) {
      setValue('cnpj', client.cnpj)
    }

    if (client.enderecos && client.enderecos[0]) {
      const address = client.enderecos[0]
      setValue('enderecos.0.rua', address.rua)
      setValue('enderecos.0.numero', address.numero)
      setValue('enderecos.0.complemento', address.complemento || '')
      setValue('enderecos.0.bairro', address.bairro)
      setValue('enderecos.0.cidade', address.cidade)
      setValue('enderecos.0.estado', address.estado)
      setValue('enderecos.0.cep', address.cep)
    }

    setModalOpen(true)
  }

  const onSubmit = async (data: Client) => {
    try {
      console.log('Dados enviados para atualização:', data)

      if (data.enderecos && data.enderecos.length > 0) {
        const endereco = data.enderecos[0]

        data.enderecos = [
          {
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            cep: endereco.cep,
          },
        ]
      }

      if (selectedClient) {
        const updatedClient = await api.put(
          `/clientes/${selectedClient.id}`,
          data,
        )
        console.log('Cliente atualizado com sucesso: ', updatedClient)

        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === selectedClient?.id ? { ...client, ...data } : client,
          ),
        )

        alert('Cliente atualizado com sucesso!')
        setModalOpen(false)
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente: ', error)
      alert('Erro ao atualizar cliente.')
    }
  }

  return (
    <>
      <Table>
        <TableCaption>Lista de Clientes Agilizei</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 text-left">Nome</TableHead>
            <TableHead className="w-1/2 text-left">Email</TableHead>
            <TableHead className="w-1/4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="w-1/2 text-left">{client.nome}</TableCell>
              <TableCell className="w-1/2 text-left">{client.email}</TableCell>
              <TableCell className="w-1/4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openClientDetails(client)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="w-1/2 font-bold text-left" colSpan={2}>
              Total de Clientes
            </TableCell>
            <TableCell className="w-1/4 text-right">{clients.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Modal isVisible={isModalOpen} onClose={() => setModalOpen(false)}>
        {selectedClient && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Editar Cliente - {selectedClient.nome}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  {...register('nome')}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input id="email" placeholder="Email" {...register('email')} />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telefone
                </label>
                <Input
                  id="telefone"
                  placeholder="Telefone"
                  {...register('telefone')}
                />
              </div>

              {selectedClient.cpf && (
                <div>
                  <label
                    htmlFor="cpf"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPF
                  </label>
                  <Input id="cpf" placeholder="CPF" {...register('cpf')} />
                </div>
              )}

              {selectedClient.cnpj && (
                <div>
                  <label
                    htmlFor="cnpj"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CNPJ
                  </label>
                  <Input id="cnpj" placeholder="CNPJ" {...register('cnpj')} />
                </div>
              )}

              {selectedClient.enderecos && selectedClient.enderecos[0] && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="enderecos[0].rua"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rua
                    </label>
                    <Input
                      id="enderecos[0].rua"
                      placeholder="Rua"
                      {...register('enderecos.0.rua')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].numero"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número
                    </label>
                    <Input
                      id="enderecos[0].numero"
                      placeholder="Número"
                      {...register('enderecos.0.numero')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].bairro"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bairro
                    </label>
                    <Input
                      id="enderecos[0].bairro"
                      placeholder="Bairro"
                      {...register('enderecos.0.bairro')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].cidade"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade
                    </label>
                    <Input
                      id="enderecos[0].cidade"
                      placeholder="Cidade"
                      {...register('enderecos.0.cidade')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].estado"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado
                    </label>
                    <Input
                      id="enderecos[0].estado"
                      placeholder="Estado"
                      {...register('enderecos.0.estado')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].cep"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CEP
                    </label>
                    <Input
                      id="enderecos[0].cep"
                      placeholder="CEP"
                      {...register('enderecos.0.cep')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enderecos[0].complemento"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Complemento
                    </label>
                    <Input
                      id="enderecos[0].complemento"
                      placeholder="Complemento"
                      {...register('enderecos.0.complemento')}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  )
}
