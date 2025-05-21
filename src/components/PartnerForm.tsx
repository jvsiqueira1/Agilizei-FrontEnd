import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { IMaskInput } from 'react-imask'
import { PartnerFormType } from '@/types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Modal } from '@/components'
import { api } from '@/services/api'
import { partnerService } from '@/services/partner'
import { useAuth } from '@/contexts/useAuth'
import { useToast } from '@/components/hooks/use-toast'
import { validaCpfCnpj } from '@/lib/validations'

// Função para verificar a validade da data de nascimento
const isValidDate = (dateString: string) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = dateString.match(regex)
  if (!match) return false

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  const year = parseInt(match[3], 10)

  const date = new Date(year, month, day)
  return (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
  )
}

// Função para calcular a idade a partir da data de nascimento
const calculateAge = (birthDate: string) => {
  const birthDateObj = new Date(birthDate.split('/').reverse().join('-'))
  const ageDiff = new Date().getFullYear() - birthDateObj.getFullYear()
  const monthDiff = new Date().getMonth() - birthDateObj.getMonth()
  const dayDiff = new Date().getDate() - birthDateObj.getDate()

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return ageDiff - 1
  }
  return ageDiff
}

const tipoServicoMap: Record<string, number> = {
  Faxineira: 1,
  Eletricista: 2,
  Pintor: 3,
  'Montador de Móveis': 4,
  Jardineiro: 5,
  Freteiro: 6,
  Pedreiro: 7,
}

