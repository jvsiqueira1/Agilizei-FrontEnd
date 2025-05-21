import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { api } from '@/services/api'
import Cookies from 'js-cookie'

interface AdminFormData {
  nome: string
  email: string
  senha: string
}

export default function AdminCreate() {
  const [loading, setLoading] = useState(false)
  const form = useForm<AdminFormData>({
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
    },
  })

  const onSubmit = async (data: AdminFormData) => {
    try {
      setLoading(true)
      const response = await api.post('/admin', data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Admin criado com sucesso:', response.data)
      alert('Admin criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar admin:', error)
      alert('Erro ao criar admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        Cadastrar Novo Admin
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome"
                    {...field}
                    className="border-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="border-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...field}
                    className="border-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-opacity-70"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
