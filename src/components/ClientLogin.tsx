import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IMaskInput } from 'react-imask'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { api } from '@/services/api'
import Modal from './Modal'
import { ClientForm } from '.'
import { useAuth } from '@/contexts/useAuth'
import Cookies from 'js-cookie'
import { useToast } from '@/components/hooks/use-toast'

interface Props {
  onClose: () => void
}

export default function ClientLogin({ onClose }: Props) {
  const [openBudgetModal, setBudgetModal] = useState(false)
  const [telefone, setTelefone] = useState('')
  const [step, setStep] = useState<'telefone' | 'otp'>('telefone')
  const [codigo, setCodigo] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  //Verificar se o usuário existe no banco de dados
  const verificarUsuario = async (telefoneCliente: string) => {
    try {
      console.log('verificarUsuario sujo', telefoneCliente)
      const telefoneLimpo = telefoneCliente.replace(/\D/g, '')
      const { data } = await api.get(`/clientes/telefone/${telefoneLimpo}`)
      console.log('dataUserVerificaUsuario', data.data.telefone)
      if (data) {
        setStep('otp')
        return enviarCodigo(data.data.telefone)
      }
    } catch (e) {
      setBudgetModal(true)
      console.log(e)
    }
  }

  const enviarCodigo = async (telefoneCliente: string) => {
    const telefoneLimpo = telefoneCliente.replace(/\D/g, '')
    console.log('enviar codigo!! ' + telefoneLimpo)
    try {
      const { data } = await api.post('/auth/enviar-otp', {
        telefone: telefoneLimpo,
        tipo: 'cliente',
      })
      if (data) {
        setStep('otp')
        toast({
          variant: 'default',
          title: 'Código enviado para seu WhatsApp',
        })
      } else {
        toast({
          title: data.erro || 'Erro ao enviar o código.',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      toast({
        title: error.response?.data?.erro || 'Erro ao enviar o código.',
      })
    }
  }

  const verificarCodigo = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
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
        toast({
          variant: 'default',
          title: 'Login realizado com sucesso!',
        })

        setTimeout(() => {
          navigate('/cliente')
          onClose()
        }, 1500)
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

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <img src="agilizeiLogo.svg" alt="Logo" className="w-24 h-24" />

      {step === 'telefone' && (
        <>
          <label htmlFor="tel" className="text-sm font-medium">
            Digite seu telefone com DDD
          </label>
          <IMaskInput
            mask="(00) 00000-0000"
            value={telefone}
            onAccept={(value: string) => setTelefone(value)}
            overwrite
            placeholder="(99) 99999-9999"
            className="border border-input bg-background text-sm rounded-md px-3 py-2 w-full"
          />
          <Button
            onClick={() => verificarUsuario(telefone)}
            className="w-full"
            disabled={telefone.replace(/\D/g, '').length < 11}
          >
            Entrar
          </Button>
        </>
      )}

      {step === 'otp' && (
        <>
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
        </>
      )}

      <Modal isVisible={openBudgetModal} onClose={() => setBudgetModal(false)}>
        <ClientForm telefone={telefone} onClose={() => setBudgetModal(false)} />
      </Modal>
    </div>
  )
}
