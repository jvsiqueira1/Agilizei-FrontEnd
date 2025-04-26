import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form'
import { ClientFormData } from '@/types'
import { Control } from 'react-hook-form'

interface Props {
  servico: string
  control: Control<ClientFormData>
}

export default function SpecificFields({ servico, control }: Props) {
  switch (servico) {
    case 'Faxineira':
      return (
        <>
          <FormField
            control={control}
            name="tamanhoImovel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamanho do imóvel</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2 quartos, 1 sala..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tipoLimpeza"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de limpeza</FormLabel>
                <FormControl>
                  <Input placeholder="Básica, pesada, pós-obra..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="frequencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <FormControl>
                  <Input placeholder="Única, semanal, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e horário preferidos</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Segunda às 8h" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="extras"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviços adicionais</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: passar roupas, limpar janelas..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    case 'Pintor':
      return (
        <>
          <FormField
            control={control}
            name="tipoImovel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de imóvel</FormLabel>
                <FormControl>
                  <Input placeholder="Casa, apartamento, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="superficie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Superfícies a serem pintadas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paredes, teto, janelas..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="condicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condições das superfícies</FormLabel>
                <FormControl>
                  <Textarea placeholder="Precisa de reparo? Mofo?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="prazo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo para conclusão</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: até o fim do mês" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    case 'Eletricista':
      return (
        <>
          <FormField
            control={control}
            name="tipoServicoEletrico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de serviço elétrico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instalação, troca de disjuntor..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="descricaoProblema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do problema</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalhe o que está acontecendo..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    case 'Montador de Móveis':
      return (
        <>
          <FormField
            control={control}
            name="descricaoMoveis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição dos móveis</FormLabel>
                <FormControl>
                  <Textarea placeholder="Guarda-roupa, mesa, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="quantidadeMoveis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    case 'Pedreiro':
      return (
        <>
          <FormField
            control={control}
            name="descricaoServicoPedreiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do serviço</FormLabel>
                <FormControl>
                  <Textarea placeholder="Assentamento, reboco..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="areaMetragem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área aproximada</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20m²" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    case 'Freteiro':
      return (
        <>
          <FormField
            control={control}
            name="descricaoItens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Itens para transporte</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Caixas, geladeira, sofá..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="origemDestino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origem e destino</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Bairro A → Bairro B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
    default:
      return null
  }
}
