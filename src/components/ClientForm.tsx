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
import { ClientFormData } from '@/types'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import SpecificFields from './SpecificFields'
import { IMaskInput } from 'react-imask'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/useAuth'
import Cookies from 'js-cookie'
import { InputOTPGroup } from './ui/input-otp'
import { InputOTPSlot } from './ui/input-otp'
import { InputOTP } from './ui/input-otp'
import { Modal } from '.'
import { clientService } from '@/services/client'
import { criarServico } from '@/services/servico'
import { useNavigate } from 'react-router'

interface Props {
  telefone?: string
  onClose: () => void
}

export default function ClientForm({ telefone, onClose }: Props) {
  const [openBudgetModal, setBudgetModal] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')

  const verificarCodigo = async () => {
    const telefoneLimpo = phone.replace(/\D/g, '')
    console.log('verificar codigo ' + telefoneLimpo)

    try {
      const { data } = await api.post('/auth/verificar-otp', {
        telefone: telefoneLimpo,
        codigo,
      })
      console.log('Verificar OTP', { data })
      if (data.sucesso && data.token && data.usuario) {
        Cookies.set('token', data.token, { expires: 1 })
        login('client', data.token)
        setMensagem('Login realizado com sucesso!')

        // Após o login bem-sucedido, cria o serviço
        try {
          const formData = form.getValues()
          await criarServico(formData)
          setMensagem('Serviço criado com sucesso!')

          // Fecha o modal após um breve delay
          setTimeout(() => {
            navigate('/cliente')
            onClose()
          }, 1500)
        } catch (error) {
          console.error('Erro ao criar serviço:', error)
          setMensagem('Erro ao criar serviço. Por favor, tente novamente.')
        }
      } else {
        setMensagem(data.erro || 'Código incorreto.')
      }
    } catch (error) {
      console.error(error)
      setMensagem('Erro ao verificar código.')
    }
  }

  const [servicoSlecionado, setServicoSelecionado] = useState('')

  const form = useForm<ClientFormData>({
    defaultValues: {
      telefone: '',
      servico: '',
      nome: '',
      email: '',
      cep: '',
      logradouro: '',
      dataAgendada: '',
      complemento: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      descricao: '',
      foto: null,
      tamanhoImovel: '',
      tipoLimpeza: '',
      frequencia: '',
      horario: '',
      extras: '',

      tipoImovel: '',
      superficie: '',
      condicao: '',
      prazo: '',

      tipoServicoEletrico: '',
      descricaoProblema: '',

      descricaoMoveis: '',
      quantidadeMoveis: 0,

      descricaoServicoPedreiro: '',
      areaMetragem: '',

      descricaoItens: '',
      origemDestino: '',
    },
  })

  const servicosComDescricaoEspecifica = ['Eletricista', 'Pedreiro']

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Limpa o telefone para remover caracteres especiais
      const telefoneLimpo = data.telefone.replace(/\D/g, '')
      setPhone(telefoneLimpo)
      // Verifica se o cliente já existe
      const clienteExistente =
        await clientService.verificarCliente(telefoneLimpo)

      if (clienteExistente) {
        // Se o cliente existe, apenas envia o OTP
        const resultado = await api.post('/auth/enviar-otp', {
          telefone: telefoneLimpo,
          tipo: 'cliente',
        })

        if (resultado) {
          setBudgetModal(true)
          setMensagem('Código enviado para seu WhatsApp')
        } else {
          setMensagem(resultado || 'Erro ao enviar código')
        }
      } else {
        // Se o cliente não existe, cria o cliente e envia o OTP
        const novoCliente = await clientService.criarCliente({
          telefone: telefoneLimpo,
          nome: data.nome,
          email: data.email,
          enderecos: {
            create: {
              cep: data.cep,
              rua: data.logradouro,
              numero: data.numero,
              complemento: data.complemento,
              bairro: data.bairro,
              cidade: data.cidade,
              estado: data.estado,
            },
          },
        })

        if (novoCliente) {
          const resultado = await api.post('/auth/enviar-otp', {
            telefone: telefoneLimpo,
            tipo: 'cliente',
          })

          if (resultado) {
            setBudgetModal(true)
            setMensagem('Código enviado para seu WhatsApp')
          } else {
            setMensagem(resultado || 'Erro ao enviar código')
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar formulário:', error)
      setMensagem('Ocorreu um erro ao processar sua solicitação')
    }
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src="agilizeiLogo.svg"
        alt="Agilizei Logo"
        className="mb-4 w-28 h-28"
      />
      <Modal isVisible={openBudgetModal} onClose={() => setBudgetModal(false)}>
        <label htmlFor="otp" className="text-sm font-medium">
          Digite o código recebido
        </label>
        <InputOTP
          maxLength={6}
          value={codigo}
          onChange={(val) => setCodigo(val)}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {mensagem && (
          <p className="text-sm text-muted-foreground text-center">
            {mensagem}
          </p>
        )}
        <Button onClick={verificarCodigo} className="w-full mt-2">
          Verificar código
        </Button>
      </Modal>

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
                    {!telefone ? (
                      <IMaskInput
                        {...field}
                        mask="(00) 00000-0000"
                        placeholder="(27) 98876-5432"
                        className="flex h-10 w-full rounded-md border border-orange bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'"
                        onAccept={(value: string) => field.onChange(value)}
                      />
                    ) : (
                      <IMaskInput
                        {...field}
                        mask="(00) 00000-0000"
                        placeholder="(27) 98876-5432"
                        className="flex h-10 w-full rounded-md border border-orange bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'"
                        onAccept={(value: string) => field.onChange(value)}
                        value={telefone || ''}
                      />
                    )}
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
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask="000.000.000-00"
                      placeholder="000.000.000-00"
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

            <FormField
              control={form.control}
              name="dataAgendada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Agendada</FormLabel>
                  <FormControl>
                    <Input placeholder="Data Agendada" {...field} />
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
