import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { format } from 'date-fns'

interface ContatoOutrosServicos {
  id: number
  telefone: string
  tipoServico: string
  descricao: string
  createdAt: string
}

export default function OutrosServicosPage() {
  const [contatos, setContatos] = useState<ContatoOutrosServicos[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const { data } = await api.get('/outros-servicos')
        if (data.success && Array.isArray(data.data)) {
          setContatos(data.data)
        } else {
          setErro('Dados inválidos recebidos.')
        }
      } catch (err) {
        console.error('Erro ao buscar contatos:', err)
        setErro('Erro ao carregar os contatos.')
      } finally {
        setLoading(false)
      }
    }

    fetchContatos()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Outros Serviços</h1>

      {loading && <p>Carregando...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!loading && !erro && contatos.length === 0 && (
        <p>Nenhum contato registrado ainda.</p>
      )}

      {!loading && !erro && contatos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Telefone</th>
                <th className="p-2 border-b">Tipo de Serviço</th>
                <th className="p-2 border-b">Descrição</th>
                <th className="p-2 border-b">Data</th>
              </tr>
            </thead>
            <tbody>
              {contatos.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <a
                      href={`https://wa.me/${item.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline hover:text-green-800"
                  >
                      {item.telefone}
                  </a>
                  </td>
                  <td className="p-2">{item.tipoServico}</td>
                  <td className="p-2 whitespace-pre-wrap max-w-xs">{item.descricao}</td>
                  <td className="p-2">
                    {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
