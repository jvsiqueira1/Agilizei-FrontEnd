import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { motion } from 'framer-motion'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import Modal from '../Modal'
import { Input } from '../ui/input'

interface TipoServico {
  id: number
  nome: string
  descricao: string
  active: boolean
}

export default function AdminServicesType() {
  const [tiposServico, setTiposServico] = useState<TipoServico[]>([])
  const [tiposServicoModal, setTiposServicoModal] = useState(false)
  const [editarTiposServicoModal, setEditarTiposServicoModal] = useState(false)

  const [selectedTipoServico, setSelectedTipoServico] =
    useState<TipoServico | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editDescricao, setEditDescricao] = useState('')

  useEffect(() => {
    fetchTipoServico()
  }, [])

  const fetchTipoServico = async () => {
    try {
      const { data } = await api.get('/tipos-servico')
      setTiposServico(data.data)
    } catch (error) {
      console.error('Erro ao buscar parceiros: ', error)
    }
  }

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/tipos-servico/${id}`, {
        active: !currentStatus,
      })
      fetchTipoServico()
    } catch (error) {
      console.error('Erro ao atualizar status: ', error)
    }
  }

  const handleAddService = async () => {
    try {
      api.post('/tipos-servico')
      setTiposServicoModal(false)
      fetchTipoServico()
    } catch (error) {
      console.error(error)
    }
  }

  const openEditModal = (tipo: TipoServico) => {
    setSelectedTipoServico(tipo)
    setEditNome(tipo.nome)
    setEditDescricao(tipo.descricao)
    setEditarTiposServicoModal(true)
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTipoServico) return
    try {
      await api.put(`tipos-servico/${selectedTipoServico.id}`, {
        nome: editNome,
        descricao: editDescricao,
      })
      setEditarTiposServicoModal(false)
      setSelectedTipoServico(null)
      fetchTipoServico()
    } catch (error) {
      console.error('Erro ao editar serviço: ', error)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedTipoServico?.id) {
      console.error('ID inválido para exclusão')
      return
    }
    try {
      await api.delete(`/tipos-servico/${selectedTipoServico.id}`)
      setEditarTiposServicoModal(false)
      setSelectedTipoServico(null)
      fetchTipoServico()
    } catch (error) {
      console.error('Erro ao deletar serviço: ', error)
    }
  }

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {tiposServico.map((tipoServico) => (
        <motion.div
          key={tipoServico.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold mb-1">
            Tipo de serviço: {tipoServico.nome}
          </h2>

          <div className="text-sm space-y-1">
            <p>
              <strong>Descrição do Serviço:</strong> {tipoServico.descricao}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {tipoServico.active ? 'Ativo' : 'Inativo'}
            </p>
            <div className="flex justify-between">
              <Switch
                checked={tipoServico.active}
                onCheckedChange={() =>
                  handleStatusChange(tipoServico.id, tipoServico.active)
                }
              />
              <Button
                variant="ghost"
                className="hover:text-orange"
                onClick={() => openEditModal(tipoServico)}
              >
                Editar
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex justify-center items-center"
      >
        <Button
          onClick={() => setTiposServicoModal(true)}
          variant="outline"
          className="hover:text-orange border-none bg-white"
        >
          Adicionar Serviço
        </Button>
      </motion.div>

      <Modal
        isVisible={tiposServicoModal}
        onClose={() => setTiposServicoModal(false)}
      >
        <form action={handleAddService}>
          <h2 className="mb-4 text-center font-bold">Adicionar novo serviço</h2>
          <div className="grid grid-flow-row gap-4">
            <Input placeholder="Nome do serviço" />
            <Input placeholder="Descrição do serviço" />
            <Button type="submit">Adicionar novo serviço</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isVisible={editarTiposServicoModal}
        onClose={() => setEditarTiposServicoModal(false)}
      >
        <form onSubmit={handleEditService}>
          <h2 className="mb-4 text-center font-bold">Editar tipo de serviço</h2>
          <div className="grid grid-flow-row gap-4">
            <Input
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              placeholder="Nome do serviço"
            />
            <Input
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
              placeholder="Descrição do serviço"
            />
            <div className="flex justify-between">
              <Button type="submit">Salvar</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  console.log(
                    'Deletando o serviço com ID: ',
                    selectedTipoServico?.id,
                  )
                  handleDeleteService()
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
