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
import { clientSchema, ClientFormData } from '@/schemas/clientSchema'
import { Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
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
import { jwtDecode } from 'jwt-decode'
import { getCep, Endereco } from '@/services/cepService'
import { validaCpf } from '@/lib/validations'
import { useToast } from '@/components/hooks/use-toast'
import { DayPicker } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'

interface TipoServico {
  id: number
  nome: string
  descricao: string
  active: boolean
}

interface Props {
  telefone?: string
  onClose: () => void
  selectedServico?: string
  onStartLoading?: () => void
  onStopLoading?: () => void
}

interface Cliente {
  nome: string
  cpf: string
  email: string
}

export default function ClientForm({
  telefone,
  onClose,
  selectedServico,
  onStartLoading,
  onStopLoading,
}: Props) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      telefone: '',
      servico: selectedServico || '',
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
      quantidadeMoveis: undefined,

      descricaoServicoPedreiro: '',
      areaMetragem: '',

      descricaoItens: '',
      origemDestino: '',
    },
  })

  const { toast } = useToast()
  const [openBudgetModal, setBudgetModal] = useState(false)
  const [codigo, setCodigo] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [tiposServico, setTiposServico] = useState<TipoServico[]>([])
  const [userData, setUserData] = useState<Cliente>({
    nome: '',
    cpf: '',
    email: '',
  })
  const [cep, setCep] = useState('')
  const servicosComDescricaoEspecifica = ['Eletricista', 'Pedreiro']

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token')
        if (token) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const decoded: any = jwtDecode(token)
          const userId = decoded.id
          const { data } = await api.get(`/clientes/${userId}`)
          setUserData({
            nome: data.data.nome,
            cpf: data.data.cpf,
            email: data.data.email,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar dados do cliente', error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (userData.nome) form.setValue('nome', userData.nome)
    if (userData.email) form.setValue('email', userData.email)
    if (userData.cpf) form.setValue('cpf', userData.cpf)
  }, [userData, form])

  useEffect(() => {
    if (cep.length === 8) {
      getCep(cep)
        .then((address: Endereco) => {
          form.setValue('logradouro', address.logradouro)
          form.setValue('bairro', address.bairro)
          form.setValue('cidade', address.cidade)
          form.setValue('estado', address.estado)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          toast({ title: error.message })
        })
    }
  }, [cep, form, toast])

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const { data } = await api.get('/tipos-servico')
        if (Array.isArray(data.data)) {
          // Filtro para mostrar apenas os tipos de serviço ativos
          setTiposServico(
            data.data.filter((tipo: { active: boolean }) => tipo.active),
          )
        }
      } catch (error) {
        console.error('Erro ao carregar tipos de serviço', error)
      }
    }

    fetchTipos()
  }, [])

  const verificarCodigo = async () => {
    const telefoneLimpo = phone.replace(/\D/g, '')
    try {
      const { data } = await api.post('/auth/verificar-otp', {
        telefone: telefoneLimpo,
        codigo,
      })
      if (data.sucesso && data.token && data.usuario) {
        Cookies.set('token', data.token, { expires: 1 })
        login('client', data.token)
        toast({
          variant: 'default',
          title: 'Login realizado com sucesso!',
        })

        // Após o login bem-sucedido, cria o serviço
        try {
          const formData = form.getValues()
          await criarServico(formData)
          toast({
            variant: 'default',
            title: 'Serviço criado com sucesso!',
          })

          // Fecha o modal após um breve delay
          setTimeout(() => {
            navigate('/cliente')
            onClose()
          }, 1500)
        } catch (error) {
          console.error('Erro ao criar serviço:', error)
          toast({
            title: 'Erro ao criar serviço. Por favor, tente novamente.',
          })
        }
      } else {
        toast({
          title: data.erro || 'Código incorreto.',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao verificar código.',
      })
    }
  }

  useEffect(() => {
    if (selectedServico) {
      form.setValue('servico', selectedServico)
    }
  }, [selectedServico, form])

  const prepareFormData = (data: ClientFormData): FormData | ClientFormData => {
    if (!data.nome && userData.nome) {
      data.nome = userData.nome
    }
    if (!data.email && userData.email) {
      data.email = userData.email
    }

    // Converte a data do formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
    if (data.dataAgendada) {
      const [day, month, year] = data.dataAgendada.split('/')
      data.dataAgendada = `${year}-${month}-${day}`
    }

    if (data.foto) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value instanceof File ? value : String(value))
        }
      })
      return formData
    }
    return data
  }

  const onSubmit = async (data: ClientFormData) => {
    if (onStartLoading) onStartLoading()
    try {
      const formData = prepareFormData(data)
      // Limpa o telefone para remover caracteres especiais
      const telefoneLimpo = data.telefone.replace(/\D/g, '')
      setPhone(telefoneLimpo)

      // Checagem se já está logado como Cliente
      const token = Cookies.get('token')

      if (!token) {
        if (!data.cpf || data.cpf.length < 14 || !validaCpf(data.cpf)) {
          toast({
            title: 'CPF inválido. Por favor, verifique e tente novamente.',
          })
          return
        }
      }

      if (token) {
        await criarServico(formData)
        toast({
          variant: 'default',
          title: 'Serviço criado com sucesso!',
        })
        setTimeout(() => {
          onClose()
        }, 500)
        return
      }

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
          toast({
            variant: 'default',
            title: 'Código enviado para seu WhatsApp',
          })
        } else {
          toast({
            title: resultado || 'Erro ao enviar código',
          })
        }
      } else {
        // Se o cliente não existe, cria o cliente e envia o OTP
        const novoCliente = await clientService.criarCliente({
          telefone: telefoneLimpo,
          nome: data.nome,
          email: data.email,
          cpf: data.cpf,
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
            toast({
              variant: 'default',
              title: 'Código enviado para seu WhatsApp',
            })
          } else {
            toast({
              title: resultado || 'Erro ao enviar código',
            })
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar formulário:', error)
      toast({
        title: 'Ocorreu um erro ao processar sua solicitação',
      })
    } finally {
      if (onStopLoading) onStopLoading()
    }
  }

  const servicoAtual = form.watch('servico')

  return (
    <div className="flex flex-col items-center">
      <img
        src="agilizeiLogo.svg"
        alt="Agilizei Logo"
        className="mb-4 w-28 h-28"
      />
      <Modal isVisible={openBudgetModal} onClose={() => setBudgetModal(false)}>
        <div className="flex flex-col items-center gap-4">
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

          <Button onClick={verificarCodigo} className="w-full mt-2">
            Verificar código
          </Button>
        </div>
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
                      }}
                      value={servicoAtual || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposServico.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.nome}>
                            {tipo.nome}
                          </SelectItem>
                        ))}
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
                    <IMaskInput
                      placeholder="Nome completo"
                      {...field}
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
                      onAccept={(value: string) => {
                        field.onChange(value)
                        setCep(value.replace(/\D/g, ''))
                      }}
                      value={cep}
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
                  <DayPicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormDescription className="mb-4">
            * Seu endereço será compartilhado apenas com um dos nossos parceiros
            após a sua confirmação do serviço.
          </FormDescription>

          <SpecificFields servico={servicoAtual} control={form.control} />

          {!servicosComDescricaoEspecifica.includes(servicoAtual) && (
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
                      onChange={(e) => {
                        // Captura o primeiro arquivo selecionado
                        const file = e.target.files?.[0] || null
                        onChange(file)
                      }}
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
