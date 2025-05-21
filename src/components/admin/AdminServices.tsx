import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { motion } from 'framer-motion'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { Badge } from '../ui/badge'

interface TipoServico {
  id: number
  nome: string
}

interface Servico {
  id: number
  descricao: string
  tipoServicoId: number
  status: string
  cliente: { nome: string }
  profissional?: { nome: string }
  tipoServico: TipoServico
}

export default function AdminServices() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [tiposServico, setTiposServico] = useState<TipoServico[]>([])
  const [filtroTipoServico, setFiltroTipoServico] = useState<number | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 10

  const statusMap: Record<string, { label: string; style: string }> = {
    PENDENTE: {
      label: 'Cliente aguardando orçamento',
      style: 'bg-yellow-100 text-yellow-800',
    },
    AGUARDANDO_ESCOLHA_ORCAMENTO: {
      label: 'Aguardando escolha do orçamento',
      style: 'bg-blue-100 text-blue-800',
    },
    AGENDADO: {
      label: 'Serviço agendado',
      style: 'bg-green-100 text-green-800',
    },
    CONCLUIDO: {
      label: 'Serviço concluído',
      style: 'bg-gray-300 text-gray-900',
    },
    CANCELADO: {
      label: 'Serviço cancelado',
      style: 'bg-red-200 text-red-800',
    },
    DEFAULT: {
      label: 'Status indefinido',
      style: 'bg-gray-100 text-gray-600',
    },
  }

  useEffect(() => {
    // Pegando tipos direto do backend só uma vez
    async function fetchTiposServico() {
      try {
        const response = await api.get('/tipos-servico')
        setTiposServico(response.data.data)
      } catch (error) {
        console.error('Erro ao buscar tipos de serviço', error)
      }
    }
    fetchTiposServico()
  }, [])

  useEffect(() => {
    async function fetchServicos() {
      try {
        const params: Record<string, string | number> = {
          page,
          limit: PAGE_SIZE,
        }
        if (filtroTipoServico !== null) {
          params.tipoServicoId = filtroTipoServico
        }

        const response = await api.get('/servicos', { params })

        // Ajuste caso backend retorne dentro de data.data.servicos
        const data = response.data.data ?? response.data
        const servicosLista = Array.isArray(data.servicos)
          ? data.servicos
          : data
        setServicos(servicosLista)

        setTotalPages(data.totalPages ?? 1)
      } catch (error) {
        console.error('Erro ao buscar serviços', error)
        setServicos([])
        setTotalPages(1)
      }
    }
    fetchServicos()
  }, [filtroTipoServico, page])

  function getStatusBadge(status: string) {
    const statusInfo = statusMap[status.toUpperCase()] ?? statusMap.DEFAULT
    return <Badge className={statusInfo.style}>{statusInfo.label}</Badge>
  }

  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1)

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="filtroTipoServico" className="font-semibold">
          Filtrar por tipo de serviço:
        </label>
        <select
          id="filtroTipoServico"
          className="border border-gray-300 rounded p-2"
          value={filtroTipoServico ?? ''}
          onChange={(e) => {
            const val = e.target.value
            setFiltroTipoServico(val === '' ? null : Number(val))
            setPage(1) // reset paginação ao mudar filtro
          }}
        >
          <option value="">Todos</option>
          {tiposServico.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </option>
          ))}
        </select>
      </div>

      {servicos.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold">
          Nenhum serviço encontrado.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {servicos.map((servico) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-bold mb-1">
                Tipo de serviço: {servico.tipoServico?.nome || 'Sem tipo'}
              </h2>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Cliente:</strong>{' '}
                  {servico.cliente?.nome || 'Não encontrado'}
                </p>
                <p>
                  <strong>Parceiro:</strong>{' '}
                  {servico.profissional?.nome || 'Nenhum atribuído'}
                </p>
                <div className="mt-2">{getStatusBadge(servico.status)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination
        aria-label="Paginação de serviços"
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
    </div>
  )
}
