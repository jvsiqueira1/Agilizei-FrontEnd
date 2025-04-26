import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { criarServico } from '@/services/servico'
import { ClientFormData } from '@/types'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import SpecificFields from './SpecificFields'
import { IMaskInput } from 'react-imask'

export default function ClientForm({ telefone }: { telefone?: string }) {
  const [servicoSlecionado, setServicoSelecionado] = useState('')

  const form = useForm<ClientFormData>({
    defaultValues: {
      telefone: '',
      servico: '',
      nome: '',
      email: '',
      cep: '',
      logradouro: '',
      endereco: '',
      complemento: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      descricao: '',
      foto: null,
    },
  })

  const servicosComDescricaoEspecifica = ['Eletricista', 'Pedreiro']

  const onSubmit = async (data: ClientFormData) => {
    try {
      const clienteCriado = await criarServico(data)
      console.log('Cliente criado com sucesso ', clienteCriado)

      const serviceData = { ...data, clienteId: clienteCriado.id }
      const resultado = await criarServico(serviceData)
      console.log('Serviço criado com sucesso!', resultado)
    } catch (error) {
      console.error('Erro ao enviar serviço: ', error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src="agilizeiLogo.svg"
        alt="Agilizei Logo"
        className="mb-4 w-28 h-28"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask="(00) 00000-0000"
                      placeholder="(27) 98876-5432"
                      className="flex h-10 w-full rounded-md border border-orange bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'"
                      onAccept={(value: string) => field.onChange(value)}
                      value={telefone || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servico"
              render={() => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('servico', value)
                        setServicoSelecionado(value)
                      }}
                      value={form.getValues('servico') || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Faxineira">Faxineira</SelectItem>
                        <SelectItem value="Eletricista">Eletricista</SelectItem>
                        <SelectItem value="Pintor">Pintor</SelectItem>
                        <SelectItem value="Montador de Móveis">
                          Montador de Móveis
                        </SelectItem>
                        <SelectItem value="Jardineiro">Jardineiro</SelectItem>
                        <SelectItem value="Pedreiro">Pedreiro</SelectItem>
                        <SelectItem value="Freteiro">Freteiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
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
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cep</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask="00000-000"
                      placeholder="29900-240"
                      className="flex h-10 w-full rounded-md border border-orange bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'"
                      onAccept={(value: string) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua / Avenida" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormDescription className="mb-4">
            * Seu endereço será compartilhado apenas com um dos nossos parceiros
            após a sua confirmação do serviço.
          </FormDescription>

          <SpecificFields servico={servicoSlecionado} control={form.control} />

          {!servicosComDescricaoEspecifica.includes(servicoSlecionado) && (
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do serviço</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informe a descrição do serviço"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div>
            <Controller
              control={form.control}
              name="foto"
              render={({ field: { onChange, ref } }) => (
                <FormItem>
                  <FormLabel>Anexar Foto</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/png, image/jpg"
                      className="block w-full text-sm text-gray-500
                    file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300
                    file:bg-gray-50 file:text-gray-700 file:cursor-pointer"
                      onChange={(e) => onChange(e.target.files)}
                      ref={ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 justify-center">
            <Button type="submit">Enviar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
