import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IMaskInput } from 'react-imask'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/useAuth'

interface Props {
  onClose: () => void
}

export default function PartnerLogin({ onClose }: Props) {
  const [telefone, setTelefone] = useState('')
  const [step, setStep] = useState<'telefone' | 'otp'>('telefone')
  const [codigo, setCodigo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const enviarCodigo = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
    try {
      const { data } = await api.post('/auth/enviar-otp', {
        telefone: telefoneLimpo,
        tipo: 'parceiro',
      })

      if (data.sucesso) {
        setStep('otp')
        setMensagem('Código enviado para seu WhatsApp')
      } else {
        setMensagem(data.erro || 'Erro ao enviar o código')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      setMensagem('Erro ao enviar o código.')

      if (error.response?.status === 404) {
        setMensagem(`${error.response.data.erro}`)
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

      if (data.sucesso) {
        setMensagem('Login realizado com sucesso!')
        setTimeout(() => {
          onClose()
          login('partner')
          navigate('/partner')
        }, 1500)
      } else {
        setMensagem(data.erro || 'Código incorreto.')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      setMensagem('Erro ao verificar código.')
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
            onClick={enviarCodigo}
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

      {mensagem && (
        <p className="text-sm text-muted-foreground text-center">{mensagem}</p>
      )}
    </div>
  )
}
