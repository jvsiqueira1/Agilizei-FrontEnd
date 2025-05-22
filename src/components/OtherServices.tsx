import { useForm } from 'react-hook-form'
import { api } from '@/services/api'
import { Button } from './ui/button'
import { useToast } from './hooks/use-toast'
import { IMaskInput } from 'react-imask'
import { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export default function OtherServices({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm()
  const telefone = watch('telefone')

  const [codigo, setCodigo] = useState('')
  const [otpEnviado, setOtpEnviado] = useState(false)
  const [verificado, setVerificado] = useState(false)

  const enviarCodigo = async () => {
    try {
      await api.post('/auth/enviar-otp', { telefone, tipo: 'generico' })
      setOtpEnviado(true)
      toast({
        variant: 'default',
        title: 'Código enviado via WhatsApp',
      })
    } catch {
      toast({
        title: 'Erro ao enviar código',
      })
    }
  }

  const verificarCodigo = async () => {
    try {
      const res = await api.post('/auth/verificar', { telefone, codigo })
      if (res.data?.sucesso) {
        setVerificado(true)
        toast({
          variant: 'default',
          title: 'Telefone verificado com sucesso',
        })
      }
    } catch {
      toast({
        title: 'Código inválido ou expirado',
      })
    }
  }

  const onSubmit = async (data: unknown) => {
    try {
      await api.post('/outros-servicos', data)
      toast({
        variant: 'default',
        title: 'Contato enviado com sucesso!',
      })
      reset()
      onClose()
    } catch {
      toast({
        title: 'Erro ao enviar contato',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Deseja outro tipo de serviço?</h2>
      <p className="text-gray-600">
        Preencha os campos abaixo e valide seu número antes de enviar.
      </p>

      {(!otpEnviado || verificado) && (
        <IMaskInput
          mask="(00) 00000-0000"
          value={telefone}
          {...register('telefone', { required: true })}
          onAccept={(value: string) => {
            const telefoneLimpo = value.replace(/\D/g, '')
            setValue('telefone', telefoneLimpo)
          }}
          placeholder="(00) 00000-0000"
          className="w-full border border-gray-300 p-2 rounded"
          disabled={verificado}
        />
      )}

      {!otpEnviado && (
        <Button
          type="button"
          className="w-full bg-orange text-white"
          onClick={enviarCodigo}
          disabled={!telefone}
        >
          Enviar código de verificação
        </Button>
      )}

      {otpEnviado && !verificado && (
        <>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={codigo} onChange={setCodigo}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="button"
            className="w-full bg-orange text-white mt-2"
            onClick={verificarCodigo}
            disabled={codigo.length !== 6}
          >
            Verificar código
          </Button>
        </>
      )}

      {verificado && (
        <>
          <input
            type="text"
            {...register('tipoServico', { required: true })}
            placeholder="Nome do serviço desejado"
            className="w-full border border-gray-300 p-2 rounded"
          />

          <textarea
            {...register('descricao', { required: true })}
            placeholder="Descreva sua necessidade"
            className="w-full border border-gray-300 p-2 rounded"
            rows={4}
          />

          <Button
            type="submit"
            className="w-full bg-orange text-white"
            disabled={isSubmitting}
          >
            Enviar
          </Button>
        </>
      )}
    </form>
  )
}
