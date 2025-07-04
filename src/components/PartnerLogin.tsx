import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IMaskInput } from 'react-imask'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/useAuth'
import Cookies from 'js-cookie'
import { useToast } from '@/components/hooks/use-toast'
import { PartnerForm } from './index'
import Modal from './Modal'

interface Props {
  onClose: () => void
}

export default function PartnerLogin({ onClose }: Props) {
  const [openPartnerFormModal, setOpenPartnerFormModal] = useState(false)
  const [telefone, setTelefone] = useState('')
  const [step, setStep] = useState<'telefone' | 'otp'>('telefone')
  const [codigo, setCodigo] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const verificarParceiro = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
    try {
      const { data } = await api.get(`/profissionais/telefone/${telefoneLimpo}`)
      if (data && data.data && data.data.telefone) {
        await enviarCodigo()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      if (error.response?.status === 404) {
        setOpenPartnerFormModal(true)
        toast({
          title: 'Telefone não cadastrado como parceiro.',
          description:
            'Por favor, verifique o número digitado ou entre em contato.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao verificar o telefone.',
          description:
            error.response?.data?.erro || 'Tente novamente mais tarde.',
          variant: 'destructive',
        })
      }
    }
  }

  const enviarCodigo = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
    try {
      const { data } = await api.post('/auth/enviar-otp', {
        telefone: telefoneLimpo,
        tipo: 'parceiro',
      })
      if (data.sucesso) {
        setStep('otp')
        toast({
          variant: 'default',
          title: 'Código enviado para seu WhatsApp',
        })
      } else {
        toast({
          title: 'Erro ao enviar o código',
          description: data.erro,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro ao enviar o código.',
      })

      if (error.response?.status === 404) {
        toast({
          title: `${error.response.data.erro}`,
        })
      }
    }
  }

  const verificarCodigo = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
    try {
      const { data } = await api.post('/auth/verificar-otp', {
        telefone: telefoneLimpo,
        codigo,
      })

      if (data.sucesso && data.token && data.usuario) {
        Cookies.set('token', data.token, { expires: 1 })
        Cookies.set('nome', data.usuario.nome)
        login('partner', data.token)
        toast({ variant: 'default', title: 'Login realizado com sucesso!' })

        setTimeout(() => {
          onClose()
          navigate('/parceiro')
        }, 1500)
      } else {
        toast({ title: 'Código incorreto.', description: data.erro })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      toast({ title: 'Erro ao verificar código.' })
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
            onAccept={(val) => setTelefone(val)}
            placeholder="(99) 99999-9999"
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button
            onClick={verificarParceiro}
            className="w-full"
            disabled={telefone.replace(/\D/g, '').length < 11}
          >
            Enviar código por WhatsApp
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

      <Modal
        isVisible={openPartnerFormModal}
        onClose={() => setOpenPartnerFormModal(false)}
      >
        <PartnerForm telefone={telefone} />
      </Modal>
    </div>
  )
}
