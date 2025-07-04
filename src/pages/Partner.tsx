import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { Footer, Modal } from '@/components'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Cookies from 'js-cookie'
import { formatarData } from '@/lib/formatData'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/useAuth'
import { useToast } from '@/components/hooks/use-toast'
import { IMaskInput } from 'react-imask'
import { DayPicker } from '@/components'
import { parse, isValid } from 'date-fns'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { UserCircle, Loader2, LogOut } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const statusMap: Record<string, { label: string; style: string }> = {
  PENDENTE: {
    label: 'Orçamento Pendente',
    style: 'bg-yellow-100 text-yellow-800',
  },
  AGUARDANDO_VISITA_TECNICA: {
    label: 'Aguardando visita técnica',
    style: 'bg-blue-100 text-blue-800',
  },
  VISITA_TECNICA_CONFIRMADA: {
    label: 'Visita técnica confirmada',
    style: 'bg-blue-100 text-blue-800',
  },
  VISITA_TECNICA_REALIZADA: {
    label: 'Visita técnica realizada',
    style: 'bg-blue-100 text-blue-800',
  },
  AGUARDANDO_ENVIO_ORCAMENTO: {
    label: 'Aguardando envio do orçamento',
    style: 'bg-orange-100 text-orange-800',
  },
  AGUARDANDO_ESCOLHA_ORCAMENTO: {
    label: 'Aguardando escolha',
    style: 'bg-blue-100 text-blue-800',
  },
  AGENDADO: { label: 'Serviço agendado', style: 'bg-green-100 text-green-800' },
  CONCLUIDO: { label: 'Serviço concluído', style: 'bg-gray-300 text-gray-900' },
  CANCELADO: { label: 'Serviço cancelado', style: 'bg-red-200 text-red-800' },
}

type Orcamento = {
  id: number
  valor: number
  descricao: string
  status: string
  profissionalId?: number
  precisaVisitaTecnica?: boolean
  dataVisitaTecnica?: string | null
  visitaTecnicaRealizada?: boolean
}

type Servico = {
  id: string
  descricao: string
  dataAgendada: string
  status: string
  orcamentos: Orcamento[]
  tipoServicoId: number
  nome: string
  telefone: string
  email: string
  cep: string
  logradouro: string
  complemento?: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  profissionalId?: number | null
  visitaTecnicaRealizada?: boolean

  descricaoServicoPedreiro?: string
  tamanhoImovel?: string
  tipoLimpeza?: string
  frequencia?: string
  horario?: string
  extras?: string
  tipoImovel?: string
  superficie?: string
  condicao?: string
  prazo?: string
  tipoServicoEletrico?: string
  descricaoProblema?: string
  descricaoMoveis?: string
  quantidadeMoveis?: string
  areaMetragem?: string
  descricaoItens?: string
  origemDestino?: string
  foto?: string
}

type JwtPayload = {
  id: string
  telefone: string
  role: 'partner'
  tipoServicoId: number
}

const tipoServicoMap: Record<number, string> = {
  1: 'Faxineira',
  2: 'Eletricista',
  3: 'Pintor',
  4: 'Montador de Móveis',
  5: 'Jardineiro',
  6: 'Freteiro',
  7: 'Pedreiro',
}

const detalhesExtras = [
  { key: 'tamanhoImovel', label: 'Tamanho do Imóvel' },
  { key: 'tipoLimpeza', label: 'Tipo de Limpeza' },
  { key: 'frequencia', label: 'Frequência' },
  { key: 'horario', label: 'Horário' },
  { key: 'extras', label: 'Extras' },
  { key: 'tipoImovel', label: 'Tipo de Imóvel' },
  { key: 'superficie', label: 'Superfície' },
  { key: 'condicao', label: 'Condição' },
  { key: 'prazo', label: 'Prazo' },
  { key: 'tipoServicoEletrico', label: 'Tipo de Serviço Elétrico' },
  { key: 'descricaoProblema', label: 'Descrição do Problema' },
  { key: 'descricaoMoveis', label: 'Descrição dos Móveis' },
  { key: 'quantidadeMoveis', label: 'Quantidade de Móveis' },
  {
    key: 'descricaoServicoPedreiro',
    label: 'Descrição do Serviço de Pedreiro',
  },
  { key: 'areaMetragem', label: 'Área / Metragem' },
  { key: 'descricaoItens', label: 'Descrição dos Itens' },
  { key: 'origemDestino', label: 'Origem / Destino' },
]

const statusOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'AGENDADO', label: 'Agendado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

function isAxiosError(error: unknown): error is { response: { status: number } } {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: unknown }).response
    if (
      typeof response === 'object' &&
      response !== null &&
      'status' in response &&
      typeof (response as { status?: unknown }).status === 'number'
    ) {
      return true
    }
  }
  return false
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

export default function PartnerPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [parceiroInativo, setParceiroInativo] = useState(false)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  )
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [modalOrcamentoAberto, setModalOrcamentoAberto] = useState(false)
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [precisaVisitaTecnica, setPrecisaVisitaTecnica] = useState(false)
  const [dataVisitaTecnica, setDataVisitaTecnica] = useState('')
  const [userName, setUserName] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const limit = useResponsiveLimit()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const decodedToken = jwtDecode<JwtPayload>(Cookies.get('token') || '')
  const parceiroId = parseInt(decodedToken.id)
  const { toast } = useToast()
  const [selectedStatus, setSelectedStatus] = useState('PENDENTE')

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('nome')
    logout()
    navigate('/')
  }

  useEffect(() => {
    carregarServicosPaginados(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedStatus, limit])

  const carregarServicosPaginados = async (page: number) => {
    try {
      setLoading(true)
      const token = Cookies.get('token')
      if (!token) return
      const decoded = jwtDecode<JwtPayload>(token)
      const tipoServicoId = decoded.tipoServicoId
      const response = await api.get(`/servicos/tipo-servico/${tipoServicoId}?page=${page}&limit=${limit}&statusList=${selectedStatus}`)
      const data = Array.isArray(response.data.servicos)
        ? response.data.servicos
        : Array.isArray(response.data)
        ? response.data
        : []
      setServicos(data)
      setTotalPages(response.data.totalPages || 1)
      setParceiroInativo(false)
    } catch (error: unknown) {
      console.error('Erro ao carregar serviços do parceiro:', error)
      if (isAxiosError(error) && error.response.status === 403) {
        setParceiroInativo(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const abrirModalDetalhes = (servico: Servico) => {
    setServicoSelecionado(servico)
    setModalDetalhesAberto(true)
  }

  const abrirModalOrcamento = (servico: Servico) => {
    setServicoSelecionado(servico)
    setValor('')
    setDescricao('')
    setPrecisaVisitaTecnica(false)
    setDataVisitaTecnica('')
    setModalOrcamentoAberto(true)
  }

  const enviarOrcamento = async () => {
    try {
      if (!servicoSelecionado) return

      const visitaTecnicaRealizada = servicoSelecionado.visitaTecnicaRealizada

      let dataVisita = null
      if (precisaVisitaTecnica && !visitaTecnicaRealizada) {
        const parsedDate = parse(dataVisitaTecnica, 'dd/MM/yyyy', new Date())
        if (!isValid(parsedDate)) {
          toast({ title: 'Data da visita técnica inválida.' })
          return
        }
        dataVisita = parsedDate.toISOString()
      }

      let valorNumero = null
      if (!precisaVisitaTecnica) {
        const valorLimpo = valor.replace(/[^\d,]/g, '').replace(',', '.')
        valorNumero = parseFloat(valorLimpo)
        if (isNaN(valorNumero)) {
          toast({ title: 'Valor do orçamento inválido.' })
          return
        }
      }

      const orcamentoExistente = servicoSelecionado?.orcamentos?.find(
        (orc) => orc.profissionalId === parceiroId,
      )

      // Montando o payload com o tipo 'any' para garantir que 'status' seja aceito
      const payload = {
        valor: valorNumero,
        descricao,
        servicoId: parseInt(servicoSelecionado.id),
        profissionalId: parceiroId,
        precisaVisitaTecnica,
        dataVisitaTecnica: dataVisita,
        visitaTecnicaRealizada,
      }

      if (orcamentoExistente) {
        await api.put(`/orcamentos/${orcamentoExistente.id}`, payload)
        toast({
          variant: 'default',
          title: 'Orçamento atualizado com sucesso!',
        })
      } else {
        await api.post('/orcamentos', payload)
        toast({ variant: 'default', title: 'Orçamento enviado com sucesso!' })
      }

      // Atualiza os serviços após enviar ou atualizar o orçamento
      await carregarServicosPaginados(page)
      setModalOrcamentoAberto(false)
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error)
      toast({ title: 'Erro ao enviar orçamento.' })
    }
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
          api.get(`/profissionais/${decoded.id}`).then(res => {
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

  // Cabeçalho fixo e mais informativo
  const Header = (
    <header className="sticky top-0 z-20 bg-white shadow flex items-center justify-between px-4 py-3 mb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-orange" />
        <span className="font-semibold text-lg text-gray-800">
          Bem-vindo ao portal AGILIZEI, {userName || 'Parceiro'}
        </span>
      </div>
      <Button
        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
        onClick={handleLogout}
        aria-label="Sair"
      >
        <LogOut className="w-5 h-5" /> Sair
      </Button>
    </header>
  )

  return (
    <>
      {Header}
      <div className="w-full max-w-[1440px] mx-auto bg-light-gray flex flex-col py-2 px-4 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 my-4">
          <h1 className="text-2xl font-bold">Serviços disponíveis</h1>
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

        {parceiroInativo ? (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded max-w-xl mx-auto text-center">
            Seu perfil está inativo. Aguarde a aprovação para visualizar os serviços disponíveis.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full justify-center">
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
                servicos.map((servico) => {
                  const desabilitarBotao =
                    servico.orcamentos.some(
                      (orc) =>
                        orc.status === 'AGUARDANDO_VISITA_TECNICA' ||
                        (orc.status === 'VISITA_TECNICA_CONFIRMADA' &&
                          orc.precisaVisitaTecnica === true),
                    ) ||
                    servico.orcamentos.some(
                      (orc) =>
                        orc.status === 'AGUARDANDO_ESCOLHA_ORCAMENTO' &&
                        !orc.precisaVisitaTecnica,
                    )

                  const temOrcamentoAgendadoOuRejeitado = servico.orcamentos.some(
                    (orc) =>
                      orc.status === 'APROVADO' || orc.status === 'REJEITADO',
                  )

                  const mostrarBotao = !temOrcamentoAgendadoOuRejeitado

                  return (
                    <Card
                      key={servico.id}
                      className="max-w-lg w-full mx-auto md:min-w-[450px] min-h-[100px] flex flex-col h-full shadow-lg border border-gray-200 bg-white transition hover:shadow-2xl rounded-xl"
                    >
                      <CardHeader className="flex items-center justify-between pb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {tipoServicoMap[Number(servico.tipoServicoId)]}
                          </CardTitle>
                        </div>
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMap[servico.status]?.style}`}
                        >
                          {statusMap[servico.status]?.label}
                        </Badge>
                      </CardHeader>

                      <CardContent className="flex flex-col flex-1 gap-2">
                        <CardDescription className="text-gray-600 mb-1">
                          {servico.descricao ||
                            servico.descricaoServicoPedreiro ||
                            servico.descricaoProblema ||
                            'Sem descrição'}
                        </CardDescription>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Agendado para:</span> {formatarData(servico.dataAgendada)}
                        </div>
                        {(servico.status === 'AGENDADO' || servico.status === 'CONCLUIDO') && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Cliente:</span> {servico.nome}
                          </div>
                        )}
                        <div className="flex gap-4 mt-auto">
                          <Button onClick={() => abrirModalDetalhes(servico)} className="flex-1 bg-orange text-white hover:bg-orange/80">
                            {servico.status === 'AGENDADO' && servico.profissionalId === parceiroId
                              ? 'Ver detalhes do serviço'
                              : 'Ver detalhes'}
                          </Button>
                          {mostrarBotao && (
                            <Button
                              onClick={() => abrirModalOrcamento(servico)}
                              disabled={desabilitarBotao}
                              className={`flex-1 ${desabilitarBotao ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                              title={desabilitarBotao ? 'Você já possui orçamento ou visita técnica pendente para este serviço.' : 'Enviar orçamento'}
                            >
                              {desabilitarBotao
                                ? 'Orçamento/visita pendente'
                                : 'Enviar orçamento'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
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
          </>
        )}

        {/* Modal de detalhes */}
        <Modal
          isVisible={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
        >
          {servicoSelecionado && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Detalhes do Serviço</h2>
                <Button variant="ghost" size="icon" onClick={() => setModalDetalhesAberto(false)} aria-label="Fechar">
                  X
                </Button>
              </div>
              {servicoSelecionado.foto && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/uploads/${servicoSelecionado.foto}`}
                  alt="Foto do Serviço"
                  className="w-full max-w-md rounded-md object-cover"
                />
              )}
              <p>
                <strong>Descrição:</strong>{' '}
                {servicoSelecionado.descricao ||
                  servicoSelecionado.descricaoServicoPedreiro ||
                  servicoSelecionado.descricaoProblema ||
                  'Sem descrição'}
              </p>
              <p>
                <strong>Data Agendada:</strong>{' '}
                {formatarData(servicoSelecionado.dataAgendada)}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {servicoSelecionado.status.replace(/_/g, ' ').toLowerCase()}
              </p>

              {/* Botão confirmar visita técnica se status aguarda confirmação */}
              {servicoSelecionado.orcamentos.some(
                (orc) =>
                  orc.status === 'VISITA_TECNICA_CONFIRMADA' &&
                  !orc.visitaTecnicaRealizada,
              ) && (
                <Button
                  onClick={async () => {
                    try {
                      const orcamentoParaConfirmar =
                        servicoSelecionado.orcamentos.find(
                          (orc) =>
                            orc.status === 'VISITA_TECNICA_CONFIRMADA' &&
                            !orc.visitaTecnicaRealizada,
                        )

                      await api.put(
                        `/servicos/${servicoSelecionado.id}/confirmar-visita-parceiro`,
                        { orcamentoId: orcamentoParaConfirmar?.id },
                      )
                      toast({
                        title: 'Visita técnica confirmada com sucesso!',
                        variant: 'default',
                      })

                      // Atualiza estado do serviço no modal e lista
                      const response = await api.get(
                        `/servicos/${servicoSelecionado.id}`,
                      )
                      setServicoSelecionado(response.data)
                      carregarServicosPaginados(page)
                    } catch {
                      toast({
                        title: 'Erro ao confirmar visita técnica.',
                        variant: 'destructive',
                      })
                    }
                  }}
                  className="bg-green-600 text-white hover:bg-green-700 mt-2"
                >
                  Confirmar visita técnica realizada
                </Button>
              )}

              {/* Dados do cliente se status agendado */}
              {servicoSelecionado.status === 'AGENDADO' ||
              servicoSelecionado.orcamentos.some(
                (orc) => orc.status === 'VISITA_TECNICA_CONFIRMADA',
              ) ? (
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Cliente:</strong> {servicoSelecionado.nome}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {servicoSelecionado.telefone}
                  </p>
                  <p>
                    <strong>Endereço:</strong>{' '}
                    {`${servicoSelecionado.logradouro}, ${servicoSelecionado.numero}, ${servicoSelecionado.bairro}, ${servicoSelecionado.cidade} - ${servicoSelecionado.estado}`}
                  </p>
                </div>
              ) : null}

              {/* Exibe detalhes extras */}
              <div className="mt-4 space-y-1">
                {detalhesExtras.map(({ key, label }) => {
                  const valor = servicoSelecionado
                    ? servicoSelecionado[key as keyof typeof servicoSelecionado]
                    : null
                  if (
                    valor === undefined ||
                    valor === null ||
                    (Array.isArray(valor) && valor.length === 0) ||
                    typeof valor === 'object'
                  ) {
                    return null
                  }
                  return (
                    <p key={key}>
                      <strong>{label}:</strong> {valor}
                    </p>
                  )
                })}
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de orçamento */}
        <Modal
          isVisible={modalOrcamentoAberto}
          onClose={() => setModalOrcamentoAberto(false)}
        >
          {servicoSelecionado && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Enviar orçamento</h2>
                <Button variant="ghost" size="icon" onClick={() => setModalOrcamentoAberto(false)} aria-label="Fechar">
                  X
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visitaTecnica"
                  checked={precisaVisitaTecnica}
                  onChange={(e) => setPrecisaVisitaTecnica(e.target.checked)}
                  className="accent-orange"
                />
                <label htmlFor="visitaTecnica" className="ml-1 text-sm">
                  Precisa de visita técnica?
                </label>
              </div>

              {/* Mostrar input de data da visita se marcada */}
              {precisaVisitaTecnica &&
                !servicoSelecionado?.visitaTecnicaRealizada && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="dataVisita" className="text-sm font-medium">Selecione a data da visita técnica</label>
                    <DayPicker
                      value={dataVisitaTecnica}
                      onChange={setDataVisitaTecnica}
                    />
                  </div>
                )}

              {/* Mostrar input de valor somente se NÃO precisa visita técnica */}
              {!precisaVisitaTecnica && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="valorOrcamento" className="text-sm font-medium">Valor (R$)</label>
                  <IMaskInput
                    mask={Number}
                    scale={2}
                    thousandsSeparator="."
                    padFractionalZeros={true}
                    normalizeZeros={true}
                    radix="," 
                    mapToRadix={['.']}
                    placeholder="Informe o valor do orçamento"
                    className="w-full border border-orange rounded px-3 py-2"
                    value={valor}
                    onAccept={(value) => setValor(value)}
                    id="valorOrcamento"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label htmlFor="descricaoOrcamento" className="text-sm font-medium">Descrição</label>
                <textarea
                  id="descricaoOrcamento"
                  placeholder="Descreva o serviço, condições, etc."
                  className="w-full border border-orange rounded px-3 py-2"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  if (precisaVisitaTecnica && !dataVisitaTecnica) {
                    toast({
                      title:
                        'Por favor, informe a data da visita técnica antes de enviar o orçamento.',
                    })
                    return
                  }
                  if (!precisaVisitaTecnica && !valor) {
                    toast({
                      title: 'Por favor, informe o valor do orçamento.',
                    })
                    return
                  }
                  enviarOrcamento()
                  toast({
                    variant: 'default',
                    title: 'Orçamento enviado com sucesso!',
                  })
                }}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {servicoSelecionado &&
                  ((servicoSelecionado.orcamentos || []).some(
                    (orc) =>
                      orc.status === 'AGUARDANDO_ESCOLHA_ORCAMENTO' ||
                      servicoSelecionado.visitaTecnicaRealizada === false,
                  )
                    ? 'Orçamento ou visita técnica pendente'
                    : 'Enviar orçamento')}
              </Button>
            </div>
          )}
        </Modal>
      </div>

      <Footer />
    </>
  )
}
