import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { api } from '@/services/api'
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import EditClientModal from './EditClientModal'
import { useToast } from '@/components/hooks/use-toast'

interface Client {
  id: number
  nome: string
  email: string
  telefone: string
  cpf?: string
  cnpj?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  servicos?: any[]
}

const PAGE_SIZE = 10

export default function AdminClient() {
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroBusca, setFiltroBusca] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Client | null>(
    null,
  )

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          page,
          limit: PAGE_SIZE,
        }
        if (filtroBusca) {
          params.search = filtroBusca
        }

        const response = await api.get('/clientes', { params })

        const clientData =
          response.data?.data?.data ?? response.data?.data ?? []
        const totalCount =
          response.data?.data?.totalCount ??
          response.data?.total ??
          clientData.length
        const pages = response.data?.data?.totalPages ?? 1

        setClients(Array.isArray(clientData) ? clientData : [])
        setTotal(totalCount)
        setTotalPages(pages)
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
        setClients([])
        setTotal(0)
        setTotalPages(1)
      }
    }

    fetchClients()
  }, [page, filtroBusca])

  const abrirModal = (client: Client) => {
    setClienteSelecionado(client)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setClienteSelecionado(null)
  }

  const salvarCliente = async (data: Client) => {
    try {
      console.log('Enviando para API: ', data)
      await api.put(`/clientes/${data.id}`, data)
      setClients((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)),
      )
      toast({
        variant: 'default',
        title: 'Cliente atualizado com sucesso',
      })
      fecharModal()
    } catch {
      toast({
        title: 'Erro ao atualizar cliente',
      })
    }
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <>
      <div className="mb-4 flex justify-center items-center">
        <label htmlFor="buscaGeral" className="font-semibold mr-2">
          Buscar por nome, telefone, email ou tipo de serviço:
        </label>
        <Input
          id="buscaGeral"
          type="text"
          className="border-black rounded-full px-3 py-2 w-full max-w-md"
          value={termoBusca}
          onChange={(e) => {
            setTermoBusca(e.target.value)
            if (e.target.value.trim() === '') {
              setFiltroBusca('')
              setPage(1)
            }
          }}
          placeholder="Digite nome, telefone ou email"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setFiltroBusca(termoBusca)
              setPage(1)
            }
          }}
        />
        <Button
          className="bg-black hover:bg-opacity-70 ml-2"
          onClick={() => {
            setFiltroBusca(termoBusca)
            setPage(1) // resetar página ao buscar
          }}
        >
          Buscar
        </Button>
      </div>
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
                  onClick={() => abrirModal(client)}
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
            <TableCell className="w-1/4 text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Pagination
        aria-label="Paginação de clientes"
        className="mt-6 flex justify-center"
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
              aria-disabled={page === 1}
            />
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                className="border-none hover:bg-inherit"
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault()
                  setPage(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className="hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <EditClientModal
        isOpen={modalAberto}
        onClose={fecharModal}
        client={clienteSelecionado}
        onSave={salvarCliente}
      />
    </>
  )
}
