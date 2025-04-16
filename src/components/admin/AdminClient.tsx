import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Modal } from '@/components'

interface Client {
  id: number
  nome: string
}

interface Service {
  id: number
  descricao: string
  servico: string
  status?: string
  createdAt?: string
}

export default function AdminClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [serviceCounts, setServiceCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get('/clientes')
        setClients(data.data)

        const counts: Record<number, number> = {}
        await Promise.all(
          data.data.map(async (client: Client) => {
            const res = await api.get(`/servicos/cliente/${client.id}`)
            counts[client.id] = Array.isArray(res.data?.data)
              ? res.data.data.length
              : 0
          }),
        )
        setServiceCounts(counts)
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
      }
    }

    fetchClients()
  }, [])

  const openClientDetails = async (client: Client) => {
    try {
      const { data } = await api.get(`/servicos/cliente/${client.id}`)
      setServices(data.data)
      setSelectedClient(client)
      setModalOpen(true)
    } catch (error) {
      console.error('Erro ao buscar serviços do cliente:', error)
    }
  }

  return (
    <>
      <Table>
        <TableCaption>Lista de Clientes Agilizei</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 text-left">Nome</TableHead>
            <TableHead className="w-1/2 text-left">
              Quantidade de Serviços
            </TableHead>
            <TableHead className="w-1/4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="w-1/2 text-left">{client.nome}</TableCell>
              <TableCell className="w-1/2 text-left">
                {serviceCounts[client.id] ?? '-'}
              </TableCell>
              <TableCell className="w-1/4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openClientDetails(client)}
                >
                  Ver detalhes
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
              Serviços de {selectedClient.nome}
            </h2>
            {services?.length > 0 ? (
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.id} className="border-b pb-2">
                    <p>
                      <strong>Serviço:</strong> {service.servico}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {service.descricao}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      {service.status || 'Não informado'}
                    </p>
                    <p>
                      <strong>Data:</strong> {service.createdAt?.split('T')[0]}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum serviço encontrado para esse cliente.</p>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
