import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { Footer, Modal, LoginHeader } from '@/components'
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
  const navigate = useNavigate()
  const { logout } = useAuth()
  const decodedToken = jwtDecode<JwtPayload>(Cookies.get('token') || '')
  const parceiroId = parseInt(decodedToken.id)
  const { toast } = useToast()

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('nome')
    logout()
    navigate('/')
  }

  useEffect(() => {
    carregarServicos()
  }, [])

  const carregarServicos = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) return
      const decoded = jwtDecode<JwtPayload>(token)
      const tipoServicoId = decoded.tipoServicoId

      const response = await api.get(`/servicos/tipo-servico/${tipoServicoId}`)
      setServicos(response.data)
      setParceiroInativo(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro ao carregar serviços do parceiro:', error)
      if (error.response?.status === 403) {
        setParceiroInativo(true)
      }
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
      await carregarServicos()
      setModalOrcamentoAberto(false)
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error)
      toast({ title: 'Erro ao enviar orçamento.' })
    }
  }

  useEffect(() => {
    const nomeCookie = Cookies.get('nome')
    if (nomeCookie) setUserName(nomeCookie)
  }, [])

  return (
    <>
      <LoginHeader nome={userName} isCliente={false} onLogout={handleLogout} />
      <div className="w-full max-w-[1440px] mx-auto bg-light-gray flex flex-col py-2 px-4 min-h-screen">
        <h1 className="text-2xl font-bold my-4">Serviços disponíveis</h1>

        {parceiroInativo ? (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded max-w-xl mx-auto text-center">
            Seu perfil está inativo. Aguarde a aprovação para visualizar os
            serviços disponíveis.
          </div>
        ) : (
          <div className="grid grid-flow-row md:grid-flow-col md:justify-start justify-center gap-6 w-full">
            {servicos.map((servico) => {
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
                  className="max-w-lg w-full mx-auto md:min-w-[450px] min-h-[100px]"
                >
                  <CardHeader className="flex items-center justify-between pb-2">
                    <CardTitle className="text-lg">
                      {tipoServicoMap[Number(servico.tipoServicoId)]}
                    </CardTitle>
                    <Badge
                      className={`${statusMap[servico.status]?.style} min-w-[120px] w-[120px] flex justify-center items-center text-center px-3 py-1`}
                    >
                      {servico.status
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <CardDescription className="text-gray-600">
                      {servico.descricao ||
                        servico.descricaoServicoPedreiro ||
                        servico.descricaoProblema ||
                        'Sem descrição'}
                    </CardDescription>
                    <p className="text-sm text-gray-500">
                      Agendado para: {formatarData(servico.dataAgendada)}
                    </p>

                    <div className="flex gap-4 mt-4">
                      <Button onClick={() => abrirModalDetalhes(servico)}>
                        {servico.status === 'AGENDADO' &&
                        servico.profissionalId === parceiroId
                          ? 'Ver detalhes do serviço'
                          : 'Ver detalhes'}
                      </Button>

                      {mostrarBotao && (
                        <Button
                          onClick={() => abrirModalOrcamento(servico)}
                          disabled={desabilitarBotao}
                          className={`text-white ${desabilitarBotao ? ' cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {desabilitarBotao
                            ? 'Orçamento pendente ou visita técnica pendente'
                            : 'Enviar orçamento'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Modal de detalhes */}
        <Modal
          isVisible={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
        >
          {servicoSelecionado && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Detalhes do Serviço</h2>
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
                      carregarServicos()
                    } catch {
                      toast({
                        title: 'Erro ao confirmar visita técnica.',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  Confirmar visita técnica realizada
                </Button>
              )}

              {/* Dados do cliente se status agendado */}
              {servicoSelecionado.status === 'AGENDADO' ||
              servicoSelecionado.orcamentos.some(
                (orc) => orc.status === 'VISITA_TECNICA_CONFIRMADA',
              ) ? (
                <>
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
                </>
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
              <h2 className="text-xl font-semibold">Enviar orçamento</h2>

              <div
                className="flex items-center gap-2"
                style={{
                  display: (servicoSelecionado?.orcamentos || []).some(
                    (orc) => orc.status === 'VISITA_TECNICA_REALIZADA',
                  )
                    ? 'none' // Esconde completamente a div quando o status for "AGUARDANDO_ENVIO_ORCAMENTO"
                    : 'block', // Exibe normalmente quando o status não for "AGUARDANDO_ENVIO_ORCAMENTO"
                }}
              >
                <input
                  type="checkbox"
                  id="visitaTecnica"
                  checked={precisaVisitaTecnica}
                  onChange={(e) => setPrecisaVisitaTecnica(e.target.checked)}
                />
                <label htmlFor="visitaTecnica" className="ml-1">
                  Precisa de visita técnica?
                </label>
              </div>

              {/* Mostrar input de data da visita se marcada */}
              {precisaVisitaTecnica &&
                !servicoSelecionado?.visitaTecnicaRealizada && (
                  <>
                    <p>Selecione a data da visita técnica</p>
                    <DayPicker
                      value={dataVisitaTecnica}
                      onChange={setDataVisitaTecnica}
                    />
                  </>
                )}

              {/* Mostrar input de valor somente se NÃO precisa visita técnica */}
              {!precisaVisitaTecnica && (
                <IMaskInput
                  mask={Number}
                  scale={2}
                  thousandsSeparator="."
                  padFractionalZeros={true}
                  normalizeZeros={true}
                  radix=","
                  mapToRadix={['.']}
                  placeholder="Valor (R$)"
                  className="w-full border border-orange rounded px-3 py-2"
                  value={valor}
                  onAccept={(value) => setValor(value)}
                />
              )}

              <textarea
                placeholder="Descrição"
                className="w-full border border-orange rounded px-3 py-2"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

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
                className="w-full"
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
