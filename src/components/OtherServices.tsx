import { useForm } from 'react-hook-form'
import { api } from '@/services/api'
import { Button } from './ui/button'
import { useToast } from './hooks/use-toast'
import { IMaskInput } from 'react-imask'

export default function OtherServices({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const { register, handleSubmit, reset, setValue } = useForm()

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
        Preencha os campos abaixo e entraremos em contato.
      </p>

      <IMaskInput
        mask="(00) 00000-0000"
        {...register('telefone', { required: true })}
        onAccept={(value: string) => {
          const telefoneLimpo = value.replace(/\D/g, '')
          setValue('telefone', telefoneLimpo)
        }}
        placeholder="(00) 00000-0000"
        className="w-full border border-gray-300 p-2 rounded"
      />

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

      <Button type="submit" className="w-full bg-orange text-white">
        Enviar
      </Button>
    </form>
  )
}
