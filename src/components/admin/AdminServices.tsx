import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Servico } from '@/types'

const serviceTypeMap: Record<number, string> = {
  1: 'Faxineira',
  2: 'Eletricista',
  3: 'Pintor',
  4: 'Montador de Móveis',
  5: 'Jardineiro',
  6: 'Freteiro',
  7: 'Pedreiro',
}

export default function AdminServices() {
  const [servicos, setServicos] = useState<Servico[]>([])

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await api.get('/servicos')
        const lista = Array.isArray(response.data?.data)
          ? response.data.data
          : response.data
        const ativos = lista.filter(
          (s: Servico) => s.status?.toLowerCase() !== 'finalizado',
        )
        setServicos(ativos)
      } catch (error) {
        console.error('Erro ao buscar serviços:', error)
      }
    }

    fetchServicos()
  }, [])

  const getStatusBadge = (servico: Servico) => {
    if (servico.profissional)
      return <Badge variant="default">Em andamento</Badge>

    switch (servico.status?.toLowerCase()) {
      case 'aguardando_profissional':
        return <Badge variant="secondary">Aguardando profissional</Badge>
      case 'aguardando_orcamento':
        return <Badge variant="outline">Aguardando orçamento</Badge>
      case 'aguardando_aprovacao':
        return <Badge variant="destructive">Aguardando aprovação</Badge>
      default:
        return <Badge variant="outline">Status indefinido</Badge>
    }
  }

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {servicos.map((servico) => (
        <motion.div
          key={servico.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold mb-1">
            Tipo de serviço: {serviceTypeMap[servico.tipoServicoId]}
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
            <div className="mt-2">{getStatusBadge(servico)}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
