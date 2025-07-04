import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { Footer, Modal, ClientForm } from '@/components'
import Cookies from 'js-cookie'
import { formatarData } from '@/lib/formatData'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/useAuth'
import { useToast } from '../components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { UserCircle, Loader2 } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const tipoServicoMap: Record<number, string> = {
  1: 'Faxineira',
  2: 'Eletricista',
  3: 'Pintor',
  4: 'Montador de Móveis',
  5: 'Jardineiro',
  6: 'Freteiro',
  7: 'Pedreiro',
}

const statusMap: Record<string, { label: string; style: string }> = {
  PENDENTE: {
    label: 'Orçamento Pendente',
    style: 'bg-yellow-100 text-yellow-800',
  },
  AGUARDANDO_ESCOLHA_ORCAMENTO: {
    label: 'Aguardando escolha',
    style: 'bg-blue-100 text-blue-800',
  },
  AGENDADO: { label: 'Serviço agendado', style: 'bg-green-100 text-green-800' },
  CONCLUIDO: { label: 'Serviço concluído', style: 'bg-gray-300 text-gray-900' },
  CANCELADO: { label: 'Serviço cancelado', style: 'bg-red-200 text-red-800' },
}

type Servico = {
  id: string
  descricao: string
  dataAgendada: string
  status: string
  orcamentos: Orcamento[]
  orcamentoEscolhido?: Orcamento
  tipoServicoId: number
  tipoServicoEletrico?: string
  descricaoProblema?: string
  tamanhoImovel?: string
  tipoLimpeza?: string
  frequencia?: string
  horario?: string
  extras?: string
  descricaoMoveis?: string
  quantidadeMoveis?: number
  descricaoItens?: string
  origemDestino?: string
  superficie?: string
  condicao?: string
  prazo?: string
  descricaoServicoPedreiro?: string
  areaMetragem?: string
  tipoImovel?: string
}

type Orcamento = {
  id: number
  valor: number | null
  descricao: string
  status: string
  profissional: {
    nome: string
  }
  precisaVisitaTecnica?: boolean
  dataVisitaTecnica?: string | null
  visitaTecnicaRealizada?: boolean
}

type JwtPayload = {
  id: string
  telefone: string
}

function TipoServicoDetalhes({ servico }: { servico: Servico }) {
  return (
    <>
      {servico.tipoServicoId === 1 && (
        <>
          {servico.tamanhoImovel && (
            <p>Tamanho do imóvel: {servico.tamanhoImovel}</p>
          )}
          {servico.tipoLimpeza && <p>Tipo de limpeza: {servico.tipoLimpeza}</p>}
          {servico.frequencia && <p>Frequência: {servico.frequencia}</p>}
          {servico.horario && <p>Horário: {servico.horario}</p>}
          {servico.extras && <p>Extras: {servico.extras}</p>}
        </>
      )}
      {servico.tipoServicoId === 2 && (
        <>
          {servico.tipoServicoEletrico && (
            <p>Tipo de serviço elétrico: {servico.tipoServicoEletrico}</p>
          )}
          {servico.descricaoProblema && (
            <p>Descrição do problema: {servico.descricaoProblema}</p>
          )}
        </>
      )}
      {servico.tipoServicoId === 3 && (
        <>
          {servico.tipoImovel && <p>Tipo do imóvel: {servico.tipoImovel}</p>}
          {servico.superficie && <p>Superfície: {servico.superficie}</p>}
          {servico.condicao && <p>Condição: {servico.condicao}</p>}
          {servico.prazo && <p>Prazo: {servico.prazo}</p>}
        </>
      )}
      {servico.tipoServicoId === 4 && (
        <>
          {servico.descricaoMoveis && (
            <p>Descrição do(s) móveis: {servico.descricaoMoveis}</p>
          )}
          {servico.quantidadeMoveis && (
            <p>Quantidade de móveis: {servico.quantidadeMoveis}</p>
          )}
        </>
      )}
      {servico.tipoServicoId === 5 && (
        <>
          {servico.descricaoServicoPedreiro && (
            <p>Descrição do serviço: {servico.descricaoServicoPedreiro}</p>
          )}
          {servico.areaMetragem && (
            <p>Área de metragem: {servico.areaMetragem}</p>
          )}
        </>
      )}
      {servico.tipoServicoId === 6 && (
        <>
          {servico.descricaoItens && (
            <p>Descrição dos itens: {servico.descricaoItens}</p>
          )}
          {servico.origemDestino && (
            <p>Origem e destino: {servico.origemDestino}</p>
          )}
        </>
      )}
      {servico.tipoServicoId === 7 && (
        <>
          {servico.descricaoServicoPedreiro && (
            <p>
              Descrição do serviço de Pedreiro:{' '}
              {servico.descricaoServicoPedreiro}
            </p>
          )}
          {servico.areaMetragem && (
            <p>Área de metragem: {servico.areaMetragem}</p>
          )}
        </>
      )}
    </>
  )
}

