import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import { useToast } from '@/components/hooks/use-toast'

export default function AdminLogin({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/admin/login', { email, senha })
      console.log(data.token)

      if (data.sucesso && data.token) {
        Cookies.set('token', data.token, {
          expires: 1,
          secure: true,
          httpOnly: true,
        })

        login('admin', data.token)
        toast({
          variant: 'default',
          title: 'Login realizado com sucesso!',
        })
        onClose()
        navigate('/admin/parceiros')
      } else {
        toast({
          title: 'Email ou senha inválidos!',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao realizar login. Tente novamente.',
      })
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

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  )
}
