import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { Footer, Modal, ClientForm } from '@/components'
import Cookies from 'js-cookie'
import { formatarData } from '@/lib/formatData'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/useAuth'
import { useToast } from '../components/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

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

export default function ClientServicesPage() {
  const [abaAtiva, setAbaAtiva] = useState<'em_andamento' | 'finalizado'>(
    'em_andamento',
  )
  const [modalAberto, setModalAberto] = useState(false)
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  )
  const [servicos, setServicos] = useState<Servico[]>([])
  const [telefoneLogado, setTelefoneLogado] = useState<string>('')

  const navigate = useNavigate()
  const { logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    Cookies.remove('token')
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
      const response = await api.get(`/servicos/cliente/${decoded.id}`)
      setTelefoneLogado(decoded.telefone)
      setServicos(response.data)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    }
  }

  const cancelarServico = async (servicoId: string) => {
    try {
      await api.put(`/servicos/${servicoId}`, { status: 'CANCELADO' })
      toast({ variant: 'default', title: 'Serviço cancelado com sucesso!' })
      carregarServicos()
    } catch (error) {
      toast({ title: 'Erro ao cancelar o serviço.' })
      console.error(error)
    }
  }

  const servicosFiltrados = servicos.filter((s) =>
    abaAtiva === 'em_andamento'
      ? s.status !== 'CONCLUIDO' && s.status !== 'CANCELADO'
      : s.status === 'CONCLUIDO' || s.status === 'CANCELADO',
  )

  const abrirModal = (servico: Servico) => {
    setServicoSelecionado(servico)
    setModalAberto(true)
  }

  return (
    <>
      <header className="flex justify-center py-5">
        <h1 className="text-orange text-4xl font-bold">
          Bem vindo ao perfil do cliente Agilizei
        </h1>
      </header>

      <div className="w-full max-w-[1440px] mx-auto bg-light-gray flex flex-col py-2 px-4 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold my-4">Meus serviços</h1>
          <div className="flex gap-4">
            <Button onClick={() => setModalCadastroAberto(true)}>
              Novo Serviço
            </Button>
            <Button onClick={handleLogout}>
              <ArrowLeft /> Sair
            </Button>
          </div>
        </div>

        <Tabs
          value={abaAtiva}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(v) => setAbaAtiva(v as any)}
          className="mb-6"
        >
          <TabsList className="flex gap-2">
            <TabsTrigger value="em_andamento">Em andamento</TabsTrigger>
            <TabsTrigger value="finalizado">Finalizado</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-flow-row justify-start md:grid-cols-3 gap-6 w-full">
          {servicosFiltrados.map((servico) => (
            <Card key={servico.id} className="w-full max-w-[500px] mx-auto">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>
                  {servico.descricao ||
                    servico.descricaoProblema ||
                    servico.descricaoServicoPedreiro ||
                    'Sem descrição'}
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
              <CardContent className="space-y-1 pb-2">
                <p className="text-sm text-gray-600">
                  Tipo de serviço: {tipoServicoMap[servico.tipoServicoId]}
                </p>
                <p className="text-sm text-gray-400">
                  Agendado para: {formatarData(servico.dataAgendada)}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => abrirModal(servico)}>
                    Ver detalhes
                  </Button>
                  {servico.status !== 'AGENDADO' &&
                    servico.status !== 'CANCELADO' && (
                      <Button
                        variant="destructive"
                        onClick={() => cancelarServico(servico.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

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
                        {servicoSelecionado.descricao || 'Sem descrição'}
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
                                      carregarServicos()
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
                                        carregarServicos()
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
          onClose={() => setModalCadastroAberto(false)}
        >
          <ClientForm
            telefone={telefoneLogado}
            onClose={() => {
              setModalCadastroAberto(false)
              carregarServicos()
            }}
          />
        </Modal>
      </div>

      <Footer />
    </>
  )
}