function useResponsiveLimit() {
  const [limit, setLimit] = useState(window.innerWidth < 640 ? 5 : 9)
  useEffect(() => {
    function handleResize() {
      setLimit(window.innerWidth < 640 ? 5 : 9)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return limit
}

export default function ClientServicesPage() {
  const [modalAberto, setModalAberto] = useState(false)
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = useResponsiveLimit() // Serviços por página

  const navigate = useNavigate()
  const { logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('nome')
    logout()
    navigate('/')
  }

  const [telefoneLogado, setTelefoneLogado] = useState<string>('')
  const [userName, setUserName] = useState('')

  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'AGENDADO', label: 'Agendado' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ]

  const [selectedStatus, setSelectedStatus] = useState('PENDENTE')

  const carregarServicosPaginados = async (page: number) => {
    try {
      setLoading(true)
      const token = Cookies.get('token')
      if (!token) return
      const decoded = jwtDecode<JwtPayload>(token)
      const response = await api.get(`/servicos/cliente/${decoded.id}?page=${page}&limit=${limit}&statusList=${selectedStatus}`)
      setTelefoneLogado(decoded.telefone)
      const data = Array.isArray(response.data.servicos)
        ? response.data.servicos
        : Array.isArray(response.data)
        ? response.data
        : []
      setServicos(data)
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarServicosEReiniciarPaginacao = async () => {
    await carregarServicosPaginados(1)
    setPage(1)
  }

  const cancelarServico = async (servicoId: string) => {
    try {
      await api.put(`/servicos/${servicoId}`, { status: 'CANCELADO' })
      toast({ variant: 'default', title: 'Serviço cancelado com sucesso!' })
      atualizarServicosEReiniciarPaginacao()
    } catch (error) {
      toast({ title: 'Erro ao cancelar o serviço.' })
      console.error(error)
    }
  }

  const abrirModal = (servico: Servico) => {
    setServicoSelecionado(servico)
    setModalAberto(true)
  }

  useEffect(() => {
    const nomeCookie = Cookies.get('nome')
    if (nomeCookie) {
      setUserName(nomeCookie)
    } else {
      // Buscar nome do backend se não houver cookie
      const token = Cookies.get('token')
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token)
          api.get(`/clientes/${decoded.id}`).then(res => {
            const nome = res.data?.nome || res.data?.data?.nome
            if (nome) {
              setUserName(nome)
              Cookies.set('nome', nome)
            }
          })
        } catch {
          // ignore
        }
      }
    }
  }, [])

  useEffect(() => {
    carregarServicosPaginados(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedStatus, limit])

  // Função para ser passada ao ClientForm para controlar loading
  const handleStartLoading = () => setLoading(true)
  const handleStopLoading = () => setLoading(false)

  // Cabeçalho fixo e mais informativo
  const Header = (
    <header className="sticky top-0 z-20 bg-white shadow flex items-center justify-between px-4 py-3 mb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-orange" />
        <span className="font-semibold text-lg text-gray-800">
          Bem-vindo ao portal AGILIZEI, {userName || 'Usuário'}
        </span>
      </div>
      <Button
        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
        onClick={handleLogout}
        aria-label="Sair"
      >
        Sair
      </Button>
    </header>
  )

  return (
    <>
      {Header}
      <div className="w-full max-w-[1440px] mx-auto bg-light-gray flex flex-col py-2 px-4 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 my-4">
          <h1 className="text-2xl font-bold">Meus serviços</h1>
          <div className="w-full sm:max-w-xs md:w-auto flex items-center gap-2">
            <label htmlFor="status-select" className="block mb-1 font-medium md:sr-only">Filtrar por status:</label>
            <Select value={selectedStatus} onValueChange={value => { setSelectedStatus(value); setPage(1); }}>
              <SelectTrigger id="status-select" className="w-full md:min-w-[180px] border border-gray-300 focus:border-orange">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-flow-row justify-center md:grid-cols-3 gap-6 w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center w-full col-span-3 min-h-[200px] gap-2">
              <Loader2 className="animate-spin w-12 h-12 text-orange" />
              <span className="text-orange font-medium">Carregando serviços...</span>
            </div>
          ) : servicos.length === 0 ? (
            <div className="bg-yellow-100 text-yellow-700 border border-yellow-300 p-6 rounded max-w-xl mx-auto text-center col-span-3">
              Nenhum serviço encontrado para o status selecionado.
            </div>
          ) : (
            servicos.map((servico) => (
              <Card
                key={servico.id}
                className="w-full max-w-[400px] mx-auto flex flex-col h-full shadow-lg rounded-xl border border-gray-200 bg-white transition hover:shadow-2xl"
              >
                <CardHeader className="flex flex-col items-start gap-2 pb-2">
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-lg font-bold truncate flex-1">
                      {servico.descricao ||
                        servico.descricaoProblema ||
                        servico.descricaoServicoPedreiro ||
                        'Sem descrição'}
                    </span>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMap[servico.status]?.style}`}
                    >
                      {statusMap[servico.status]?.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {tipoServicoMap[servico.tipoServicoId]}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 flex-1 pb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Agendado para:</span>
                    <span>{formatarData(servico.dataAgendada)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row gap-2 justify-between mt-auto">
                  <Button
                    onClick={() => abrirModal(servico)}
                    className="flex-1 bg-orange text-white hover:bg-orange/80 hover:text-white"
                    variant="outline"
                  >
                    Ver detalhes
                  </Button>
                  {servico.status !== 'AGENDADO' && servico.status !== 'CANCELADO' && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelarServico(servico.id)}
                      className="flex-1"
                      title="Cancelar serviço"
                    >
                      Cancelar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* PAGINAÇÃO */}
        {typeof totalPages === 'number' && totalPages > 1 && (
          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className="border-black cursor-pointer"
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* MODAL DETALHES */}
        <Modal isVisible={modalAberto} onClose={() => setModalAberto(false)}>
          {servicoSelecionado && (
            <>
              {(() => {
                const statusOrcamento =
                  servicoSelecionado.orcamentoEscolhido?.status ||
                  servicoSelecionado.orcamentos?.[0]?.status ||
                  servicoSelecionado.status

                return (
                  <div className="space-y-4 text-sm">
                    {/* Título */}
                    <h2 className="text-lg font-bold">
                      {tipoServicoMap[servicoSelecionado.tipoServicoId]}
                    </h2>

                    {/* Informações básicas */}
                    <div className="grid gap-1">
                      <p>
                        <strong>Descrição:</strong>{' '}
                        {servicoSelecionado.descricao ||
                          servicoSelecionado.descricaoProblema ||
                          servicoSelecionado.descricaoServicoPedreiro ||
                          'Sem descrição'}
                      </p>
                      <p>
                        <strong>Status:</strong>{' '}
                        {statusMap[statusOrcamento]?.label}
                      </p>
                      <p>
                        <strong>Data agendada:</strong>{' '}
                        {formatarData(servicoSelecionado.dataAgendada)}
                      </p>

                      {/* Campos específicos por tipo de serviço */}
                      <TipoServicoDetalhes servico={servicoSelecionado} />
                    </div>

                    <hr />

                    {/* VISITA TÉCNICA */}
                    {servicoSelecionado.orcamentos.some(
                      (o) =>
                        o.precisaVisitaTecnica && !o.visitaTecnicaRealizada,
                    ) && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded flex flex-col gap-2">
                        <h3 className="text-base font-semibold mb-2">
                          Visita Técnica
                        </h3>
                        {servicoSelecionado.orcamentos
                          .filter((o) => o.precisaVisitaTecnica)
                          .map((visita) => (
                            <div key={visita.id} className="mb-2">
                              <p>
                                <strong>Profissional:</strong>{' '}
                                {visita.profissional?.nome || 'Não informado'}
                              </p>
                              <p>
                                <strong>Atenção:</strong> Necessita visita
                                técnica para realizar orçamento.
                              </p>
                              <p>
                                <strong>Descrição:</strong>{' '}
                                {visita.descricao || 'Sem descrição'}
                              </p>
                              {visita.dataVisitaTecnica && (
                                <p>
                                  <strong>Data da visita técnica:</strong>{' '}
                                  {formatarData(visita.dataVisitaTecnica)}
                                </p>
                              )}

                              {/* Botão para aceitar visita técnica */}
                              {visita.status ===
                                'AGUARDANDO_VISITA_TECNICA' && (
                                <Button
                                  className="mt-2"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await api.put(
                                        `/servicos/${servicoSelecionado.id}/confirmar-visita-cliente`,
                                        { orcamentoId: visita.id },
                                      )
                                      toast({
                                        variant: 'default',
                                        title:
                                          'Visita técnica aprovada com sucesso!',
                                      })
                                      setModalAberto(false)
                                      atualizarServicosEReiniciarPaginacao()
                                    } catch {
                                      toast({
                                        title:
                                          'Erro ao aprovar visita técnica.',
                                      })
                                    }
                                  }}
                                >
                                  Aceitar visita técnica
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* ORÇAMENTOS NORMAIS */}
                    <div>
                      <h3 className="text-base font-semibold mb-2">
                        Orçamentos
                      </h3>
                      {servicoSelecionado.orcamentos.filter(
                        (o) => !o.precisaVisitaTecnica,
                      ).length > 0 ? (
                        <ul className="space-y-3">
                          {servicoSelecionado.orcamentos
                            .filter((o) => !o.precisaVisitaTecnica)
                            .map((orcamento) => (
                              <li
                                key={orcamento.id}
                                className="border p-3 rounded bg-gray-50"
                              >
                                <p>
                                  <strong>Profissional:</strong>{' '}
                                  {orcamento.profissional?.nome ||
                                    'Não informado'}
                                </p>
                                <p>
                                  <strong>Valor:</strong> R${' '}
                                  {orcamento.valor?.toFixed(2) ||
                                    'Não informado'}
                                </p>
                                <p>
                                  <strong>Descrição:</strong>{' '}
                                  {orcamento.descricao || 'Sem descrição'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <strong>Status:</strong>{' '}
                                  {statusMap[orcamento.status]?.label}
                                </p>

                                {orcamento.status ===
                                  'AGUARDANDO_ESCOLHA_ORCAMENTO' && (
                                  <Button
                                    className="mt-2"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await api.put(
                                          `/servicos/${servicoSelecionado.id}/escolher-orcamento`,
                                          {
                                            orcamentoId: orcamento.id,
                                          },
                                        )
                                        toast({
                                          variant: 'default',
                                          title:
                                            'Orçamento aprovado com sucesso!',
                                        })
                                        setModalAberto(false)
                                        atualizarServicosEReiniciarPaginacao()
                                      } catch {
                                        toast({
                                          title: 'Erro ao aprovar orçamento.',
                                        })
                                      }
                                    }}
                                  >
                                    Aceitar orçamento
                                  </Button>
                                )}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Nenhum orçamento recebido ainda.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </>
          )}
        </Modal>

        {/* MODAL DE CADASTRO */}
        <Modal
          isVisible={modalCadastroAberto}
          onClose={() => {
            setModalCadastroAberto(false)
            atualizarServicosEReiniciarPaginacao()
          }}
        >
          <ErrorBoundary>
            <ClientForm
              telefone={telefoneLogado}
              onClose={() => {
                setModalCadastroAberto(false)
                atualizarServicosEReiniciarPaginacao()
              }}
              onStartLoading={handleStartLoading}
              onStopLoading={handleStopLoading}
            />
          </ErrorBoundary>
        </Modal>
      </div>

      <Footer />
    </>
  )
}
