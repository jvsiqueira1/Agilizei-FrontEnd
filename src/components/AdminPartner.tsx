import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'

interface Parceiro {
  id: number
  nome: string
  email: string
  telefone: string
  active: boolean
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

export default function AdminPartner() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([])

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const { data } = await api.get('/profissionais')
        setParceiros(data.data)
      } catch (error) {
        console.error('Erro ao buscar parceiros: ', error)
      }
    }

    fetchParceiros()
  }, [])

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
  return (
    <Table>
      <TableCaption>Lista de Parceiros Agilizei.</TableCaption>
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
            <TableCell>{parceiro.nome}</TableCell>
            <TableCell>{parceiro.email}</TableCell>
            <TableCell>{formatTelefone(parceiro.telefone)}</TableCell>
            <TableCell>{parceiro.active ? 'Ativo' : 'Inativo'}</TableCell>
            <TableCell>
              <Switch
                checked={parceiro.active}
                onCheckedChange={() =>
                  handleStatusChange(parceiro.id, parceiro.active)
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total de Parceiros</TableCell>
          <TableCell className="text-right">{parceiros.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
