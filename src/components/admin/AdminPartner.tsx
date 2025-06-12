import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { Switch } from '../ui/switch'
import { Modal } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'

interface Servico {
  id: number
  status?: string
  dataAgendada?: string
}

interface Parceiro {
  id: number
  nome: string
  email: string
  telefone: string
  active: boolean
  foto_documento: string
  tipoServicoId: number
  tipoServico: {
    nome: string
  }
  servicos?: Servico[]
}

function formatTelefone(telefone: string) {
  let apenasNumeros = telefone.replace(/\D/g, '')

  if (apenasNumeros.startsWith('55')) {
    apenasNumeros = apenasNumeros.slice(2)
  }

  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return telefone
}

const PAGE_SIZE = 10
const MAGNIFY_SIZE = 200
const MAGNIFY_SIZE_HALF = MAGNIFY_SIZE / 2

export default function AdminPartner() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([])
  const [selectedParceiro, setSelectedParceiro] = useState<Parceiro | null>(
    null,
  )
  const [editParceiro, setEditParceiro] = useState<Parceiro | null>(null)
  const [magnifyStyle, setMagnifyStyle] = useState<{
    backgroundImage: string
    display: string
    backgroundPosition: string
    top: string
    left: string
  }>({
    backgroundImage: '',
    display: 'none',
    backgroundPosition: '',
    top: '',
    left: '',
  })
  // Paginação
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroBusca, setFiltroBusca] = useState('')

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          page,
          limit: PAGE_SIZE,
        }
        if (filtroBusca) {
          params.search = filtroBusca
        }

        const response = await api.get(`/profissionais`, { params })
        const parceiroData = response.data?.data?.data ?? []
        const total = response.data?.data?.totalCount ?? 0
        const pages = response.data?.data?.totalPages ?? 1

        setParceiros(Array.isArray(parceiroData) ? parceiroData : [])
        setTotalPages(pages)
        setTotal(total)
      } catch (error) {
        console.error('Erro ao buscar parceiros: ', error)
        setParceiros([])
      }
    }

    fetchParceiros()
  }, [page, filtroBusca])

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/profissionais/${id}`, {
        active: !currentStatus,
      })

      setParceiros((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p)),
      )
    } catch (error) {
      console.error('Erro ao atualizar status: ', error)
    }
  }

  const handleParceiroClick = async (parceiro: Parceiro) => {
    try {
      const response = await api.get(`/profissionais/${parceiro.id}/servicos`)
      const servicos = response.data.data ?? []
      console.log(servicos)
      setSelectedParceiro({ ...parceiro, servicos })
      setMagnifyStyle({
        ...magnifyStyle,
        backgroundImage: `url(${import.meta.env.VITE_BASE_URL}/uploads/${parceiro.foto_documento})`,
      })
    } catch (error) {
      console.error('Erro ao buscar serviços do parceiro:', error)
      setSelectedParceiro(parceiro)
    }
  }

  const abrirModalEdicao = (parceiro: Parceiro) => {
    setEditParceiro(parceiro)
  }

  const salvarEdicao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editParceiro) return

    try {
      await api.put(`/profissionais/${editParceiro.id}`, {
        nome: editParceiro.nome,
        email: editParceiro.email,
        telefone: editParceiro.telefone,
      })

      setParceiros((prev) =>
        prev.map((p) => (p.id === editParceiro.id ? editParceiro : p)),
      )
      closeModal()
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error)
    }
  }

  const handleEditChange = (field: keyof Parceiro, value: string | boolean) => {
    if (!editParceiro) return
    setEditParceiro({
      ...editParceiro,
      [field]: value,
    })
  }

  const closeModal = () => {
    setSelectedParceiro(null)
    setEditParceiro(null)
    setMagnifyStyle({
      ...magnifyStyle,
      display: 'none',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    const { offsetX, offsetY, target } = e.nativeEvent
    const { offsetWidth, offsetHeight } = target

    const xPercentage = (offsetX / offsetWidth) * 100
    const yPercentage = (offsetY / offsetHeight) * 100

    setMagnifyStyle((prev) => ({
      ...prev,
      display: 'block',
      backgroundPosition: `${xPercentage}% ${yPercentage}%`,
      top: `${offsetY - MAGNIFY_SIZE_HALF}px`,
      left: `${offsetX - MAGNIFY_SIZE_HALF}px`,
    }))
  }

  const handleMouseLeave = () => {
    setMagnifyStyle((prev) => ({ ...prev, display: 'none' }))
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
          placeholder="Digite nome, telefone, email ou tipo de serviço"
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
            setPage(1)
          }}
        >
          Buscar
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parceiros.map((parceiro) => (
            <TableRow key={parceiro.id}>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() => handleParceiroClick(parceiro)}
                >
                  {parceiro.nome}
                </Button>
              </TableCell>
              <TableCell>{parceiro.email}</TableCell>
              <TableCell><a href={`https://wa.me/${parceiro.telefone.replace(/\D/g, '').startsWith('55') ? parceiro.telefone.replace(/\D/g, '') : `55${parceiro.telefone.replace(/\D/g, '')}`}`} target='_blank' rel='noopener noreferrer'>{formatTelefone(parceiro.telefone)}</a></TableCell>
              <TableCell>{parceiro.active ? 'Ativo' : 'Inativo'}</TableCell>
              <TableCell>
                <Switch
                  checked={parceiro.active}
                  onCheckedChange={() =>
                    handleStatusChange(parceiro.id, parceiro.active)
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => abrirModalEdicao(parceiro)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total de Parceiros</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Pagination
        aria-label="Paginação de parceiros"
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

      {selectedParceiro && (
        <Modal isVisible={true} onClose={closeModal}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Parceiro</h2>
            <div>
              <p>
                <strong>Nome:</strong> {selectedParceiro.nome}
              </p>
              <p>
                <strong>Email:</strong> {selectedParceiro.email}
              </p>
              <p>
                <strong>Telefone:</strong>{' '}
                {formatTelefone(selectedParceiro.telefone)}
              </p>
              <p>
                <strong>Tipo de serviço:</strong>{' '}
                {selectedParceiro.tipoServico.nome}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedParceiro.active ? 'Ativo' : 'Inativo'}
              </p>
              <div className="relative cursor-none">
                <strong>Foto do Documento:</strong>
                <br />
                {/* Exibindo a foto do documento */}
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/uploads/${selectedParceiro.foto_documento}`}
                  alt="Foto do Documento"
                  className="w-full h-auto mt-4 border-2 border-black"
                  draggable={false}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                />
                <div className="magnify" style={magnifyStyle}></div>
              </div>
            </div>
            {selectedParceiro.servicos &&
              selectedParceiro.servicos.length > 0 && (
                <>
                  <h3 className="mt-6 mb-4 text-lg font-semibold">
                    Serviços do Parceiro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedParceiro.servicos.map((servico) => (
                      <div
                        key={servico.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p>
                          <strong>Status:</strong>{' '}
                          {servico.status || 'Não informado'}
                        </p>
                        <p>
                          <strong>Data Agendada:</strong>{' '}
                          {servico.dataAgendada
                            ? new Date(servico.dataAgendada).toLocaleDateString(
                                'pt-BR',
                              )
                            : 'Não informada'}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        </Modal>
      )}

      {editParceiro && (
        <Modal isVisible={true} onClose={closeModal}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Editar Parceiro</h2>
            <form onSubmit={salvarEdicao} className="space-y-4">
              <div>
                <label className="block font-medium mb-1" htmlFor="nome">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editParceiro.nome}
                  onChange={(e) => handleEditChange('nome', e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={editParceiro.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="telefone">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editParceiro.telefone}
                  onChange={(e) => handleEditChange('telefone', e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-black hover:bg-opacity-70">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  )
}