export default function PartnerForm() {
  const [otp, setOtp] = useState('')
  const [openOtpModal, setOpenOtpModal] = useState(false)
  const [isValidAge, setIsValidAge] = useState(true)
  const [cpfCnpjValue, setCpfCnpjValue] = useState('')
  const [isCpfCnpjValid, setIsCpfCnpjValid] = useState(true)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const form = useForm<PartnerFormType>({
    defaultValues: {
      nome: '',
      email: '',
      cpfCnpj: '',
      dataNascimento: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      tipoServico: '',
      fotoDocumento: undefined,
      termosAceitos: false,
    },
  })

  // Função que será chamada quando o usuário terminar de digitar a data
  const handleDateChange = (date: string) => {
    if (isValidDate(date)) {
      const age = calculateAge(date)
      setIsValidAge(age >= 18)
    } else if (date.length === 10) {
      setIsValidAge(false)
      toast({
        title: 'Digite uma data de nascimento válida.',
      })
    }
  }

  useEffect(() => {
    if (cpfCnpjValue.length === 0) {
      setIsCpfCnpjValid(true) // nada digitado = válido para não bloquear
      return
    }

    // só validar se tiver tamanho possível de CPF (14 chars máscara) ou CNPJ (18 chars)
    if (cpfCnpjValue.length !== 14 && cpfCnpjValue.length !== 18) {
      setIsCpfCnpjValid(true) // ainda digitando, não bloqueia
      return
    }

    const handler = setTimeout(() => {
      const valido = validaCpfCnpj(cpfCnpjValue)
      if (!valido) {
        toast({
          title: 'Digite um CPF ou CNPJ válido.',
        })
        setCpfCnpjValue('')
        setIsCpfCnpjValid(false)
      } else {
        setIsCpfCnpjValid(true)
      }
    }, 1000)

    return () => clearTimeout(handler)
  }, [cpfCnpjValue, toast])

  const onSubmit = async (data: PartnerFormType) => {
    try {
      // Verificar se a data de nascimento é válida
      if (!isValidDate(data.dataNascimento)) {
        return toast({
          title: 'Data de nascimento inválida. Use o formato Dia/Mês/Ano.',
        })
      }

      const tipoServicoId = tipoServicoMap[data.tipoServico]
      if (!tipoServicoId) return toast({ title: 'Tipo de serviço inválido.' })

      const telefone = data.telefone.replace(/\D/g, '')
      const documento = data.cpfCnpj.replace(/\D/g, '')
      const enderecoCompleto = `${data.logradouro}${data.numero ? ', ' + data.numero : ''}${
        data.complemento ? ' - ' + data.complemento : ''
      } - ${data.bairro} - ${data.cidade} - ${data.estado}`

      const payload = {
        nome: data.nome,
        email: data.email,
        telefone,
        dataNascimento: data.dataNascimento,
        endereco: enderecoCompleto,
        tipoServicoId,
        cpfCnpj: documento,
        fotoDocumento: data.fotoDocumento?.[0],
      }

      await partnerService.criarPartner(payload)
      await api.post('/auth/enviar-otp', { telefone, tipo: 'parceiro' })
      setOpenOtpModal(true)
      toast({ variant: 'default', title: 'Código enviado via WhatsApp.' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao cadastrar ou enviar OTP.' })
    }
  }

  const verificarCodigo = async () => {
    const telefone = form.getValues('telefone').replace(/\D/g, '')
    try {
      const { data } = await api.post('/auth/verificar-otp', {
        telefone,
        codigo: otp,
        tipo: 'parceiro',
      })
      if (data.sucesso && data.token) {
        Cookies.set('token', data.token, { expires: 1 })
        login('partner', data.token)
        toast({
          variant: 'default',
          title: 'Login realizado com sucesso.',
        })
        setTimeout(() => navigate('/parceiro'), 1000)
      } else {
        toast({
          title: data.erro || 'Código incorreto.',
        })
      }
    } catch {
      toast({
        title: 'Erro ao verificar código.',
      })
    }
  }

  return (
    <>
      <Modal isVisible={openOtpModal} onClose={() => setOpenOtpModal(false)}>
        <div className="flex flex-col items-center gap-4">
          <label className="text-sm font-medium">Digite o código</label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={verificarCodigo} className="w-full">
            Verificar
          </Button>
        </div>
      </Modal>

      <Form {...form}>
        <div className="flex justify-center mb-4">
          <img
            src="agilizeiLogo.svg"
            alt="Agilizei Logo"
            className="w-24 h-24"
          />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite seu nome"
                      type="text"
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
                      {...field}
                      placeholder="Digite seu e-mail"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask={[
                        { mask: '000.000.000-00', maxLength: 14 },
                        { mask: '00.000.000/0000-00', maxLength: 18 },
                      ]}
                      dispatch={(appended, dynamicMasked) => {
                        const number = (dynamicMasked.value + appended).replace(
                          /\D/g,
                          '',
                        )
                        if (number.length > 11) {
                          return dynamicMasked.compiledMasks.find(
                            (m) => m.mask === '00.000.000/0000-00',
                          )
                        }
                        return dynamicMasked.compiledMasks.find(
                          (m) => m.mask === '000.000.000-00',
                        )
                      }}
                      className="flex h-10 w-full rounded-md border border-orange px-3 py-2"
                      placeholder="Digite seu CPF ou CNPJ"
                      onAccept={(value: string) => {
                        field.onChange(value)
                        setCpfCnpjValue(value)
                      }}
                      value={cpfCnpjValue}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask="00/00/0000"
                      className="flex h-10 w-full rounded-md border border-orange px-3 py-2"
                      onAccept={(value: string) => {
                        field.onChange(value)
                        handleDateChange(value)
                      }}
                      placeholder="Dia/Mês/Ano"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      className="flex h-10 w-full rounded-md border border-orange px-3 py-2"
                      onAccept={(value: string) => field.onChange(value)}
                    />
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
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      mask="00000-000"
                      placeholder="CEP"
                      className="flex h-10 w-full rounded-md border border-orange px-3 py-2"
                      onAccept={async (value: string) => {
                        field.onChange(value)
                        if (value.length === 9) {
                          const response = await fetch(
                            `https://viacep.com.br/ws/${value.replace('-', '')}/json/`,
                          )
                          const data = await response.json()
                          if (!data.erro) {
                            form.setValue('logradouro', data.logradouro || '')
                            form.setValue('bairro', data.bairro || '')
                            form.setValue('cidade', data.localidade || '')
                            form.setValue('estado', data.uf || '')
                          }
                        }
                      }}
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
                    <Input {...field} placeholder="Logradouro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Número" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Complemento" />
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
                    <Input {...field} placeholder="Bairro" />
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
                    <Input {...field} placeholder="Cidade" />
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
                    <Input {...field} placeholder="Estado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tipoServico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(tipoServicoMap).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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
            name="fotoDocumento"
            render={({ field: { onChange, ref } }) => (
              <FormItem>
                <FormLabel>Documento com foto</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/png, image/jpg"
                    onChange={(e) => onChange(e.target.files)}
                    ref={ref}
                    className="file-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termosAceitos"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    Aceito os{' '}
                    <a
                      href="/TermodeUso.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Termos de Uso
                    </a>
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" disabled={!isValidAge && !isCpfCnpjValid}>
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
