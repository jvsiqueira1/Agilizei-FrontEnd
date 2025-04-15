import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminLogin({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (email === 'admin' && senha === 'admin') {
      login('admin')
      onClose()
      navigate('/admin/funcionarios')
    } else {
      setErro('Email ou senha inválidos')
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-8 max-w-sm w-full"
      >
        <h2 className="text-xl font-semibold mb-6 text-center">
          Login do Administrador
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="text"
            placeholder="admin@agilizei.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Senha</label>
          <Input
            type="password"
            placeholder="******"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && (
          <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>
        )}

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  )
}
