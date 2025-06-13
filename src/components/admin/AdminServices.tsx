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
import Modal from '@/components/Modal'
import { Button } from '../ui/button'

interface TipoServico {
  id: number
  nome: string
}

interface Servico {
  id: number
  descricao: string
  descricaoProblema?: string
  descricaoServicoPedreiro?: string
  tipoServicoId: number
  status: string
  cliente: { nome: string; telefone: string }
  profissional?: { nome: string; telefone: string }
  tipoServico: TipoServico
  orcamentos?: Orcamento[]
}

interface Orcamento {
  id: number;
  valor: number;
  descricao: string;
  status: string;
  profissional: {
    nome: string;
    telefone: string;
  };
}

export default function AdminServices() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [tiposServico, setTiposServico] = useState<TipoServico[]>([])
  const [filtroTipoServico, setFiltroTipoServico] = useState<number | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 9

  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

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

  const handleServicoClick = async (servicoId: number) => {
    try {
      const response = await api.get(`/servicos/${servicoId}`);
      const servicoDetalhado = response.data.data ?? response.data;
      setSelectedServico(servicoDetalhado)
      console.log('Serviço selecionado:', servicoDetalhado);
    } catch (error) {
      console.error('Erro ao buscar detalhes do serviço:', error);
    }
  };

  const closeModal = () => {
    setSelectedServico(null);
  };

  function getStatusBadge(status: string) {
    const statusInfo = statusMap[status.toUpperCase()] ?? statusMap.DEFAULT
    return <Badge className={statusInfo.style}>{statusInfo.label}</Badge>
  }

  const getWhatsappLink = (telefone: string | undefined) => {
    if (!telefone) return '#';
    const telefoneLimpo = telefone.replace(/\D/g, '');
    const telefoneComDDI = telefoneLimpo.startsWith('55') ? telefoneLimpo : `55${telefoneLimpo}`;
    return `https://wa.me/${telefoneComDDI}`;
  };

  const servicosFiltrados = servicos.filter(servico => {
    if (filtroStatus && servico.status !== filtroStatus) return false
    return true
  })

  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1)

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
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

        <label htmlFor="filtroStatus" className="font-semibold">
          Status:
        </label>
        <select
          id="filtroStatus"
          className="border border-gray-300 rounded p-2"
          value={filtroStatus ?? ''}
          onChange={(e) => {
            const val = e.target.value
            setFiltroStatus(val === '' ? null : val)
            setPage(1)
          }}
        >
            <option value="">Todos</option>
            <option value="PENDENTE">Cliente aguardando orçamento</option>
            <option value="AGUARDANDO_ESCOLHA_ORCAMENTO">Aguardando escolha</option>
            <option value="AGENDADO">Serviço agendado</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
      </div>

      {servicosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold">
          Nenhum serviço encontrado.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {servicosFiltrados.map((servico) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleServicoClick(servico.id)}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                <div className="mt-2">
                  <strong>Status:</strong> {getStatusBadge(servico.status)}
                </div>
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

      <Modal isVisible={!!selectedServico} onClose={closeModal}>
        {selectedServico && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Detalhes do Serviço</h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Tipo de Serviço:</strong>{' '}
                {selectedServico.tipoServico?.nome || 'N/A'}
              </p>
              <p>
                <strong>Descrição:</strong>{' '}
                {selectedServico.descricao || selectedServico.descricaoProblema || selectedServico.descricaoServicoPedreiro || 'N/A'}
              </p>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedServico.status)}
              </div>
              <p>
                <strong>Cliente:</strong>{' '}
                {selectedServico.cliente?.nome || 'N/A'}
                {selectedServico.cliente?.telefone && (
                  <a
                    href={getWhatsappLink(selectedServico.cliente.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    (WhatsApp)
                  </a>
                )}
              </p>
              <p>
                <strong>Parceiro Atribuído:</strong>{' '}
                {selectedServico.profissional?.nome || 'Nenhum'}
                {selectedServico.profissional?.telefone && (
                  <a
                    href={getWhatsappLink(selectedServico.profissional.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    (WhatsApp)
                  </a>
                )}
              </p>
            </div>

            {/* Exibição dos Orçamentos */}
            {selectedServico.orcamentos && selectedServico.orcamentos.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Orçamentos Recebidos</h3>
                <div className="space-y-4">
                  {selectedServico.orcamentos.map((orcamento) => (
                    <div key={orcamento.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                      <p>
                        <strong>Profissional:</strong> {orcamento.profissional?.nome || 'N/A'}
                        {orcamento.profissional?.telefone && (
                          <a
                            href={getWhatsappLink(orcamento.profissional.telefone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            (WhatsApp)
                          </a>
                        )}
                      </p>
                      <p>
                        <strong>Valor:</strong>{' '}
                        {orcamento.valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                      <p>
                        <strong>Descrição do Orçamento:</strong> {orcamento.descricao || 'N/A'}
                      </p>
                      {/* AQUI: Mudei a <p> para <div> para conter o Badge */}
                      <div> {/* Alterado de <p> para <div> */}
                        <strong>Status do Orçamento:</strong>{' '}
                        <Badge
                          className={
                            orcamento.status === 'ACEITO'
                              ? 'bg-green-500 text-white'
                              : orcamento.status === 'REJEITADO'
                                ? 'bg-red-500 text-white'
                                : 'bg-blue-300 text-blue-900' 
                          }
                        >
                          {orcamento.status || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-8 text-gray-500 italic">Nenhum orçamento para este serviço.</p>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}